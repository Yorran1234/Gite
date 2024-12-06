import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

const DisciplinaItem = styled.tr`
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

const Select = styled.select`
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

const ErrorMessage = styled.span`
  color: #E74C3C;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
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

const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoDisciplina, setEditandoDisciplina] = useState(null);
  const [novaDisciplina, setNovaDisciplina] = useState({
    nome: '',
    status: 'Ativo',
    codigo: '#',
    periodo: ''
  });
  const [codigoError, setCodigoError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const disciplinasPerPage = 4;

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/disciplinas');
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  const filtrarDisciplinas = () => {
    return disciplinas.filter(disciplina => {
      const nomeCondicao = disciplina.nome.toLowerCase().includes(pesquisa.toLowerCase());
      return nomeCondicao && disciplina.status === 'Ativo';
    });
  };

  const paginatedDisciplinas = () => {
    const filtered = filtrarDisciplinas();
    const startIndex = (currentPage - 1) * disciplinasPerPage;
    return filtered.slice(startIndex, startIndex + disciplinasPerPage);
  };

  const pageCount = Math.ceil(filtrarDisciplinas().length / disciplinasPerPage);

  const handleIncluirDisciplina = () => {
    setEditandoDisciplina(null);
    setNovaDisciplina({ nome: '', status: 'Ativo', codigo: '#', periodo: '' });
    setCodigoError('');
    setIsModalOpen(true);
  };

  const handleAlterarDisciplina = (disciplina) => {
    setEditandoDisciplina(disciplina);
    setNovaDisciplina(disciplina);
    setCodigoError('');
    setIsModalOpen(true);
  };

  const handleCodigoChange = (e) => {
    const value = e.target.value;
    if (value.length <= 7 && value.startsWith('#')) {
      setNovaDisciplina({ ...novaDisciplina, codigo: value });
      setCodigoError('');
    } else if (!value.startsWith('#')) {
      setNovaDisciplina({ ...novaDisciplina, codigo: '#' + value.slice(0, 6) });
      setCodigoError('');
    } else {
      setCodigoError('Código inválido');
    }
  };

  const handleSalvarDisciplina = async () => {
    if (!novaDisciplina.nome || !novaDisciplina.codigo || !novaDisciplina.periodo) {
      alert("Preencha todos os campos antes de salvar!");
      return;
    }

    if (novaDisciplina.codigo.length !== 7 || !novaDisciplina.codigo.startsWith('#')) {
      setCodigoError('Código inválido');
      return;
    }

    try {
      if (editandoDisciplina) {
        await axios.put(`http://localhost:5000/disciplinas/${editandoDisciplina.id_disciplina}`, novaDisciplina);
      } else {
        await axios.post('http://localhost:5000/disciplinas', novaDisciplina);
      }
      fetchDisciplinas();
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error);
    }

    setNovaDisciplina({ nome: '', status: 'Ativo', codigo: '#', periodo: '' });
    setIsModalOpen(false);
  };

  const inativarDisciplina = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/disciplinas/${id}`);
      fetchDisciplinas();
    } catch (error) {
      console.error('Erro ao inativar disciplina:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Titulo>Gestão de Disciplinas</Titulo>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Consultar disciplinas"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <SearchButton><FaSearch /></SearchButton>
      </SearchBar>
      <Table>
        <thead>
          <tr>
            <Th>Código da Disciplina</Th>
            <Th>Nome da Disciplina</Th>
            <Th>Período</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {paginatedDisciplinas().map(disciplina => (
            <DisciplinaItem key={disciplina.id_disciplina}>
              <Td>{disciplina.codigo}</Td>
              <Td>{disciplina.nome}</Td>
              <Td>{disciplina.periodo}</Td>
              <Td>
                <StatusSwitch active={disciplina.status === 'Ativo'}>
                  <span>{disciplina.status === 'Ativo' ? 'Ativo' : 'Inativo'}</span>
                </StatusSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleAlterarDisciplina(disciplina)}>
                    <FaEdit /> Alterar
                  </Button>
                  <Button onClick={() => inativarDisciplina(disciplina.id_disciplina)}>
                    <FaTimes /> Excluir
                  </Button>
                </div>
              </Td>
            </DisciplinaItem>
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
      <Button onClick={handleIncluirDisciplina}>
        Incluir Disciplina <FaPlus />
      </Button>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>
              <FaTimes />
            </CloseButton>
            <h3>{editandoDisciplina ? 'Alterar Disciplina' : 'Cadastrar Nova Disciplina'}</h3>
            <FormGroup>
              <Label>Nome da Disciplina</Label>
              <Input
                type="text"
                value={novaDisciplina.nome}
                onChange={(e) => setNovaDisciplina({ ...novaDisciplina, nome: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Código</Label>
              <Input
                type="text"
                value={novaDisciplina.codigo}
                onChange={handleCodigoChange}
                maxLength={7}
              />
              {codigoError && <ErrorMessage>{codigoError}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Período</Label>
              <Select
                value={novaDisciplina.periodo}
                onChange={(e) => setNovaDisciplina({ ...novaDisciplina, periodo: e.target.value })}
              >
                <option value="">Selecione o período</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}º Período
                  </option>
                ))}
              </Select>
            </FormGroup>
            <ButtonSave onClick={handleSalvarDisciplina}>
              {editandoDisciplina ? 'Salvar Alterações' : 'Salvar Disciplina'}
            </ButtonSave>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Disciplinas;