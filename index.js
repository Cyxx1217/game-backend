const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// 註冊帳號
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email],
      function (err) {
        if (err) {
          return res.status(400).json({ error: '註冊失敗，可能使用者名稱或電子郵件已存在' });
        }
        res.json({ message: '註冊成功' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 登入
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: '使用者不存在' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      res.json({ message: '登入成功' });
    } else {
      res.status(400).json({ error: '密碼錯誤' });
    }
  });
});

// 取得排行榜
app.get('/leaderboard', (req, res) => {
  db.all('SELECT username, score FROM Leaderboard ORDER BY score DESC LIMIT 10', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '無法取得排行榜' });
    }
    res.json(rows);
  });
});

// 上傳分數
app.post('/score', (req, res) => {
  const { username, score } = req.body;
  db.run(
    'INSERT OR REPLACE INTO Leaderboard (username, score) VALUES (?, ?)',
    [username, score],
    function (err) {
      if (err) {
        return res.status(500).json({ error: '分數上傳失敗' });
      }
      res.json({ message: '分數上傳成功' });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`伺服器運行在端口 ${PORT}`));