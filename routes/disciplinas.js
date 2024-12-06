const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinas'); // Importa o controlador de disciplinas

// Definir as rotas para disciplinas
router.post('/', disciplinasController.create);
router.put('/:id', disciplinasController.update);
router.delete('/:id', disciplinasController.deactivate);
router.get('/', disciplinasController.findAllActive);
router.put('/reativar/:id', disciplinasController.reactivate);

module.exports = router;
