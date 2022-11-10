const axios = require('axios')
const Config = require("../config.js");

module.exports = function(pool) {
    return {
        topUpBalance: async function() {
            let request = this.request

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
            let request = this.request

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
