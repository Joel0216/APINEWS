const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');

const Profile = connection.define('profiles', {          // <- tableName EXACTO
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
}, {
  tableName: 'profiles',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = { Profile };
