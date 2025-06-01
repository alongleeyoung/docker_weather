// backend/database/db.js

import mysql from "mysql2"; // require → import로 변경

const conn = mysql.createConnection({
  host: process.env.DB_HOST || "mysql",  // Docker 환경에서는 "mysql"
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "0203",
  database: process.env.DB_NAME || "weather",
});

conn.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to the database");
});

export default conn; // module.exports → export default로 변경
