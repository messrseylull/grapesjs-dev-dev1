const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Statik dosyaları sun (index.html'in açılması için)
app.use(express.static(__dirname));

// MySQL Veritabanı Bağlantısı (Retry Mantığı ile)
let db;

function connectToDatabase() {
  db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'deneme',
  });

  db.connect((err) => {
    if (err) {
      console.error('MySQL bağlantı hatası, 3 saniye içinde tekrar denenecek...', err.message);
      setTimeout(connectToDatabase, 3000);
      return;
    }
    console.log('MySQL sunucusuna bağlanıldı.');

    // Veritabanını oluştur (Eğer yoksa)
    const dbName = process.env.DB_NAME || 'office_db';
    db.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
      if (err) throw err;
      console.log(`${dbName} veritabanı kontrol edildi/oluşturuldu.`);

      // Veritabanını kullan
      db.changeUser({ database: dbName }, (err) => {
        if (err) throw err;
        
        // Tabloyu oluştur
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS kayitlar (
            id INT AUTO_INCREMENT PRIMARY KEY,
            datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
            data JSON
          )
        `;
        db.query(createTableQuery, (err) => {
          if (err) throw err;
          console.log("kayitlar tablosu kontrol edildi/oluşturuldu.");
        });
      });
    });
  });
}

connectToDatabase();

// API Endpoint: /api/login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Örnek Kullanıcı Doğrulaması
  if (username === 'admin' && password === '1234') {
    res.json({ success: true, message: 'Giriş başarılı' });
  } else {
    res.status(401).json({ success: false, message: 'Hatalı giriş' });
  }
});

// API Endpoint: /api/kaydet
app.post('/api/kaydet', (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Veri bulunamadı.' });
  }

  const insertQuery = "INSERT INTO kayitlar (data) VALUES (?)";
  
  db.query(insertQuery, [data], (err, result) => {
    if (err) {
      console.error('Veritabanına kayıt hatası:', err);
      return res.status(500).json({ error: 'Veri kaydedilirken bir hata oluştu.' });
    }
    res.status(200).json({ message: 'Kayıt başarıyla eklendi!', id: result.insertId });
  });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} portunda çalışıyor.`);
});
