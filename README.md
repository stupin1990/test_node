## Задача сделать API состоящее из 3-х endpoint

## 1. GET /list-items
Получает список объектов из апи https://api.skinport.com/v1/items
На выходе массив объектов, где указаны market_hash_name, min_price, min_price_tradable
Полученные записи сохраняются в кеше в течении 5 минут.

## 2. GET /top-up-balance?user_id=[number]
Пополнить баланм пользователя через демоверсию платежной системы
Есть 2 таблицы в бд postgres: users, payments
Апи делает запрос по url https://demo-paygate.steaminventoryhelper.com/invoice, который через 5 секунд должен ответеть на 3-й метод апи /callback

Тут создается запись в таблице payments c переданным user_id и со статусом waiting.

## 3. POST /callback
Этот метод в теле запроса принимает следующие данные:
id: string (id который вернуло апи demo-paygate на предыдущем этапе)
status: 'paid' | 'refused' (стату платежа)
amount: number (сумма пополнения)
Тут проверяется существующая запась в таблице payments по payment_id и если статус paid, баланс пользователя пополняется на сумму amount.


## Initial setup
1. Create file config.js, copy content from config-sample.js to it and fill your access data.
2. Execute file migration.sql to create database and tables
3. npm install
4. npm run start

## Api endpoints
1. GET: /list-items
2. GET: /top-up-balance?user_id=[1,2,3]
3. POST: /callback
  {
    "id": "string",
    "status": "paid" | "refused",
    "amount": "number"
  }
