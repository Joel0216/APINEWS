var express = require('express');

const { login, register, } = require('../controllers/AuthController');
const { validatorLogin, validatorRegister } = require('../validators/AuthValidator');
const api = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - nick
 *               - correo
 *               - contraseña
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellidos:
 *                 type: string
 *                 example: "Pérez"
 *               nick:
 *                 type: string
 *                 example: "juanp"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               contraseña:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       422:
 *         description: Error en la validación de datos
 */
api.post('/auth/registro/', validatorRegister, register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contraseña
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
¡*               contraseña:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Login exitoso, devuelve el token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales incorrectas o usuario inactivo
 *       422:
 *         description: Error de validación
 */
api.post('/auth/login', validatorLogin, login);




module.exports = api;