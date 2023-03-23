import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import styled from 'styled-components';
import { Box, Container, Spinner } from '@chakra-ui/react';
import TodoCard from '../components/TodoCard';
import Footer from '../components/Footer';
import MainHeader from '../components/MainHeader';
import { useEffect } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { setTask, taskCollection, TaskDocument } from '../features/todoSlice';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Main = styled.main`
  padding-inline: 25%;

  @media (max-width: 650px) {
    padding-inline: 1rem;
  }
`;

const TodoContainer = styled.div`
  position: 'relative';
  min-width: '100%';
  margin-block: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #3f3d56;
  border-radius: 5px;
  padding: 1rem 1.5rem;
`;

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredTasks, isLoading } = useSelector(
    (state: RootState) => state.todo
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
      return;
    }
    const unsubscribe = onSnapshot(
      query(
        taskCollection,
        where('user_id', '==', auth.currentUser?.uid as string),
        orderBy('timestamp', 'desc')
      ),
      (querySnapshot) => {
        dispatch(
          setTask(
            querySnapshot.docs.map((doc) => {
              const id = doc.id;
              return { id, ...doc.data() } as TaskDocument;
            })
          )
        );
      }
    );
    return unsubscribe;
  }, []);

  return (
    <>
      <Header variant='dashboard' />
      <Main>
        <MainHeader />
        <TodoContainer>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TodoCard
                key={index}
                id={task.id as string}
                title={task?.title as string}
                timestamp={
                  new Date(task?.timestamp as number).toLocaleString(
                    'en-US'
                  ) as string
                }
                status={task?.status as boolean}
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
          {isLoading && (
            <Container
              position='absolute'
              minWidth='100%'
              minHeight='100%'
              bg='#ffffff60'
              top='0'
              left='0'
              centerContent
            >
              <Spinner
                size='xl'
                color='#3F3D56'
                marginBlock='auto'
                thickness='4px'
              />
            </Container>
          )}
        </TodoContainer>
      </Main>
      <Footer />
    </>
  );
}
