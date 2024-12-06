const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunos');

// Definir as rotas para alunos
router.post('/', alunosController.create);
router.put('/:id', alunosController.update);
router.delete('/:id', alunosController.deactivate);
router.get('/', alunosController.findAll);
router.put('/reativar/:id', alunosController.reactivate);

module.exports = router;
