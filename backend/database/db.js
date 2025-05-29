// backend/database/db.js

const mysql = require("mysql2"); // mysql에서 mysql2로 변경

const conn = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root", // 사용자
  password: "0203", // 비밀번호에
  database: "weather",
});

conn.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to the database");
});

module.exports = conn;
