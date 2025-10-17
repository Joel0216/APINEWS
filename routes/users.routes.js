// routes/users.routes.js
// CRUD de usuarios con MySQL (XAMPP) usando mysql2/promise
// Asegúrate de tener: npm i mysql2 bcryptjs
// Requiere un pool en ../config/db.js que exporte: const pool = mysql.createPool({...}).promise();

const { Router } = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // <- debe exportar pool.promise()

const router = Router();

/**
 * Helper: quita la clave password de la respuesta
 */
function stripPassword(user) {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}

/**
 * GET /users
 * Lista todos los usuarios (sin password).
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, createdAt, updatedAt FROM users ORDER BY id DESC'
    );
    return res.json(rows);
  } catch (err) {
    console.error('GET /users error:', err);
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

/**
 * POST /users
 * Crea un usuario nuevo. Campos requeridos: nombre, email, password.
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password } = req.body || {};

    if (!nombre || !email || !password) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'nombre, email y password son obligatorios',
      });
    }

    // ¿email ya existe?
    const [dup] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (dup.length > 0) {
      return res.status(409).json({
        statusCode: 409,
        error: 'Conflict',
        message: 'El email ya está registrado',
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (nombre, email, password, createdAt, updatedAt)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [nombre, email, hashed]
    );

    const [createdRows] = await pool.query(
      'SELECT id, nombre, email, createdAt, updatedAt FROM users WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json(createdRows[0]);
  } catch (err) {
    console.error('POST /users error:', err);
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

/**
 * GET /users/:id
 * Devuelve un usuario por ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT id, nombre, email, createdAt, updatedAt FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Usuario no encontrado',
      });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('GET /users/:id error:', err);
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

/**
 * PUT /users/:id
 * Actualiza nombre, email y/o password.
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, email, password } = req.body || {};

    // ¿existe el usuario?
    const [exists] = await pool.query('SELECT id, email FROM users WHERE id = ? LIMIT 1', [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Usuario no encontrado',
      });
    }

    // Si viene email, validar duplicado (que no sea el mismo usuario)
    if (email) {
      const [dup] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1',
        [email, id]
      );
      if (dup.length > 0) {
        return res.status(409).json({
          statusCode: 409,
          error: 'Conflict',
          message: 'El email ya está registrado por otro usuario',
        });
      }
    }

    // Construcción dinámica del SET
    const fields = [];
    const values = [];

    if (typeof nombre === 'string') {
      fields.push('nombre = ?');
      values.push(nombre);
    }
    if (typeof email === 'string') {
      fields.push('email = ?');
      values.push(email);
    }
    if (typeof password === 'string' && password.trim() !== '') {
      const hashed = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'No hay campos para actualizar',
      });
    }

    fields.push('updatedAt = NOW()');

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await pool.query(sql, values);

    const [updatedRows] = await pool.query(
      'SELECT id, nombre, email, createdAt, updatedAt FROM users WHERE id = ?',
      [id]
    );

    return res.json(updatedRows[0]);
  } catch (err) {
    console.error('PUT /users/:id error:', err);
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

/**
 * DELETE /users/:id
 * Elimina un usuario.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Usuario no encontrado',
      });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

module.exports = router;
