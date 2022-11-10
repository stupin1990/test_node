const DB_Config = {
    host: '',
    user: '',
    password: '',
    database: '',
    port: 5432,
}

module.exports = {
    DB: DB_Config,
    local_ip: '',    // If defined will send to invoice request instead local ip
    skin_api_url: 'https://api.skinport.com/v1/items?app_id=730&currency=EUR',
    topup_invoice_url: 'https://demo-paygate.steaminventoryhelper.com/invoice'
}