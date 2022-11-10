const Data = function(pool) {
    return {
        getItemsFromCache: async function() {
            try {
                const { rows } = await pool.query("SELECT data FROM cache WHERE updated_at > NOW() - INTERVAL '5' MINUTE")
        
                if (!rows.length) {
                    return []
                }
        
                return rows[0].data
            } catch (error) {
                return []
            }
        },

        setItemsToCache: async function(data) {
            try {
                const { rows } = await pool.query('SELECT COUNT(*) FROM cache')
                if (rows[0].count != 0) {
                    await pool.query("UPDATE cache SET data = $1, updated_at = NOW()", [JSON.stringify(data)])
                }
                else {
                    await pool.query("INSERT INTO cache (data, updated_at) VALUES ($1, NOW())", [JSON.stringify(data)])
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}

module.exports = Data