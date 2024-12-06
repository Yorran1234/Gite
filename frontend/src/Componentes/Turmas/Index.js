import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaUserPlus, FaTimes, FaEdit, FaEye, FaPrint, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Styled components
const Container = styled.div`
  padding: 20px;
  background-color: #A0B3D5;
  border-radius: 10px;
  max-width: 1600px;
  width: 98%;
  margin: 80px auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Titulo = styled.h2`
  text-align: center;
  color: #2F509D;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #6E8EB4;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 15px;
  border-radius: 10px;
  border: none;
  flex-grow: 1;
  margin-right: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  color: #333;
`;

const SearchButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  background-color: #dff1fb;
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #9ED1F5;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  color: #fff;
  font-size: 1rem;
  text-transform: uppercase;
 
`;

const Td = styled.td`
  padding: 10.4px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1rem;
  color: #555;
  
`;

const TurmaItem = styled.tr`
  background-color: #ECF7FE;

  &:nth-child(even) {
    background-color: #F4FAFF;
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #F7F9FB;
  border: 2px solid #326589;
  color: #326589;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #326589;
    color: white;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 50px;
  border-radius: 30px;
  max-width: 800px;
  width: 100%;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const ButtonSave = styled.button`
  padding: 10px 20px;
  background-color: #326589;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1rem;

  &:hover {
    background-color: #254a73;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: #999;
  }
`;

const StatusSwitch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  span {
    color: ${props => (props.active ? '#27AE60' : '#E74C3C')};
    font-weight: bold;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  margin-bottom: 10px;
  cursor: pointer;

  input {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
`;

const ModalList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ModalListItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrintButton = styled(Button)`
  background-color: white;
  color: blue;
  &:hover {
    background-color: #254a73;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: #F7F9FB;
  border: 2px solid #326589;
  color: #326589;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #326589;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Styles for PDF
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 },
  turmaSection: { marginBottom: 20 },
  turmaTitle: { fontSize: 18, marginBottom: 10 },
  separator: { borderBottomWidth: 1, borderBottomColor: '#000', marginVertical: 10 }
});

// PDF Document component
const TurmasPDF = ({ turmas, professores, disciplinas, salas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Relatório de Turmas Ativas</Text>
      {turmas.map((turma, index) => (
        <View key={turma.id_turma} style={styles.turmaSection}>
          <Text style={styles.turmaTitle}>{turma.nome}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Dia da Semana</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Ano</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Horário Início</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Horário Término</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{turma.semestre}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{turma.ano}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{turma.horario_inicio}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{turma.horario_termino}</Text></View>
            </View>
          </View>
          <Text style={styles.tableCell}>Professor: {professores.find(p => p.id_professor === turma.id_professor)?.nome || 'N/A'}</Text>
          <Text style={styles.tableCell}>Disciplina: {disciplinas.find(d => d.id_disciplina === turma.id_disciplina)?.nome || 'N/A'}</Text>
          <Text style={styles.tableCell}>Sala: {salas.find(s => s.id_sala === turma.id_sala)?.numero || 'N/A'} - {salas.find(s => s.id_sala === turma.id_sala)?.bloco || 'N/A'}</Text>
          {index < turmas.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </Page>
  </Document>
);

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAlunoModalOpen, setIsAddAlunoModalOpen] = useState(false);
  const [isViewAlunosModalOpen, setIsViewAlunosModalOpen] = useState(false);
  const [editandoTurma, setEditandoTurma] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [selectedAlunos, setSelectedAlunos] = useState([]);
  const [currentTurmaAlunos, setCurrentTurmaAlunos] = useState([]);
  const [novaTurma, setNovaTurma] = useState({
    nome: '',
    semestre: '',
    ano: '',
    horario_inicio: '',
    horario_termino: '',
    id_professor: '',
    id_disciplina: '',
    id_sala: '',
    status: 1
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [turmasPorPagina] = useState(4);

  useEffect(() => {
    fetchTurmas();
    fetchAlunos();
    fetchProfessores();
    fetchDisciplinas();
    fetchSalas();
  }, []);

  const fetchTurmas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/turmas');
      setTurmas(response.data);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
    }
  };

  const fetchAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const fetchProfessores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/professores');
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    }
  };

  const fetchDisciplinas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/disciplinas');
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  const fetchSalas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/salas');
      setSalas(response.data);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };
  

  const handleOpenAddAlunoModal = () => {
    setIsAddAlunoModalOpen(true);
    const turmasAtivas = turmas.filter(turma => turma.Status === 1);
    setTurmas(turmasAtivas);
  };

  const handleCloseAddAlunoModal = () => {
    setIsAddAlunoModalOpen(false);
    setSelectedTurma(null);
    setSelectedAlunos([]);
    fetchTurmas();
  };

  const handleSelectTurma = async (event) => {
    const turmaId = event.target.value;
    const turma = turmas.find(t => t.id_turma === parseInt(turmaId));
    setSelectedTurma(turma);
    if (turma) {
      try {
        const response = await axios.get(`http://localhost:5000/alunosTurmas/turma/${turma.id_turma}`);
        setCurrentTurmaAlunos(response.data);
      } catch (error) {
        console.error('Erro ao buscar alunos da turma:', error);
      }
    }
  };

  const handleSelectAluno = (alunoId) => {
    setSelectedAlunos(prev =>
      prev.includes(alunoId)
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
    if (currentTurmaAlunos.some(a => a.id_aluno === alunoId)) {
      alert(`O aluno já está na turma ${selectedTurma.nome}`);
    }
  };

  const handleSaveAlunosToTurma = async () => {
    if (!selectedTurma) {
      alert('Por favor, selecione uma turma.');
      return;
    }

    if (selectedAlunos.length === 0) {
      alert('Por favor, selecione pelo menos um aluno.');
      return;
    }

    try {
      const alunosJaAdicionados = [];
      const promises = selectedAlunos.map(async (alunoId) => {
        try {
          await axios.post('http://localhost:5000/alunosTurmas/adicionar', {
            turmas_id_turma: selectedTurma.id_turma,
            alunos_id_aluno: alunoId,
          });
        } catch (error) {
          if (error.response && error.response.status === 400) {
            const aluno = alunos.find(a => a.id_aluno === alunoId);
            alunosJaAdicionados.push(aluno.nome);
          } else {
            throw error;
          }
        }
      });

      await Promise.all(promises);

      if (alunosJaAdicionados.length > 0) {
        alert(`Os seguintes alunos já estavam na turma: ${alunosJaAdicionados.join(', ')}`);
      } else {
        console.log('Alunos adicionados com sucesso!');
      }
      handleCloseAddAlunoModal();
      fetchTurmas();
    } catch (error) {
      console.error('Erro ao adicionar alunos à turma:', error);
      alert('Erro ao adicionar alunos à turma. Por favor, tente novamente.');
    }
  };

  const filtrarTurmas = () => {
    return turmas.filter(turma => {
      const nomeCondicao = turma.nome ? turma.nome.toLowerCase().includes(pesquisa.toLowerCase()) : false;
      const statusCondicao = turma.Status === 1;
      return nomeCondicao && statusCondicao;
    });
  };

  const obterNomeProfessor = (id_professor) => {
    const professor = professores.find(p => p.id_professor === id_professor);
    return professor ? professor.nome : 'Desconhecido';
  };

  const obterNomeDisciplina = (id_disciplina) => {
    const disciplina = disciplinas.find(d => d.id_disciplina === id_disciplina);
    return disciplina ? disciplina.nome : 'Desconhecida';
  };

  const obterNomeSala = (id_sala) => {
    const sala = salas.find(s => s.id_sala === id_sala);
    return sala ? `${sala.numero} - ${sala.bloco}` : 'Desconhecida';
  };

  const handleIncluirTurma = () => {
    setEditandoTurma(null);
    setNovaTurma({
      nome: '',
      semestre: '',
      ano: '',
      horario_inicio: '',
      horario_termino: '',
      id_professor: '',
      id_disciplina: '',
      id_sala: '',
      status: 1
    });
    setIsModalOpen(true);
  };

  const handleAlterarTurma = (turma) => {
    setEditandoTurma(turma);
    setNovaTurma({
      ...turma,
      dias_semana: turma.dias_semana || {
        segunda: false,
        terca: false,
        quarta: false,
        quinta: false,
        sexta: false,
        sabado: false,
        domingo: false
      }
    });
    setIsModalOpen(true);
  };

  const handleSalvarTurma = async () => {
    if (!novaTurma.nome || !novaTurma.semestre || !novaTurma.ano) {
      alert("Preencha todos os campos antes de salvar!");
      return;
    }

    try {
      if (editandoTurma) {
        const response = await axios.put(`http://localhost:5000/turmas/${editandoTurma.id_turma}`, novaTurma);
        setTurmas(prevTurmas =>
          prevTurmas.map(t =>
            t.id_turma === editandoTurma.id_turma ? response.data : t
          )
        );
      } else {
        const response = await axios.post('http://localhost:5000/turmas', novaTurma);
        setTurmas(prevTurmas => [...prevTurmas, response.data]);
      }
      setIsModalOpen(false);
      fetchTurmas();
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      alert('Erro ao salvar turma. Por favor, tente novamente.');
    }
  };

  const inativarTurma = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/turmas/${id}`);
      fetchTurmas();
    } catch (error) {
      console.error('Erro ao inativar turma:', error);
      alert('Erro ao inativar turma. Por favor, tente novamente.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewAlunos = async (turmaId) => {
    try {
      const response = await axios.get(`http://localhost:5000/alunosTurmas/turma/${turmaId}`);
      setCurrentTurmaAlunos(response.data);
      setIsViewAlunosModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar alunos da turma:', error);
      alert('Erro ao buscar alunos da turma. Por favor, tente novamente.');
    }
  };

  const handleCloseViewAlunosModal = () => {
    setIsViewAlunosModalOpen(false);
    setCurrentTurmaAlunos([]);
  };


  // Pagination logic
  const indexOfLastTurma = currentPage * turmasPorPagina;
  const indexOfFirstTurma = indexOfLastTurma - turmasPorPagina;
  const currentTurmas = filtrarTurmas().slice(indexOfFirstTurma, indexOfLastTurma);


  const pageCount = Math.ceil(filtrarTurmas().length / turmasPorPagina);

  return (
    <Container>
      <Titulo>Gestão de Turmas</Titulo>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Consultar lista de turmas"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <SearchButton><FaSearch /></SearchButton>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>Nome da Turma</Th>
            <Th>Dia da Semana</Th>
            <Th>Ano</Th>
            <Th>Horário de Início</Th>
            <Th>Horário de Término</Th>
            <Th>Professor</Th>
            <Th>Disciplina</Th>
            <Th>Sala</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {currentTurmas.map(turma => (
            <TurmaItem key={turma.id_turma}>
              <Td>{turma.nome}</Td>
              <Td>{turma.semestre}</Td>
              <Td>{turma.ano}</Td>
              <Td>{turma.horario_inicio}</Td>
              <Td>{turma.horario_termino}</Td>
              <Td>{obterNomeProfessor(turma.id_professor)}</Td>
              <Td>{obterNomeDisciplina(turma.id_disciplina)}</Td>
              <Td>{obterNomeSala(turma.id_sala)}</Td>
              <Td>
                <StatusSwitch active={turma.Status === 1}>
                  <span>{turma.Status === 1 ? 'Ativo' : 'Inativo'}</span>
                </StatusSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleAlterarTurma(turma)}>
                    <FaEdit /> Alterar
                  </Button>
                  <Button onClick={() => handleViewAlunos(turma.id_turma)}>
                    <FaEye /> Ver Alunos
                  </Button>
                  <Button onClick={() => inativarTurma(turma.id_turma)}>
                    <FaTimes /> Excluir
                  </Button>
                </div>
              </Td>
            </TurmaItem>
          ))}
        </tbody>
      </Table>

      <PaginationContainer>
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </PageButton>
        <span>Página {currentPage} de {pageCount}</span>
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
        >
          <FaChevronRight />
        </PageButton>
      </PaginationContainer>

      <ButtonContainer>
        <Button onClick={handleIncluirTurma}>
          Incluir Turma <FaPlus />
        </Button>
        <Button onClick={handleOpenAddAlunoModal}>
          Adicionar Alunos à Turma <FaUserPlus />
        </Button>
        <PrintButton>
          <PDFDownloadLink document={<TurmasPDF turmas={turmas.filter(t => t.Status === 1)} professores={professores} disciplinas={disciplinas} salas={salas} />} fileName="turmas_ativas.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Carregando documento...' : 'Imprimir Turmas'
            }
          </PDFDownloadLink>
          <FaPrint />
        </PrintButton>
      </ButtonContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>
              <FaTimes />
            </CloseButton>
            <h3>{editandoTurma ? 'Alterar Turma' : 'Cadastrar Nova Turma'}</h3>

            <FormGroup>
              <Label>Nome</Label>
              <Input
                type="text"
                value={novaTurma.nome}
                onChange={(e) => setNovaTurma({ ...novaTurma, nome: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Dia da Semana</Label>
              <Select
                value={novaTurma.semestre}
                onChange={(e) => setNovaTurma({ ...novaTurma, semestre: e.target.value })}
                required
              >
                <option value="">Selecione um Dia</option>
                <option value="Segunda">Segunda-feira</option>
                <option value="Terça">Terça-feira</option>
                <option value="Quarta">Quarta-feira</option>
                <option value="Quinta">Quinta-feira</option>
                <option value="Sexta">Sexta-feira</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Ano</Label>
              <Input
                type="text"
                value={novaTurma.ano}
                onChange={(e) => setNovaTurma({ ...novaTurma, ano: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Horário de Início</Label>
              <Input
                type="text"
                value={novaTurma.horario_inicio}
                onChange={(e) => setNovaTurma({ ...novaTurma, horario_inicio: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Horário de Término</Label>
              <Input
                type="text"
                value={novaTurma.horario_termino}
                onChange={(e) => setNovaTurma({ ...novaTurma, horario_termino: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Professor</Label>
              <Select
                value={novaTurma.id_professor}
                onChange={(e) => setNovaTurma({ ...novaTurma, id_professor: e.target.value })}
                required
              >
                <option value="">Selecione um professor</option>
                {professores.map((professor) => (
                  <option key={professor.id_professor} value={professor.id_professor}>
                    {professor.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Disciplina</Label>
              <Select
                value={novaTurma.id_disciplina}
                onChange={(e) => setNovaTurma({ ...novaTurma, id_disciplina: e.target.value })}
                required
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.id_disciplina} value={disciplina.id_disciplina}>
                    {disciplina.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Sala</Label>
              <Select
                value={novaTurma.id_sala}
                onChange={(e) => setNovaTurma({ ...novaTurma, id_sala: e.target.value })}
                required
              >
                <option value="">Selecione uma sala</option>
                {salas.map((sala) => (
                  <option key={sala.id_sala} value={sala.id_sala}>
                    {sala.numero} - {sala.bloco}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <ButtonSave onClick={handleSalvarTurma}>
              {editandoTurma ? 'Salvar Alterações' : 'Salvar Turma'}
            </ButtonSave>
          </ModalContent>
        </ModalOverlay>
      )}

      {isAddAlunoModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseAddAlunoModal}>
              <FaTimes />
            </CloseButton>
            <h3>Adicionar Alunos à Turma</h3>

            <FormGroup>
              <Label>Selecione a Turma</Label>
              <Select onChange={handleSelectTurma} value={selectedTurma ? selectedTurma.id_turma : ''}>
                <option value="">Selecione uma turma</option>
                {turmas.filter(turma => turma.Status === 1).map((turma) => (
                  <option key={turma.id_turma} value={turma.id_turma}>
                    {turma.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {selectedTurma && (
              <div>
                <h4>Selecione os Alunos</h4>
                {alunos.map((aluno) => (
                  <CheckboxLabel key={aluno.id_aluno}>
                    <input
                      type="checkbox"
                      checked={selectedAlunos.includes(aluno.id_aluno)}
                      onChange={() => handleSelectAluno(aluno.id_aluno)}
                      disabled={aluno.Status !== 1 || currentTurmaAlunos.some(a => a.id_aluno === aluno.id_aluno)}
                    />
                    {aluno.nome} - <span style={{ color: aluno.Status === 1 ? 'green' : 'red' }}>{aluno.Status === 1 ? 'Ativo' : 'Inativo'}</span>
                    {currentTurmaAlunos.some(a => a.id_aluno === aluno.id_aluno) && (
                      <span style={{ color: 'red', marginLeft: '10px' }}> (Já está na turma)</span>
                    )}
                  </CheckboxLabel>
                ))}
                <ButtonSave onClick={handleSaveAlunosToTurma}>
                  Adicionar Alunos Selecionados
                </ButtonSave>
              </div>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {isViewAlunosModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseViewAlunosModal}>
              <FaTimes />
            </CloseButton>
            <h3>Alunos da Turma</h3>
            <ModalList>
              {currentTurmaAlunos.map((aluno) => (
                <ModalListItem key={aluno.id_aluno}>
                  {aluno.nome}
                  <StatusSwitch active={aluno.Status === 1}>
                    <span>{aluno.Status === 1 ? 'Ativo' : 'Inativo'}</span>
                  </StatusSwitch>
                </ModalListItem>
              ))}
            </ModalList>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}