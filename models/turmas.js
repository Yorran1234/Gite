const connection = require('../config/db');

// Model para operações de turmas no banco de dados
const Turmas = {
  create: (nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala, callback) => {
    const sql = 'INSERT INTO turmas (nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)';
    connection.query(sql, [nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala], callback);
  },

  update: (id, nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala, callback) => {
    const sql = 'UPDATE turmas SET nome = ?, semestre = ?, ano = ?, horario_inicio = ?, horario_termino = ?, id_professor = ?, id_disciplina = ?, id_sala = ? WHERE id_turma = ?';
    connection.query(sql, [nome, semestre, ano, horario_inicio, horario_termino, id_professor, id_disciplina, id_sala, id], callback);
  },

  deactivate: (id, callback) => {
    const sql = 'UPDATE turmas SET status = 0 WHERE id_turma = ?';
    connection.query(sql, [id], callback);
  },
  findAll: (callback) => {
    const sql = 'SELECT * FROM turmas'; // Remove o filtro WHERE status = 1
    connection.query(sql, callback);
  },
  
  reactivate: (id, callback) => {
    const sql = 'UPDATE turmas SET status = 1 WHERE id_turma = ?';
    connection.query(sql, [id], callback);
  }
};

module.exports = Turmas;
