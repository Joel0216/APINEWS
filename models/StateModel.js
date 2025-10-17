const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');

const State = connection.define('states', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  abreviacion: { type: DataTypes.STRING(5), allowNull: false, unique: true },
  activo: {
    type: DataTypes.BLOB('tiny'), allowNull: false, defaultValue: 1,
    get() {
      const v = this.getDataValue('activo');
      if (typeof v === 'number' || typeof v === 'boolean') return !!v;
      return Buffer.isBuffer(v) ? v[0] === 1 : !!v;
    },
    set(val) { this.setDataValue('activo', val ? 1 : 0); }
  },
  UserAlta: { type: DataTypes.STRING(30), allowNull: false },
  FechaAlta: { type: DataTypes.DATE, allowNull: false },
  UserMod:  { type: DataTypes.STRING(30), allowNull: false },
  FechaMod: { type: DataTypes.DATE, allowNull: false },
  UserBaja: { type: DataTypes.STRING(30), allowNull: false },
  FechaBaja:{ type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'states',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = { State };
