// routes/salas.js
const express = require('express');
const router = express.Router();
const salasController = require('../controllers/salas');

// Definir as rotas para salas
router.post('/', salasController.create);
router.put('/:id', salasController.update);
router.delete('/:id', salasController.deactivate);
router.get('/', salasController.findAll);
router.put('/reativar/:id', salasController.reactivate);

module.exports = router;
