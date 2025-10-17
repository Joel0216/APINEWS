const { Category } = require('../models/CategoryModel');

exports.getAll = async (_req, res) => {
  try {
    const data = await Category.findAll({ order: [['id', 'ASC']] });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Category.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Category no encontrada' });
    res.json(item);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre || !descripcion)
      return res.status(400).json({ message: 'nombre y descripcion son requeridos' });
    const created = await Category.create({
      nombre,
      descripcion,
      activo: true,
      UserAlta: 'Admin',
      FechaAlta: new Date(),
      UserMod: '',
      FechaMod: new Date('1990-01-01'),
      UserBaja: '',
      FechaBaja: new Date('1990-01-01'),
    });
    res.status(201).json(created);
  } catch (e) {
    // Manejo de unique constraint
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'nombre ya existe' });
    }
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Category.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Category no encontrada' });
    const { nombre, descripcion, activo } = req.body;
    if (nombre !== undefined) item.nombre = nombre;
    if (descripcion !== undefined) item.descripcion = descripcion;
    if (activo !== undefined) item.activo = !!activo;
    item.UserMod = 'Admin';
    item.FechaMod = new Date();
    await item.save();
    res.json(item);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'nombre ya existe' });
    }
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Category.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Category no encontrada' });
    await item.destroy();
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
