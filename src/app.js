const { Pool } = require('pg')
const axios = require('axios')
const Config = require("./config.js")
const Cache = require("./modules/cache.js")
const Items = require("./modules/items.js")
const Balance = require("./modules/balance.js")

const pool = new Pool(Config.DB)
const cache = new Cache(pool)

module.exports = function () {
    return {
        Config: Config,
        axios: axios,
        setParams: function(req, res) {
            this.request = req
            this.response = res
        },
        ...new Items(cache),
        ...new Balance(pool)
    }
}
