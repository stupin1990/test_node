const Items = require("../modules/items.js")

const items = new Items()

const data_nontradable = [
    {
        "market_hash_name": 'Item 1',
        "min_price": 1.00,
    },
    {
        "market_hash_name": 'Item 2',
        "min_price": 3.00,
    },
    {
        "market_hash_name": 'Item 3',
        "min_price": 4.00,
    }
]

const data_tradable = [
    {
        "market_hash_name": 'Item 1',
        "min_price": 2.00,
    },
    {
        "market_hash_name": 'Item 2',
        "min_price": null,
    }
]

const expected = [
    {
        "market_hash_name": 'Item 1',
        "min_price": 1.00,
        "min_price_tradable": 2.00
    },
    {
        "market_hash_name": 'Item 2',
        "min_price": 3.00,
        "min_price_tradable": null
    },
    {
        "market_hash_name": 'Item 3',
        "min_price": 4.00,
    }
]


test('Invalid join items results', async () => {
    const results = await items.joinItems(data_nontradable, data_tradable)
    expect(JSON.stringify(results)).toBe(JSON.stringify(expected))
});