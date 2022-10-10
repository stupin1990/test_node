const express = require("express")
const bodyParser = require('body-parser')
const Func = require('./functions.js')


const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())



app.get("/list-items", async function(request, response) {
    let data = await Func.getItemsMinPrices()
    return response.json(data)
})

app.get("/top-up-balance", async function(request, response) {
    let data = await Func.topUpBalance(request)
    return response.json(data)
})

app.post("/callback", async function(request, response) {
    let data = await Func.topUpBalanceCallback(request)
    return response.json(data)
})


app.listen(3000)