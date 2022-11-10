const axios = require('axios')
const Config = require("../config.js");
const Cache = require("./cache.js");


module.exports = function(cache) {
    return {
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
                    console.log(123)
                    reject([])
                }
            }))

            try {
                let [data_nontradable, data_tradable] = await Promise.all(data)

                if (!data_nontradable.length && !data_tradable.length) {
                    return []
                }
                
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
        }
    }
}
