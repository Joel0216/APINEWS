const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');
const { Category } = require('./CategoryModel');
const { State } = require('./StateModel');
const { User } = require('./UserModel');

const New = connection.define('news', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  categoria_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  estado_id:    { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  usuario_id:   { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  titulo: { type: DataTypes.STRING(50), allowNull: false },
  fecha_publicacion: { type: DataTypes.DATE, allowNull: false },
  descripcion: { type: DataTypes.STRING(1000), allowNull: false },
  imagen: { type: DataTypes.TEXT('medium'), allowNull: false },
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
  tableName: 'news',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Relaciones
New.belongsTo(Category, { as: 'categoria', foreignKey: 'categoria_id' });
New.belongsTo(State,    { as: 'estado',    foreignKey: 'estado_id' });
New.belongsTo(User,     { as: 'usuario',   foreignKey: 'usuario_id' });

module.exports = { New };
