var express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/UserController');
const { validatorUserCreate, validatorUserUpdate } = require('../validators/UserValidator');
const { authenticateAdmin } = require('../middlewares/jwt')


const api = express.Router();

api.get('/usuarios', authenticateAdmin, get);
api.get('/usuarios/:id', authenticateAdmin, getById)
api.post('/usuarios', authenticateAdmin, validatorUserCreate, create)
api.put('/usuarios/:id',authenticateAdmin, validatorUserUpdate, update)
api.delete('/usuarios/:id', authenticateAdmin, destroy)


module.exports = api;