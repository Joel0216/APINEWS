const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');
const { Profile } = require('./ProfileModel');

const User = connection.define('users', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  perfil_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  apellidos: { type: DataTypes.STRING(100), allowNull: false },
  nick: { type: DataTypes.STRING(20), allowNull: false },
  correo: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  // columna con ñ: usa "field" para enlazar correctamente
  password: { type: DataTypes.STRING(255), allowNull: false, field: 'contraseña' },
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
  tableName: 'users',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Relaciones
User.belongsTo(Profile, { as: 'perfil', foreignKey: 'perfil_id' });

module.exports = { User };
