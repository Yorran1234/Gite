const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());  // Lidar com JSON no corpo da requisição

// Importando as rotas
const disciplinasRoutes = require('./routes/disciplinas');
const professoresRoutes = require('./routes/professores');
const salasRoutes = require('./routes/salas');
const turmasRoutes = require('./routes/turmas');
const alunosRoutes = require('./routes/alunos');  // Importando a rota de alunos
const alunosTurmasRoutes = require('./routes/alunosTurmas');


// Usando as rotas
app.use('/disciplinas', disciplinasRoutes);
app.use('/professores', professoresRoutes);
app.use('/salas', salasRoutes);
app.use('/turmas', turmasRoutes);
app.use('/alunos', alunosRoutes);
app.use('/alunosTurmas', alunosTurmasRoutes);
// Inicializando o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
 