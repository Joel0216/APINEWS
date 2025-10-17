const { Sequelize } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      // NO crear timestamps ni cambiar nombres automáticamente fuera de lo que indiquemos
      timestamps: true,           // tus tablas tienen createdAt/updatedAt
      freezeTableName: true       // respetar el nombre EXACTO de tableName
    }
  }
);

async function testConnection() {
  try {
    await connection.authenticate();
    console.log('✅ Conexión MySQL OK');
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }
}

module.exports = { connection, testConnection };
