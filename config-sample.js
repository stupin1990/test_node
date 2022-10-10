const DB_Config = {
    host: '',
    user: '',
    password: '',
    database: '',
    port: 5432,
}

module.exports = {
    DB: DB_Config,
    local_ip: ''    // If defined will send to invoice request instead local ip
}