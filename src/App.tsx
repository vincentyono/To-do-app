import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import Header from './components/Header';
import styled from 'styled-components';
import { Box } from '@chakra-ui/react';
import TodoCard from './components/TodoCard';
import Footer from './components/Footer';
import MainHeader from './components/MainHeader';

const Main = styled.main`
  padding-inline: 25%;
`;

const TodoContainer = styled.div`
  min-width: '100%';
  margin-block: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a365d;
  border-radius: 5px;
  padding: 1rem 1.5rem;
`;

export default function App() {
  const todo = useSelector((state: RootState) => state.todo.value);

  return (
    <>
      <Header>To Do App</Header>
      <Main>
        <MainHeader />
        <TodoContainer>
          {todo.length > 0 ? (
            todo.map((task) => (
              <TodoCard
                key={task.id}
                id={task.id}
                title={task.title}
                timestamp={task.timestamp}
                status={task.status}
              />
            ))
          ) : (
            <Box
              padding='0.75em 1.5em'
              bg='white'
              width='fit-content'
              borderRadius='5px'
              fontWeight='600'
            >
              No Task
            </Box>
          )}
        </TodoContainer>
      </Main>
      <Footer />
    </>
  );
}
