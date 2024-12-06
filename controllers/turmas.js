const Turmas = require('../models/turmas');

const turmasController = {
  create: (req, res) => {
    const { nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala } = req.body;
    if (!nome || !semestre || !ano || !horario_inicio || !horario_termino || !id_professor || !id_disciplina || !id_sala) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }
    Turmas.create(nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala, (err, result) => {
      if (err) {
        console.error('Erro ao inserir turma:', err);
        res.status(500).send('Erro ao inserir turma.');
      } else {
        res.status(201).send('Turma inserida com sucesso.');
      }
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala } = req.body;
    if (!nome || !semestre || !ano || !horario_inicio || !horario_termino || !id_professor || !id_disciplina || !id_sala) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }
    Turmas.update(id, nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala, (err, result) => {
      if (err) {
        console.error('Erro ao alterar turma:', err);
        res.status(500).send('Erro ao alterar turma.');
      } else {
        res.send('Turma alterada com sucesso.');
      }
    });
  },

  deactivate: (req, res) => {
    const { id } = req.params;
    Turmas.deactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao desativar turma:', err);
        res.status(500).send('Erro ao desativar turma.');
      } else {
        res.send('Turma desativada com sucesso.');
      }
    });
  },

  findAll: (req, res) => {
    Turmas.findAll((err, results) => {
      if (err) {
        console.error('Erro ao pesquisar turmas:', err);
        res.status(500).send('Erro ao pesquisar turmas.');
      } else {
        res.json(results); // Envia todas as turmas, tanto ativas quanto inativas
      }
    });
  },
  
  reactivate: (req, res) => {
    const { id } = req.params;
    Turmas.reactivate(id, (err, result) => {
      if (err) {
        console.error('Erro ao reativar turma:', err);
        res.status(500).send('Erro ao reativar turma.');
      } else {
        res.send('Turma reativada com sucesso.');
      }
    });
  }
};

module.exports = turmasController;
