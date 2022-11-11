module.exports = function(cache) {
    return {
        loadItems: async function(url) {
            const data = [0, 1].map(tradable => new Promise(async (resolve, reject) => {
                try {
                    resolve((await this.axios.get(url + '&tradable=' + tradable)) ?.data)
                } catch (error) {
                    reject([])
                }
            }))

            try {
                let results = await Promise.all(data)
                return results
            }
            catch (error) {
                console.log(error)
            }
        },

        joinItems: async function (data_nontradable, data_tradable) {
            if (data_nontradable === undefined || data_tradable === undefined) {
                return false
            }

            if (!data_nontradable.length && !data_tradable.length) {
                return false
            }

            let result = []

            let data_tradable_map = new Map(data_tradable.map(item => [item.market_hash_name, item.min_price]))
            data_nontradable.map(item => {
                result = [...result, {
                    market_hash_name: item.market_hash_name,
                    min_price: item.min_price,
                    min_price_tradable: data_tradable_map.get(item.market_hash_name)
                }]
            })

            return result
        },

        getItemsMinPrices: async function() {
            let result = []

            result = await cache.getItemsFromCache()
            if (result.length) {
                return result
            }

            try {
                let data = await this.loadItems(this.Config.skin_api_url)

                result = await this.joinItems(...data)

                if (result === false) {
                    return {'error': 'Something went wrong!'}
                }

                await cache.setItemsToCache(result)
            } catch (error) {
                console.log(error)
            }

            return result
        }
    }
}
