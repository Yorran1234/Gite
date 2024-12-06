import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaPrint, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const Container = styled.div`
  padding: 20px;
  background-color: #A0B3D5;
  border-radius: 10px;
  max-width: 1300px;
  margin: 80px auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Titulo = styled.h2`
  text-align: center;
  color: #2F509D;
  margin-bottom: 20px;
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
  padding: 15px;
  text-align: left;
  border: 1px solid #ddd;
  color: #fff;
  font-size: 1rem;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 15px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1rem;
  color: #555;
`;

const ProfessorItem = styled.tr`
  background-color: #ECF7FE;

  &:nth-child(even) {
    background-color: #F4FAFF;
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-top: 10px;
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
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ButtonSave = styled.button`
  padding: 10px 20px;
  background-color: #326589;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

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

const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontSize: 12 
  },
  title: { 
    fontSize: 18, 
    marginBottom: 20, 
    textAlign: 'center',
    fontWeight: 'bold'
  },
  table: { 
    display: 'table', 
    width: 'auto', 
    borderStyle: 'solid', 
    borderColor: '#bfbfbf', 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  },
  tableRow: { 
    margin: 'auto', 
    flexDirection: 'row' 
  },
  tableCol: { 
    width: '25%', 
    borderStyle: 'solid', 
    borderColor: '#bfbfbf', 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },
  tableCell: { 
    margin: 'auto', 
    marginTop: 5, 
    fontSize: 10,
    padding: 5
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  professorInfo: {
    marginBottom: 10,
    borderBottom: 1,
    paddingBottom: 5,
    borderColor: '#bfbfbf'
  },
  professorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  infoText: {
    marginBottom: 3
  }
});

const ProfessorPDF = ({ professores, turmas, disciplinas, salas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Relatório de Professores Ativos</Text>
      {professores.map((professor) => (
        <View key={professor.id_professor} style={styles.professorInfo}>
          <Text style={styles.professorName}>{professor.nome}</Text>
          <Text style={styles.infoText}>CPF: {professor.cpf}</Text>
          <Text style={styles.infoText}>Especialidade: {professor.especialidade}</Text>
          
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Turma</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Dia/Horário</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Disciplina</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Sala</Text>
              </View>
            </View>
            {turmas
              .filter(turma => turma.id_professor === professor.id_professor)
              .map(turma => (
                <View key={turma.id_turma} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{turma.nome}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{`${turma.semestre} ${turma.horario_inicio}-${turma.horario_termino}`}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {disciplinas.find(d => d.id_disciplina === turma.id_disciplina)?.nome || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {`${salas.find(s => s.id_sala === turma.id_sala)?.numero || 'N/A'} - ${salas.find(s => s.id_sala === turma.id_sala)?.bloco || 'N/A'}`}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoProfessor, setEditandoProfessor] = useState(null);
  const [novoProfessor, setNovoProfessor] = useState({
    nome: '',
    cpf: '',
    especialidade: '',
    Status: 1,
  });
  const [cpfError, setCpfError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const professoresPerPage = 4;

  useEffect(() => {
    fetchProfessores();
    fetchTurmas();
    fetchDisciplinas();
    fetchSalas();
  }, []);

  const fetchProfessores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/professores');
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    }
  };

  const fetchTurmas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/turmas');
      setTurmas(response.data);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
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

  const filtrarProfessores = () => {
    return professores.filter(professor => {
      const nomeCondicao = professor.nome.toLowerCase().includes(pesquisa.toLowerCase());
      const statusCondicao = professor.Status === 1;
      return nomeCondicao && statusCondicao;
    });
  };

  const paginatedProfessores = () => {
    const filtered = filtrarProfessores();
    const startIndex = (currentPage - 1) * professoresPerPage;
    return filtered.slice(startIndex, startIndex + professoresPerPage);
  };

  const pageCount = Math.ceil(filtrarProfessores().length / professoresPerPage);
  
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0, remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf[10]);
  };

  const handleCPFChange = (e) => {
    let cpf = e.target.value.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setNovoProfessor({ ...novoProfessor, cpf });
    
    if (cpf.length === 14) {
      if (validarCPF(cpf)) {
        setCpfError('');
      } else {
        setCpfError('CPF inválido');
      }
    } else {
      setCpfError('');
    }
  };

  const handleIncluirProfessor = () => {
    setEditandoProfessor(null);
    setNovoProfessor({
      nome: '',
      cpf: '',
      especialidade: '',
      Status: 1,
    });
    setIsModalOpen(true);
  };

  const handleAlterarProfessor = (professor) => {
    setEditandoProfessor(professor);
    setNovoProfessor(professor);
    setIsModalOpen(true);
  };

  const handleSalvarProfessor = async () => {
    if (!novoProfessor.nome || !novoProfessor.cpf || !novoProfessor.especialidade) {
      alert('Preencha todos os campos!');
      return;
    }

    if (!validarCPF(novoProfessor.cpf)) {
      setCpfError('CPF inválido');
      return;
    }

    try {
      if (editandoProfessor) {
        await axios.put(`http://localhost:5000/professores/${editandoProfessor.id_professor}`, novoProfessor);
      } else {
        await axios.post('http://localhost:5000/professores', novoProfessor);
      }
      fetchProfessores();
      setCpfError('');
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
    }

    setNovoProfessor({ nome: '', cpf: '', especialidade: '', Status: 1 });
    setIsModalOpen(false);
  };

  const inativarProfessor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/professores/${id}`);
      fetchProfessores();
    } catch (error) {
      console.error('Erro ao inativar professor:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCpfError('');
  };

  return (
    <Container>
      <Titulo>Gestão de Professores</Titulo>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Consultar professores"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <SearchButton><FaSearch /></SearchButton>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>CPF</Th>
            <Th>Titulação ou Especialidade</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {paginatedProfessores().map((professor) => (
            <ProfessorItem key={professor.id_professor}>
              <Td>{professor.nome}</Td>
              <Td>{professor.cpf}</Td>
              <Td>{professor.especialidade}</Td>
              <Td>
                <StatusSwitch active={professor.Status === 1}>
                  <span>{professor.Status === 1 ? 'Ativo' : 'Inativo'}</span>
                </StatusSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleAlterarProfessor(professor)}>
                    <FaEdit /> Alterar
                  </Button>
                  <Button onClick={() => inativarProfessor(professor.id_professor)}>
                    <FaTimes /> Excluir
                  </Button>
                </div>
              </Td>
            </ProfessorItem>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <Button onClick={handleIncluirProfessor}>
          Incluir Professor <FaPlus />
        </Button>

        <PDFDownloadLink 
          document={
            <ProfessorPDF 
              professores={professores.filter(p => p.Status === 1)} 
              turmas={turmas} 
              disciplinas={disciplinas} 
              salas={salas}
            />
          } 
          fileName="relatorio_professores.pdf"
        >
          {({ blob, url, loading, error }) => 
            <PrintButton>
              {loading ? 'Carregando documento...' : 'Imprimir Relatório'} <FaPrint />
            </PrintButton>
          }
        </PDFDownloadLink>
      </div>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}><FaTimes /></CloseButton>
            <h3>{editandoProfessor ? 'Alterar Professor' : 'Cadastrar Novo Professor'}</h3>
            <FormGroup>
              <Label>Nome</Label>
              <Input
                type="text"
                value={novoProfessor.nome}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, nome: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>CPF</Label>
              <Input
                type="text"
                value={novoProfessor.cpf}
                onChange={handleCPFChange}
                required
                maxLength="14"
              />
              {cpfError && <span style={{ color: 'red', fontSize: '0.9em' }}>{cpfError}</span>}
            </FormGroup>
            <FormGroup>
              <Label>Titulação ou Especialidade</Label>
              <Input
                type="text"
                value={novoProfessor.especialidade}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, especialidade: e.target.value })}
                required
              />
            </FormGroup>
            <ButtonSave onClick={handleSalvarProfessor}>
              {editandoProfessor ? 'Salvar Alterações' : 'Salvar Professor'}
            </ButtonSave>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Professores;