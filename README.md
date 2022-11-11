## 1. Часть - Апи получения предметов с ценами из api.skinport.com

## GET /list-items
Получает список объектов из апи https://api.skinport.com/v1/items
На выходе массив объектов, где указаны market_hash_name, min_price, min_price_tradable
Полученные записи сохраняются в кеше в течении 5 минут.

## 2. Часть - API пополнения балансов пользователей состоящее из 3-х endpoint
Есть таблицы: 
  users [id, name, balance, last_payment_at]
  payments [id, user_id, payment_id, amount, status]

## GET /top-up-balance?user_id=[number]
Пополнить баланс пользователя через демоверсию платежной системы
Апи делает запрос по url https://demo-paygate.steaminventoryhelper.com/invoice, который через 5 секунд должен ответеть на 3-й метод апи /callback
Тут создается запись в таблице payments c переданным user_id, полученным payment_id и со статусом waiting.

## POST /callback
Этот метод в теле запроса принимает следующие данные:
id: string (payment_id который вернуло апи demo-paygate на предыдущем этапе)
status: 'paid' | 'refused' (стату платежа)
amount: number (сумма пополнения)
Тут проверяется существующая запась в таблице payments по payment_id и если статус paid, баланс пользователя пополняется на сумму amount.


## Установка
1. cp ./src/config-sample.js ./src/config.js заменить данные для подключения к бд.
2. Выполнить миграцию migration.sql
3. npm install
4. npm run start
5. npm tests

## Api endpoints
1. GET: /list-items
2. GET: /top-up-balance?user_id=[1,2,3]
3. POST: /callback
  {
    "id": "string",
    "status": "paid" | "refused",
    "amount": "number"
  }
