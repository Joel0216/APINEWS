const { Profile } = require('../models/ProfileModel');

exports.getAll = async (req, res) => {
  try {
    const data = await Profile.findAll({ order: [['id', 'ASC']] });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Profile.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Profile no encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: 'nombre es requerido' });
    const created = await Profile.create({ nombre });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Profile.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Profile no encontrado' });
    const { nombre } = req.body;
    if (nombre !== undefined) item.nombre = nombre;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Profile.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Profile no encontrado' });
    await item.destroy();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
