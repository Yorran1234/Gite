const connection = require('../config/db');

// Model para operações de salas no banco de dados
const Salas = {
  // Inserir uma nova sala
  create: (numero, bloco, capacidade, callback) => {
    const sql = 'INSERT INTO salas (numero, bloco, capacidade, status) VALUES (?, ?, ?, 1)';
    connection.query(sql, [numero, bloco, capacidade], callback);
  },

  // Alterar uma sala existente
  update: (id, numero, bloco, capacidade, callback) => {
    const sql = 'UPDATE salas SET numero = ?, bloco = ?, capacidade = ? WHERE id_sala = ?';
    connection.query(sql, [numero, bloco, capacidade, id], callback);
  },

  // Desativar uma sala
  deactivate: (id, callback) => {
    const sql = 'UPDATE salas SET status = 0 WHERE id_sala = ?';
    connection.query(sql, [id], callback);
  },

  // Pesquisar salas ativas
  findAll: (callback) => {
    const sql = 'SELECT * FROM salas';
    connection.query(sql, callback);
  },

  // Reativar uma sala
  reactivate: (id, callback) => {
    const sql = 'UPDATE salas SET status = 1 WHERE id_sala = ?';
    connection.query(sql, [id], callback);
  }
};

module.exports = Salas;
