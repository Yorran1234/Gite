// models/AlunosTurmas.js
const connection = require('../config/db');

const AlunosTurmas = {
  // Adicionar um aluno a uma turma
  addAlunoToTurma: (alunos_id_aluno, turmas_id_turma, callback) => {
    const sql = 'INSERT INTO alunos_has_turmas (alunos_id_aluno, turmas_id_turma) VALUES (?, ?)';
    connection.query(sql, [alunos_id_aluno, turmas_id_turma], callback);
  },

  // Remover um aluno de uma turma
  removeAlunoFromTurma: (alunos_id_aluno, turmas_id_turma, callback) => {
    const sql = 'DELETE FROM alunos_has_turmas WHERE alunos_id_aluno = ? AND turmas_id_turma = ?';
    connection.query(sql, [alunos_id_aluno, turmas_id_turma], callback);
  },

  // Buscar todos os alunos de uma turma
  findAlunosByTurma: (turmas_id_turma, callback) => {
    const sql = `
      SELECT a.* FROM alunos a
      INNER JOIN alunos_has_turmas at ON a.id_aluno = at.alunos_id_aluno
      WHERE at.turmas_id_turma = ?
    `;
    connection.query(sql, [turmas_id_turma], callback);
  },

  // Buscar todas as turmas de um aluno
  findTurmasByAluno: (alunos_id_aluno, callback) => {
    const sql = `
      SELECT t.* FROM turmas t
      INNER JOIN alunos_has_turmas at ON t.id_turma = at.turmas_id_turma
      WHERE at.alunos_id_aluno = ?
    `;
    connection.query(sql, [alunos_id_aluno], callback);
  }
};

module.exports = AlunosTurmas;
