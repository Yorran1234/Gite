const Salas = require('../models/salas');

// Controlador para gerenciar salas
const salasController = {
  // Criar uma nova sala
  create: (req, res) => {
    const { numero, bloco, capacidade } = req.body;

    // Verifica se todos os campos foram fornecidos
    if (!numero || !bloco || !capacidade) {
      return res.status(400).send('Os campos numero, bloco e capacidade são obrigatórios.');
    }

    Salas.create(numero, bloco, capacidade, (err, result) => {
      if (err) {
        console.error('Erro ao inserir sala:', err);
        res.status(500).send('Erro ao inserir sala.');
      } else {
        res.status(201).send('Sala inserida com sucesso.');
      }
    });
  },

  // Alterar uma sala existente
  update: (req, res) => {
    const { id } = req.params;
    const { numero, bloco, capacidade } = req.body;

    if (!numero || !bloco || !capacidade) {
      return res.status(400).send('Os campos numero, bloco e capacidade são obrigatórios.');
    }

    Salas.update(id, numero, bloco, capacidade, (err, result) => {
      if (err) {
        console.error('Erro ao alterar sala:', err);
        res.status(500).send('Erro ao alterar sala.');
      } else {
        res.send('Sala alterada com sucesso.');
      }
    });
  },

  // Desativar uma sala
  deactivate: (req, res) => {
    const { id } = req.params;

    Salas.deactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao desativar sala:', err);
        res.status(500).send('Erro ao desativar sala.');
      } else {
        res.send('Sala desativada com sucesso.');
      }
    });
  },

  // Pesquisar salas ativas
  findAll: (req, res) => {
    Salas.findAll((err, results) => {
      if (err) {
        console.error('Erro ao pesquisar salas:', err);
        res.status(500).send('Erro ao pesquisar salas.');
      } else {
        res.json(results);
      }
    });
  },

  // Reativar uma sala
  reactivate: (req, res) => {
    const { id } = req.params;

    Salas.reactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao reativar sala:', err);
        res.status(500).send('Erro ao reativar sala.');
      } else {
        res.send('Sala reativada com sucesso.');
      }
    });
  }
};

module.exports = salasController;
