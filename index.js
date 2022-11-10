const Express = require("express")
const BodyParser = require('body-parser')
const App = require('./src/app.js')

const express = Express()

express.use(BodyParser.urlencoded({ extended: true }))
express.use(BodyParser.json())
express.use(BodyParser.raw())

let app = new App()

express.use(function(request, response, next){
    app.setRequest(request);
    app.setResponse(response);
    next();
});

express.get("/list-items", async function(request, response) {
    let data = await app.getItemsMinPrices()
    return response.json(data)
})

express.get("/top-up-balance", async function(request, response) {
    let data = await app.topUpBalance()
    return response.json(data)
})

express.post("/callback", async function(request, response) {
    let data = await app.topUpBalanceCallback()
    return response.json(data)
})


express.listen(3000)