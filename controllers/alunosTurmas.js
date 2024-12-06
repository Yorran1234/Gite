// controllers/alunosTurmas.js
const AlunosTurmas = require('../models/alunosTurmas');

const alunosTurmasController = {
  // Adicionar um aluno a uma turma
  addAlunoToTurma: (req, res) => {
    const { alunos_id_aluno, turmas_id_turma } = req.body;

    if (!alunos_id_aluno || !turmas_id_turma) {
      return res.status(400).send('Os campos alunos_id_aluno e turmas_id_turma são obrigatórios.');
    }

    // Converte para array se for um único ID
    const alunosIds = Array.isArray(alunos_id_aluno) ? alunos_id_aluno : [alunos_id_aluno];

    const addPromises = alunosIds.map(alunoId => 
      new Promise((resolve, reject) => {
        AlunosTurmas.addAlunoToTurma(alunoId, turmas_id_turma, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      })
    );

    Promise.all(addPromises)
      .then(() => {
        res.status(201).send('Aluno(s) adicionado(s) à turma com sucesso.');
      })
      .catch(err => {
        console.error('Erro ao adicionar aluno(s) à turma:', err);
        res.status(500).send('Erro ao adicionar aluno(s) à turma.');
      });
  },

  // Remover um aluno de uma turma
  removeAlunoFromTurma: (req, res) => {
    const { alunos_id_aluno, turmas_id_turma } = req.body;

    if (!alunos_id_aluno || !turmas_id_turma) {
      return res.status(400).send('Os campos alunos_id_aluno e turmas_id_turma são obrigatórios.');
    }

    AlunosTurmas.removeAlunoFromTurma(alunos_id_aluno, turmas_id_turma, (err, result) => {
      if (err) {
        console.error('Erro ao remover aluno da turma:', err);
        return res.status(500).send('Erro ao remover aluno da turma.');
      }
      res.send('Aluno removido da turma com sucesso.');
    });
  },

  // Buscar alunos de uma turma
  findAlunosByTurma: (req, res) => {
    const { turmas_id_turma } = req.params;

    AlunosTurmas.findAlunosByTurma(turmas_id_turma, (err, results) => {
      if (err) {
        console.error('Erro ao buscar alunos da turma:', err);
        return res.status(500).send('Erro ao buscar alunos da turma.');
      }
      res.json(results);
    });
  },

  // Buscar turmas de um aluno
  findTurmasByAluno: (req, res) => {
    const { alunos_id_aluno } = req.params;

    AlunosTurmas.findTurmasByAluno(alunos_id_aluno, (err, results) => {
      if (err) {
        console.error('Erro ao buscar turmas do aluno:', err);
        return res.status(500).send('Erro ao buscar turmas do aluno.');
      }
      res.json(results);
    });
  }
};

module.exports = alunosTurmasController;
