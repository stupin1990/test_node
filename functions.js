const axios = require('axios')
const { Pool } = require('pg')
const Config = require("./config.js");

const pool = new Pool(Config.DB)

module.exports = {
    getItemsMinPrices: async function() {
        var data_nontradable, data_tradable = []

        let url = 'https://api.skinport.com/v1/items?app_id=730&currency=EUR'
        try {
            let response_nt = await axios.get(url + '&tradable=0')
            data_nontradable = response_nt.data ? response_nt.data : null

            let response_t = await axios.get(url + '&tradable=1')
            data_tradable = response_t.data ? response_t.data : null
        } catch (error) {
            console.log(error.response.body)
        }


        if (data_nontradable && data_tradable) {
            data_nontradable.map((item, i) => {
                if (data_tradable[i] !== undefined && data_tradable[i].market_hash_name == item.market_hash_name) {
                    item.min_price_tradable = data_tradable[i].min_price
                }
            })

        }

        return data_nontradable
    },

    topUpBalance: async function(request) {
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

            let resp = await axios.post('https://demo-paygate.steaminventoryhelper.com/invoice', data)
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

    topUpBalanceCallback: async function(request) {
        if (request.body === undefined || request.body.id === undefined || request.body.status === undefined || request.body.amount === undefined) {
            return {
                'status': 'Error',
                'message': 'Invalid data format'
            }
        }

        try {
            const { rows } = await pool.query('SELECT * FROM payments WHERE payment_id = $1 AND status = $2', [request.body.id, request.body.status])
            if (!rows.length) {
                await pool.query("UPDATE payments SET amount = $1, status = $2 WHERE payment_id = $3", [request.body.amount, request.body.status, request.body.id])

                if (request.body.status == 'paid') {
                    await pool.query(`UPDATE users 
                        SET balance = balance + $1 
                        WHERE id = (SELECT user_id FROM payments WHERE payment_id = $2)`, [request.body.amount, request.body.id])
                }
            }
        } catch (error) {
            return {
                'status': 'Error',
                'message': error.toString()
            }
        }

        return []
    }
}