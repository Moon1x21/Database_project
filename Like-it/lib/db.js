const mysql = require('mysql2');


module.exports =mysql.createConnection({
    host: "likeit.cxvssfxgv7yf.ap-northeast-2.rds.amazonaws.com",
    user: 'root',
    password: "moonjooeun",
    database: 'likeit'
  });