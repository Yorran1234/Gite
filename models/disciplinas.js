const connection = require('../config/db'); // Importa a conexão com o banco de dados

// Model para operações de disciplinas no banco de dados
const Disciplinas = {
  // Inserir uma nova disciplina
  create: (nome, codigo, periodo, callback) => {
    const sql = 'INSERT INTO disciplinas (nome, codigo, periodo, status) VALUES (?, ?, ?, 1)';
    connection.query(sql, [nome, codigo, periodo], callback);
  },

  // Alterar uma disciplina existente
  update: (id, nome, codigo, periodo, callback) => {
    const sql = 'UPDATE disciplinas SET nome = ?, codigo = ?, periodo = ? WHERE id_disciplina = ?';
    connection.query(sql, [nome, codigo, periodo, id], callback);
  },

  // Desativar uma disciplina
  deactivate: (id, callback) => {
    const sql = 'UPDATE disciplinas SET status = 0 WHERE id_disciplina = ?';
    connection.query(sql, [id], callback);
  },

  // Pesquisar disciplinas ativas
  findAllActive: (callback) => {
    const sql = `
      SELECT id_disciplina, nome, codigo, periodo,
      CASE WHEN status = 1 THEN "Ativo" ELSE "Inativo" END AS status 
      FROM disciplinas
    `;
    connection.query(sql, callback);
  },

  // Reativar uma disciplina
  reactivate: (id, callback) => {
    const sql = 'UPDATE disciplinas SET status = 1 WHERE id_disciplina = ?';
    connection.query(sql, [id], callback);
  }
};

module.exports = Disciplinas;
