const express = require('express');
const router = express.Router();
const turmasController = require('../controllers/turmas');

// Rotas para o CRUD de turmas
router.post('/', turmasController.create); // Criar uma nova turma
router.put('/:id', turmasController.update); // Atualizar uma turma existente
router.delete('/:id', turmasController.deactivate); // Desativar uma turma
router.get('/', turmasController.findAll); // Listar todas as turmas (ativas e inativas)
router.put('/reativar/:id', turmasController.reactivate); // Reativar uma turma

module.exports = router;
