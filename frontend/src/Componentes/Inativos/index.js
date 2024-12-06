import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Styled components (unchanged)
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

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const NavButton = styled.button`
  padding: 10px 15px;
  background-color: #F7F9FB;
  color: #326589;
  border: 2px solid #326589;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;

  &:hover {
    background-color: #326589;
    color: white;
  }
`;

const SearchInput = styled.input`
  padding: 12px 12px;
  margin-bottom: 30px;
  border-radius: 30px;
  border: 5px solid #9ED1F5;
  width: 1200px;
  font-size: 1.0rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #326589;
    box-shadow: 0 0 0 2px rgba(50, 101, 137, 0.2);
  }

  &::placeholder {
    color: #A0B3D5;
  }
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

const InativoItem = styled.tr`
  background-color: #ECF7FE;

  &:nth-child(even) {
    background-color: #F4FAFF;
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #F7F9FB;
  color: #326589;
  border: 2px solid #326589;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 0.1px;

  &:hover {
    background-color: #326589;
    color: white;
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

function Inativos() {
  const [activeTab, setActiveTab] = useState('alunos');
  const [alunosInativos, setAlunosInativos] = useState([]);
  const [professoresInativos, setProfessoresInativos] = useState([]);
  const [disciplinasInativas, setDisciplinasInativas] = useState([]);
  const [salasInativas, setSalasInativas] = useState([]);
  const [turmasInativas, setTurmasInativas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchInativos();
  }, []);

  const tipoMap = {
    alunos: 'aluno',
    professores: 'professor',
    disciplinas: 'disciplina',
    salas: 'sala',
    turmas: 'turma'
  };
  

  const fetchInativos = async () => {
    try {
      const alunosResponse = await axios.get('http://localhost:5000/alunos');
      setAlunosInativos(alunosResponse.data.filter(aluno => aluno.Status === 0));

      const professoresResponse = await axios.get('http://localhost:5000/professores');
      setProfessoresInativos(professoresResponse.data.filter(professor => professor.Status === 0));

      const disciplinasResponse = await axios.get('http://localhost:5000/disciplinas');
      setDisciplinasInativas(disciplinasResponse.data.filter(disciplina => disciplina.status === 'Inativo'));

      const salasResponse = await axios.get('http://localhost:5000/salas');
      setSalasInativas(salasResponse.data.filter(sala => sala.Status === 0));

      const turmasResponse = await axios.get('http://localhost:5000/turmas');
      setTurmasInativas(turmasResponse.data.filter(turma => turma.Status === 0));
    } catch (error) {
      console.error('Erro ao buscar inativos:', error);
    }
  };

  const reativarItem = async (id, tipo) => {
    try {
      let url;
      switch (tipo) {
        case 'aluno':
          url = `http://localhost:5000/alunos/reativar/${id}`;
          break;
        case 'professor':
          url = `http://localhost:5000/professores/reativar/${id}`;
          break;
        case 'disciplina':
          url = `http://localhost:5000/disciplinas/reativar/${id}`;
          break;
        case 'sala':
          url = `http://localhost:5000/salas/reativar/${id}`;
          break;
        case 'turma':
          url = `http://localhost:5000/turmas/reativar/${id}`;
          break;
        default:
          throw new Error('Tipo inválido');
      }
      await axios.put(url);
      fetchInativos();
    } catch (error) {
      console.error(`Erro ao reativar ${tipo}:`, error);
    }
  };

  const filteredItems = (items, key) =>
    items.filter(item =>
      item[key].toLowerCase().includes(searchTerm.toLowerCase())
    );

  const paginatedItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderTabela = () => {
    let items, keyField, columns;

    switch (activeTab) {
      case 'alunos':
        items = filteredItems(alunosInativos, 'nome');
        keyField = 'id_aluno';
        columns = [
          { header: 'ID', field: 'id_aluno' },
          { header: 'Nome', field: 'nome' },
          { header: 'Email', field: 'email' },
        ];
        break;
      case 'professores':
        items = filteredItems(professoresInativos, 'nome');
        keyField = 'id_professor';
        columns = [
          { header: 'Nome', field: 'nome' },
          { header: 'CPF', field: 'cpf' },
          { header: 'Especialidade', field: 'especialidade' },
        ];
        break;
      case 'disciplinas':
        items = filteredItems(disciplinasInativas, 'nome');
        keyField = 'id_disciplina';
        columns = [
          { header: 'ID', field: 'id_disciplina' },
          { header: 'Nome', field: 'nome' },
        ];
        break;
      case 'salas':
        items = filteredItems(salasInativas, 'numero');
        keyField = 'id_sala';
        columns = [
          { header: 'ID', field: 'id_sala' },
          { header: 'Nome', field: 'numero' },
          { header: 'Bloco', field: 'bloco' },
        ];
        break;
      case 'turmas':
        items = filteredItems(turmasInativas, 'nome');
        keyField = 'id_turma';
        columns = [
          { header: 'ID', field: 'id_turma' },
          { header: 'Nome', field: 'nome' },
          { header: 'Dia da Semana', field: 'semestre' },
          { header: 'Ano', field: 'ano' },
        ];
        break;
      default:
        return null;
    }

    const paginatedData = paginatedItems(items);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    return (
      <>
        <h3>{`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Inativos`}</h3>
        <SearchInput
          type="text"
          placeholder={`Pesquisar ${activeTab} Inativos`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <Th key={index}>{column.header}</Th>
              ))}
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <InativoItem key={item[keyField]}>
                {columns.map((column, index) => (
                  <Td key={index}>{item[column.field]}</Td>
                ))}
                <Td>
               
  <Button onClick={() => reativarItem(item[keyField], tipoMap[activeTab])}>
    <FaCheck /> Reativar
  </Button>
  
                </Td>
              </InativoItem>
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
      </>
    );
  };

  return (
    <Container>
      <Titulo>INATIVOS</Titulo>
      <Navigation>
        <NavButton onClick={() => { setActiveTab('alunos'); setCurrentPage(1); }}>Alunos</NavButton>
        <NavButton onClick={() => { setActiveTab('professores'); setCurrentPage(1); }}>Professores</NavButton>
        <NavButton onClick={() => { setActiveTab('disciplinas'); setCurrentPage(1); }}>Disciplinas</NavButton>
        <NavButton onClick={() => { setActiveTab('salas'); setCurrentPage(1); }}>Salas</NavButton>
        <NavButton onClick={() => { setActiveTab('turmas'); setCurrentPage(1); }}>Turmas</NavButton>
      </Navigation>
      {renderTabela()}
    </Container>
  );
}

export default Inativos;