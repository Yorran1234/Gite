import React, { useState, useEffect } from 'react';
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

const SalaItem = styled.tr`
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

function Salas() {
  const [salas, setSalas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoSala, setEditandoSala] = useState(null);
  const [novaSala, setNovaSala] = useState({
    numero: '',
    bloco: '',
    capacidade: '',
    status: 'Ativo'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const salasPerPage = 4;

  const fetchSalas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/salas');
      setSalas(response.data);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const filtrarSalas = () => {
    return salas.filter(sala => {
      const numero = sala.numero ? sala.numero.toString().toLowerCase() : '';
      const termoPesquisa = pesquisa ? pesquisa.toLowerCase() : '';
  
      const nomeCondicao = numero.includes(termoPesquisa);
      const statusCondicao = sala.Status === 1;
      return nomeCondicao && statusCondicao;
    });
  };

  const paginatedSalas = () => {
    const filtered = filtrarSalas();
    const startIndex = (currentPage - 1) * salasPerPage;
    return filtered.slice(startIndex, startIndex + salasPerPage);
  };

  const pageCount = Math.ceil(filtrarSalas().length / salasPerPage);

  const handleIncluirSala = () => {
    setEditandoSala(null);
    setNovaSala({ numero: '', bloco: '', capacidade: '', status: 'Ativo' });
    setIsModalOpen(true);
  };

  const handleAlterarSala = (sala) => {
    setEditandoSala(sala);
    setNovaSala(sala);
    setIsModalOpen(true);
  };

  const handleSalvarSala = async () => {
    if (!novaSala.numero || !novaSala.bloco || !novaSala.capacidade) {
      alert("Preencha todos os campos antes de salvar!");
      return;
    }
  
    try {
      if (editandoSala) {
        await axios.put(`http://localhost:5000/salas/${editandoSala.id_sala}`, novaSala);
        setSalas(salas.map(sala => sala.id_sala === editandoSala.id_sala ? novaSala : sala));
      } else {
        const response = await axios.post('http://localhost:5000/salas', novaSala);
  
        if (response.data) {
          setSalas([...salas, response.data]);
        }
      }
  
      setNovaSala({ numero: '', bloco: '', capacidade: '', status: 'Ativo' });
      setIsModalOpen(false);
      fetchSalas();
    } catch (error) {
      console.error('Erro ao salvar sala:', error);
    }
  };

  const inativarSala = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/salas/${id}`);
      fetchSalas();
    } catch (error) {
      console.error('Erro ao inativar sala:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Titulo>Gestão de Salas</Titulo>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Consultar lista de salas"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <SearchButton><FaSearch /></SearchButton>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>Nome da Sala</Th>
            <Th>Local (Bloco)</Th>
            <Th>Capacidade</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {paginatedSalas().map(sala => (
            <SalaItem key={sala.id_sala}>
              <Td>{sala.numero}</Td>
              <Td>{sala.bloco}</Td>
              <Td>{sala.capacidade}</Td>
              <Td>
                <StatusSwitch active={sala.Status === 1}>
                  <span>{sala.Status === 1 ? 'Ativo' : 'Inativo'}</span>
                </StatusSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <Button onClick={() => handleAlterarSala(sala)}>
                    <FaEdit /> Alterar
                  </Button>
                  <Button onClick={() => inativarSala(sala.id_sala)}>
                    <FaTimes /> Excluir
                  </Button>
                </div>
              </Td>
            </SalaItem>
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

      <Button onClick={handleIncluirSala}>
        Incluir Sala <FaPlus />
      </Button>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>
              <FaTimes />
            </CloseButton>
            <h3>{editandoSala ? 'Alterar Sala' : 'Cadastrar Nova Sala'}</h3>
            <FormGroup>
              <Label>Nome da Sala</Label>
              <Input
                type="text"
                value={novaSala.numero}
                onChange={(e) => setNovaSala({ ...novaSala, numero: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Local (Bloco)</Label>
              <Input
                type="text"
                value={novaSala.bloco}
                onChange={(e) => setNovaSala({ ...novaSala, bloco: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Capacidade</Label>
              <Select
                value={novaSala.capacidade}
                onChange={(e) => setNovaSala({ ...novaSala, capacidade: e.target.value })}
                required
              >
                <option value="">Selecione a capacidade</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="60">60</option>
                <option value="80">80</option>
                <option value="100">100</option>
              </Select>
            </FormGroup>
            <ButtonSave onClick={handleSalvarSala}>
              {editandoSala ? 'Salvar Alterações' : 'Salvar Sala'}
            </ButtonSave>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default Salas;