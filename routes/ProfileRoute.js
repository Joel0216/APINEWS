var express = require('express');

const {get, getById, }  = require('../controllers/ProfileController');
const { authenticateAdmin } = require('../middlewares/jwt')


const api = express.Router();

api.get('/perfiles', get);
api.get('/perfiles/:id', getById)


module.exports = api;