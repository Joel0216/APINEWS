const express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/NewController');
const { validatorNewCreate, validatorNewUpdate } = require('../validators/NewValidator');
const { authenticateAdmin, authenticateAny } = require('../middlewares/jwt')



const api = express.Router();

api.get('/noticias', get);
api.get('/noticias/:id', getById)
api.post('/noticias', authenticateAny, validatorNewCreate, create)
api.put('/noticias/:id', authenticateAny, validatorNewUpdate, update)
api.delete('/noticias/:id', authenticateAny,  destroy)

module.exports = api;