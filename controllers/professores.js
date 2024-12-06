const Professores = require('../models/professores');

const professoresController = {
  create: (req, res) => {
    const { nome, cpf, especialidade } = req.body;
    if (!nome || !cpf|| !especialidade) {
      return res.status(400).send('Os campos nome, cpf e especialidade são obrigatórios.');
    }
    Professores.create(nome, cpf, especialidade, (err, result) => {
      if (err) {
        console.error('Erro ao inserir professor:', err);
        res.status(500).send('Erro ao inserir professor.');
      } else {
        res.status(201).send('Professor inserido com sucesso.');
      }
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { nome, cpf, especialidade } = req.body;
    if (!nome || !cpf || !especialidade) {
      return res.status(400).send('Os campos nome, cpf e especialidade são obrigatórios.');
    }
    Professores.update(id, nome, cpf, especialidade, (err, result) => {
      if (err) {
        console.error('Erro ao alterar professor:', err);
        res.status(500).send('Erro ao alterar professor.');
      } else {
        res.send('Professor alterado com sucesso.');
      }
    });
  },

  deactivate: (req, res) => {
    const { id } = req.params;
    Professores.deactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao desativar professor:', err);
        res.status(500).send('Erro ao desativar professor.');
      } else {
        res.send('Professor desativado com sucesso.');
      }
    });
  },

  findAll: (req, res) => {
    Professores.findAll((err, results) => {
      if (err) {
        console.error('Erro ao pesquisar professores:', err);
        res.status(500).send('Erro ao pesquisar professores.');
      } else {
        res.json(results);
      }
    });
  },

  reactivate: (req, res) => {
    const { id } = req.params;
    Professores.reactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao reativar professor:', err);
        res.status(500).send('Erro ao reativar professor.');
      } else {
        res.send('Professor reativado com sucesso.');
      }
    });
  }
};

module.exports = professoresController;
