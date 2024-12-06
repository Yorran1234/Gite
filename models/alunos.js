// models/alunos.js
const connection = require('../config/db');

const Alunos = {
  // Inserir um novo aluno
  create: (nome, email, callback) => {
    const sql = 'INSERT INTO alunos (nome, email, status) VALUES (?, ?, 1)';
    connection.query(sql, [nome, email], callback);
  },

  // Alterar um aluno existente
  update: (id, nome, email, callback) => {
    const sql = 'UPDATE alunos SET nome = ?, email = ? WHERE id_aluno = ?';
    connection.query(sql, [nome, email, id], callback);
  },

  // Desativar um aluno
  deactivate: (id, callback) => {
    const sql = 'UPDATE alunos SET status = 0 WHERE id_aluno = ?';
    connection.query(sql, [id], callback);
  },

  // Pesquisar todos os alunos
  findAll: (callback) => {
    const sql = 'SELECT * FROM alunos';
    connection.query(sql, callback);
  },

  // Reativar um aluno
  reactivate: (id, callback) => {
    const sql = 'UPDATE alunos SET status = 1 WHERE id_aluno = ?';
    connection.query(sql, [id], callback);
  }
};

module.exports = Alunos;