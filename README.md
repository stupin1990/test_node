## Initial setup
1. Create file config.js, copy content from config-sample.js to it and fill your access data.
2. Execute file migration.sql to create database and tables
3. npm install
4. npm run start

## Api endpoints
1. GET: /list-items
2. GET: /top-up-balance?user_id=[user_id]
3. POST: /callback
  {
    "id": "string",
    "status": "paid" | "refused",
    "amount": "number"
  }
