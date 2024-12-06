// routes/alunosTurmas.js
const express = require('express');
const router = express.Router();
const alunosTurmasController = require('../controllers/alunosTurmas');

// Rota para adicionar um aluno a uma turma
router.post('/adicionar', alunosTurmasController.addAlunoToTurma);

// Rota para remover um aluno de uma turma
router.delete('/remover', alunosTurmasController.removeAlunoFromTurma);

// Rota para buscar todos os alunos de uma turma
router.get('/turma/:turmas_id_turma', alunosTurmasController.findAlunosByTurma);

// Rota para buscar todas as turmas de um aluno
router.get('/aluno/:alunos_id_aluno', alunosTurmasController.findTurmasByAluno);

module.exports = router;
