// routes/auth.routes.js
const { Router } = require('express');
const jwt = require('jsonwebtoken');

const router = Router();

// POST /auth/login (pública)
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  // TODO: valida contra tu base de datos y password hash
  if (!email || !password) {
    return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'email and password are required' });
  }

  // Simulación usuario válido:
  const userId = '66f0c7d1f8a2b4c9d1234567';
  const token = jwt.sign({ sub: userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.json({ token });
});

// POST /auth/register (pública)
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body || {};
  if (!nombre || !email || !password) {
    return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'nombre, email, password are required' });
  }
  // TODO: inserta usuario real en DB, valida duplicados, etc.
  const created = {
    id: '66f0c7d1f8a2b4c9d1234567',
    nombre,
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return res.status(201).json(created);
});

module.exports = router;
