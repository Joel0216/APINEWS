// config/db.js
// Pool de MySQL para XAMPP usando mysql2/promise y un ping de prueba con log.
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',     // pon tu pass de XAMPP si tienes
  database: process.env.DB_NAME || 'apinews',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

// Probar la conexión al iniciar el servidor (una vez)
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1+1 AS result');
    console.log('✅ Conexión establecida con MySQL (XAMPP)');
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
  }
})();

module.exports = pool;
