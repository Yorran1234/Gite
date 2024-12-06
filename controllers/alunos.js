// controllers/alunos.js
const Alunos = require('../models/alunos');

// Controlador para gerenciar alunos
const alunosController = {
  // Criar um novo aluno
  create: (req, res) => {
    const { nome, email } = req.body;

    // Verifica se os campos obrigatórios foram fornecidos
    if (!nome || !email) {
      return res.status(400).send('Os campos nome e email são obrigatórios.');
    }

    Alunos.create(nome, email, (err, result) => {
      if (err) {
        console.error('Erro ao inserir aluno:', err);
        res.status(500).send('Erro ao inserir aluno.');
      } else {
        res.status(201).send('Aluno inserido com sucesso.');
      }
    });
  },

  // Alterar um aluno existente
  update: (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).send('Os campos nome e email são obrigatórios.');
    }

    Alunos.update(id, nome, email, (err, result) => {
      if (err) {
        console.error('Erro ao alterar aluno:', err);
        res.status(500).send('Erro ao alterar aluno.');
      } else {
        res.send('Aluno alterado com sucesso.');
      }
    });
  },

  // Desativar um aluno
  deactivate: (req, res) => {
    const { id } = req.params;

    Alunos.deactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao desativar aluno:', err);
        res.status(500).send('Erro ao desativar aluno.');
      } else {
        res.send('Aluno desativado com sucesso.');
      }
    });
  },

  // Pesquisar todos os alunos
  findAll: (req, res) => {
    Alunos.findAll((err, results) => {
      if (err) {
        console.error('Erro ao pesquisar alunos:', err);
        res.status(500).send('Erro ao pesquisar alunos.');
      } else {
        res.json(results);
      }
    });
  },

  // Reativar um aluno
  reactivate: (req, res) => {
    const { id } = req.params;

    Alunos.reactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao reativar aluno:', err);
        res.status(500).send('Erro ao reativar aluno.');
      } else {
        res.send('Aluno reativado com sucesso.');
      }
    });
  }
};

module.exports = alunosController;