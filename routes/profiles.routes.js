const { Router } = require('express');
const ctrl = require('../controllers/profiles.controller');
const r = Router();

r.get('/', ctrl.getAll);
r.get('/:id', ctrl.getOne);
r.post('/', ctrl.create);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

module.exports = r;
