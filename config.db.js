const Sequelize = require('sequelize')
require('dotenv').config();
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = require('./config.js')


const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
});

const testConnection = async () => {
    try {
        await connection.authenticate();
        console.log('✅ Conexión establecida con MySQL (XAMPP)');
    } catch (error) {
        console.error('❌ Error al conectar:', error.message);
        throw error;
    }
};

module.exports = { connection, testConnection };