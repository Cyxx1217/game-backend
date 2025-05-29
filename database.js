const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('game.db', (err) => {
  if (err) {
    console.error('資料庫連線失敗:', err.message);
  } else {
    console.log('連接到 SQLite 資料庫');
    // 建立 Users 表
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT UNIQUE
      )
    `);
    // 建立 Leaderboard 表
    db.run(`
      CREATE TABLE IF NOT EXISTS Leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        score INTEGER
      )
    `);
  }
});

module.exports = db;