const axios = require('axios')
const { Pool } = require('pg')
const Config = require("./config.js");
const Cache = require("./cache.js");

const pool = new Pool(Config.DB)
const cache = new Cache(pool)


const Data = function () {
    let request, response = null

    return {
        setRequest: function(req) {
            request = req
        },

        setResponse: function(res) {
            response = res
        },

        getItemsMinPrices: async function() {
            let result = []

            result = await cache.getItemsFromCache()
            if (result.length) {
                return result
            }

            const data = [0, 1].map(tradable => new Promise(async (resolve, reject) => {
                try {
                    resolve((await axios.get(Config.skin_api_url + '&tradable=' + tradable)) ?.data)
                } catch (error) {
                    reject([])
                }
            }))

            try {
                let [data_nontradable, data_tradable] = await Promise.all(data)
                
                let data_tradable_map = new Map(data_tradable.map(item => [item.market_hash_name, item.min_price]))
                data_nontradable.map(item => {
                    result = [...result, {
                        market_hash_name: item.market_hash_name,
                        min_price: item.min_price,
                        min_price_tradable: data_tradable_map.get(item.market_hash_name)
                    }]
                })

                await cache.setItemsToCache(result)
            } catch (error) {
                console.log(error)
            }

            return result
        },

        topUpBalance: async function() {
            if (request.query.user_id === undefined) {
                return {
                    'status': 'Error',
                    'message': 'Specify the user_id'
                }
            }
            
            let user_id = parseInt(request.query.user_id)

            try {
                const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [user_id])

                if (!rows.length) {
                    return {
                        'status': 'Error',
                        'message': 'User not found'
                    }
                }

                let data = Config.local_ip ? {ip: Config.local_ip} : {}

                let resp = await axios.post(Config.topup_invoice_url, data)
                if (resp.data.success) {
                    await pool.query("INSERT INTO payments (user_id, payment_id) VALUES ($1, $2)", [user_id, resp.data.id])

                    return {
                        'status': 'Ok',
                        'payment_id': resp.data.id
                    }
                }

            } catch (error) {
                return {
                    'status': 'Error',
                    'message': error.toString()
                }
            }

            return {
                'status': 'Error',
                'message': 'Unknown Error'
            }
        },

        topUpBalanceCallback: async function() {
            if (request.body === undefined || request.body.id === undefined || request.body.status === undefined || request.body.amount === undefined) {
                return {
                    'status': 'Error',
                    'message': 'Invalid data format'
                }
            }

            try {
                // If user balance was topup less then minute ago, abort
                const { rows } = await pool.query(
                    `SELECT COUNT(payments.id) FROM payments 
                    INNER JOIN users ON users.id = payments.user_id 
                    WHERE payment_id = $1 AND users.last_payment_at > NOW() - INTERVAL '1' MINUTE`
                    , [request.body.id])
                if (rows[0].count != 0) {
                    return []
                }
                
                // Updating user balance if payment status was waiting and became paid
                if (request.body.status == 'paid') {
                    await pool.query(
                        `UPDATE users 
                        SET balance = balance + $1, last_payment_at = NOW()
                        WHERE id = (SELECT user_id FROM payments WHERE payment_id = $2 AND status = 'waiting')`, [request.body.amount, request.body.id])
                }

                // Update payment status if it was waiting
                await pool.query("UPDATE payments SET amount = $1, status = $2 WHERE payment_id = $3 AND status = 'waiting'", [request.body.amount, request.body.status, request.body.id])

            } catch (error) {
                return {
                    'status': 'Error',
                    'message': error.toString()
                }
            }

            return []
        }
    }
}

module.exports = Data