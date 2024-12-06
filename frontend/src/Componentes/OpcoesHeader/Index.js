import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Opcao = styled.li`
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: 0 5px;
  cursor: pointer;
  min-width: 120px;
`;

const Opcoes = styled.ul`
  display: flex;
`;

const BotaoOpcao = styled.button`
  background-color: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 10px;
  &: hover{
  color: #326589;
  }

`;


const textoOpcoes = ['INICIO','ALUNOS','PROFESSORES', 'SALAS','TURMAS', 'DISCIPLINAS','INATIVOS'];

function OpcoesHeader() {
  const navigate = useNavigate();

  const handleClick = (opcao) => {
    if (opcao === 'INICIO') {
      navigate('/');
    } else {
      navigate(`/${opcao.toLowerCase()}`);
    }
    if (opcao === 'ALUNOS') {
      navigate('/alunos');
    } else {
      console.log(`Botão ${opcao} foi clicado!`);
    }
    if (opcao === 'PROFESSORES') {
      navigate('/Professores');
    } else {
      console.log(`Botão ${opcao} foi clicado!`);
    }
    if (opcao === 'SALAS') {
      navigate('/Salas');
    } else {
      console.log(`Botão ${opcao} foi clicado!`);
    }
    if (opcao === 'TURMAS') {
      navigate('/Turmas');
    } else {
      console.log(`Botão ${opcao} foi clicado!`);
    }
    if (opcao === 'DISCIPLINAS') {
      navigate('/Disciplinas');
    } else {
      console.log(`Botão ${opcao} foi clicado!`);
    }
    if (opcao === 'INATIVOS') {
      navigate('/Inativos');
    } else {
      console.log(`Botão ${opcao} foi clicado!`);
    }
  };

  return (
    <Opcoes>
      {textoOpcoes.map((texto, index) => (
        <Opcao key={index}>
          <BotaoOpcao onClick={() => handleClick(texto)}>
            {texto}
          </BotaoOpcao>
        </Opcao>
      ))}
    </Opcoes>
  );
}

export default OpcoesHeader;
