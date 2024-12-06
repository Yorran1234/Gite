const connection = require('../config/db');

const Professores = {
  create: (nome, cpf, especialidade, callback) => {
    const sql = 'INSERT INTO professores (nome, cpf, especialidade, status) VALUES (?, ?, ?, 1)';
    connection.query(sql, [nome, cpf, especialidade], callback);
  },

  update: (id, nome, cpf, especialidade, callback) => {
    const sql = 'UPDATE professores SET nome = ?, cpf = ?, especialidade = ? WHERE id_professor = ?';
    connection.query(sql, [nome, cpf, especialidade, id], callback);
  },

  deactivate: (id, callback) => {
    const sql = 'UPDATE professores SET status = 0 WHERE id_professor = ?';
    connection.query(sql, [id], callback);
  },

  findAll: (callback) => {
    const sql = 'SELECT * FROM professores';
    connection.query(sql, callback);
  },

  reactivate: (id, callback) => {
    const sql = 'UPDATE professores SET status = 1 WHERE id_professor = ?';
    connection.query(sql, [id], callback);
  }
};

module.exports = Professores;
