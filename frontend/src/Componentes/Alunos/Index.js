import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

const AlunoItem = styled.tr`
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
  max-height: 80vh;
  overflow-y: auto;
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

const TurmasList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TurmaItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
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

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTurmasModalOpen, setIsTurmasModalOpen] = useState(false);
  const [novoAluno, setNovoAluno] = useState({ nome: '', email: '', Status: 1 });
  const [editandoAluno, setEditandoAluno] = useState(null);
  const [selectedAlunoTurmas, setSelectedAlunoTurmas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const alunosPerPage = 4;

  useEffect(() => {
    fetchAlunos();
    fetchTurmas();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alunos');
      const alunosData = response.data;
      
      const alunosWithTurmas = await Promise.all(
        alunosData.map(async (aluno) => {
          const turmaResponse = await axios.get(`http://localhost:5000/alunosTurmas/aluno/${aluno.id_aluno}`);
          return { ...aluno, turmas: turmaResponse.data || [] };
        })
      );
      
      setAlunos(alunosWithTurmas);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
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

  const filtrarAlunos = () => {
    return alunos.filter(aluno => {
      const nomeCondicao = aluno.nome.toLowerCase().includes(pesquisa.toLowerCase());
      const statusCondicao = aluno.Status === 1;
      return nomeCondicao && statusCondicao;
    });
  };

  const paginatedAlunos = () => {
    const filtered = filtrarAlunos();
    const startIndex = (currentPage - 1) * alunosPerPage;
    return filtered.slice(startIndex, startIndex + alunosPerPage);
  };

  const pageCount = Math.ceil(filtrarAlunos().length / alunosPerPage);

  const handleIncluirAluno = () => {
    setEditandoAluno(null);
    setNovoAluno({ nome: '', email: '', Status: 1 });
    setIsModalOpen(true);
  };

  const handleAlterarAluno = (aluno) => {
    setEditandoAluno(aluno);
    setNovoAluno(aluno);
    setIsModalOpen(true);
  };

  const handleSalvarAluno = async () => {
    if (!novoAluno.nome || !novoAluno.email) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      if (editandoAluno) {
        await axios.put(`http://localhost:5000/alunos/${editandoAluno.id_aluno}`, novoAluno);
      } else {
        await axios.post('http://localhost:5000/alunos', novoAluno);
      }

      fetchAlunos();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    }

    setIsModalOpen(false);
  };

  const inativarAluno = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/alunos/${id}`);
      fetchAlunos();
    } catch (error) {
      console.error('Erro ao inativar aluno:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVerTurmas = async (aluno) => {
    setSelectedAlunoTurmas(aluno.turmas);
    setIsTurmasModalOpen(true);
  };

  const handleCloseTurmasModal = () => {
    setIsTurmasModalOpen(false);
    setSelectedAlunoTurmas([]);
  };

  return (
    <Container>
      <Titulo>Gestão de Alunos</Titulo>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Pesquisar alunos"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <SearchButton><FaSearch /></SearchButton>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {paginatedAlunos().map(aluno => (
            <AlunoItem key={aluno.id_aluno}>
              <Td>{aluno.id_aluno}</Td>
              <Td>{aluno.nome}</Td>
              <Td>{aluno.email}</Td>
              <Td>
                <StatusSwitch active={aluno.Status === 1}>
                  <span>{aluno.Status === 1 ? 'Ativo' : 'Inativo'}</span>
                </StatusSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleAlterarAluno(aluno)}>
                    <FaEdit /> Alterar
                  </Button>
                  <Button onClick={() => handleVerTurmas(aluno)}>
                    <FaEye /> Ver Turmas
                  </Button>
                  <Button onClick={() => inativarAluno(aluno.id_aluno)}>
                    <FaTimes /> Excluir
                  </Button>
                </div>
              </Td>
            </AlunoItem>
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

      <Button onClick={handleIncluirAluno}><FaPlus /> Incluir Aluno</Button>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}><FaTimes /></CloseButton>
            <h3>{editandoAluno ? 'Editar Aluno' : 'Adicionar Aluno'}</h3>
            <FormGroup>
              <Label>Nome</Label>
              <Input
                type="text"
                value={novoAluno.nome}
                onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={novoAluno.email}
                onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
              />
            </FormGroup>
            <ButtonSave onClick={handleSalvarAluno}>
              {editandoAluno ? 'Salvar Alterações' : 'Adicionar Aluno'}
            </ButtonSave>
          </ModalContent>
        </ModalOverlay>
      )}

      {isTurmasModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseTurmasModal}><FaTimes /></CloseButton>
            <h3>Turmas do Aluno</h3>
            <TurmasList>
              {selectedAlunoTurmas.map((turma) => (
                <TurmaItem key={turma.id_turma}>
                  <span>{turma.nome}</span>
                  <StatusSwitch active={turma.Status === 1}>
                    <span>{turma.Status === 1 ? 'Ativa' : 'Inativa'}</span>
                  </StatusSwitch>
                </TurmaItem>
              ))}
            </TurmasList>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}