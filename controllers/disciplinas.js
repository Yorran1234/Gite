const Disciplinas = require('../models/disciplinas'); // Importa o modelo de disciplinas

// Controlador para gerenciar disciplinas
const disciplinasController = {
  // Criar uma nova disciplina
  create: (req, res) => {
    const { nome, codigo, periodo } = req.body;

    // Verifica se os campos obrigatórios foram fornecidos
    if (!nome || !codigo || !periodo) {
      return res.status(400).send('Os campos nome, código e período são obrigatórios.');
    }

    // Chamada ao modelo para criar a disciplina
    Disciplinas.create(nome, codigo, periodo, (err, result) => {  // Corrigido aqui: Passando os parâmetros corretamente
      if (err) {
        console.error('Erro ao inserir disciplina:', err);
        return res.status(500).send('Erro ao inserir disciplina.');
      }
      res.status(201).send('Disciplina inserida com sucesso.');
    });
  },

  // Alterar uma disciplina existente
  update: (req, res) => {
    const { id } = req.params;
    const { nome, codigo, periodo } = req.body;

    if (!nome || !codigo || !periodo) {
      return res.status(400).send('Os campos nome, código e período são obrigatórios.');
    }

    // Chamada ao modelo para atualizar a disciplina
    Disciplinas.update(id, nome, codigo, periodo, (err, result) => {  // Corrigido aqui também
      if (err) {
        console.error('Erro ao alterar disciplina:', err);
        return res.status(500).send('Erro ao alterar disciplina.');
      }
      res.send('Disciplina alterada com sucesso.');
    });
  },

  // Desativar uma disciplina
  deactivate: (req, res) => {
    const { id } = req.params;

    // Chamada ao modelo para desativar a disciplina
    Disciplinas.deactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao desativar disciplina:', err);
        return res.status(500).send('Erro ao desativar disciplina.');
      }
      res.send('Disciplina desativada com sucesso.');
    });
  },

  // Pesquisar disciplinas ativas
  findAllActive: (req, res) => {
    // Chamada ao modelo para buscar todas as disciplinas ativas
    Disciplinas.findAllActive((err, results) => {
      if (err) {
        console.error('Erro ao pesquisar disciplinas:', err);
        return res.status(500).send('Erro ao pesquisar disciplinas.');
      }
      res.json(results);
    });
  },

  // Reativar uma disciplina
  reactivate: (req, res) => {
    const { id } = req.params;

    // Chamada ao modelo para reativar a disciplina
    Disciplinas.reactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao reativar disciplina:', err);
        return res.status(500).send('Erro ao reativar disciplina.');
      }
      res.send('Disciplina reativada com sucesso.');
    });
  }
};

module.exports = disciplinasController;
