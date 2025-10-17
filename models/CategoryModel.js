const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');

const Category = connection.define('categories', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  descripcion: { type: DataTypes.STRING(255), allowNull: false },
  activo: {
    type: DataTypes.BLOB('tiny'), allowNull: false, defaultValue: 1,
    get() {
      const v = this.getDataValue('activo');
      return Buffer.isBuffer(v) ? v[0] === 1 : !!v;
    },
    set(val) { this.setDataValue('activo', val ? 1 : 0); }
  },
  UserAlta:  { type: DataTypes.STRING(20), allowNull: false },
  FechaAlta: { type: DataTypes.DATE, allowNull: false },
  UserMod:   { type: DataTypes.STRING(20), allowNull: false },
  FechaMod:  { type: DataTypes.DATE, allowNull: false },
  UserBaja:  { type: DataTypes.STRING(20), allowNull: false },
  FechaBaja: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'categories',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = { Category };
