import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import styled from 'styled-components';
import { Box, Container } from '@chakra-ui/react';
import TodoCard from '../components/TodoCard';
import Footer from '../components/Footer';
import MainHeader from '../components/MainHeader';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from '../features/authSlice';

const Main = styled.main`
  padding-inline: 25%;
`;

const TodoContainer = styled.div`
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
  const todo = useSelector((state: RootState) => state.todo.value);
  const { user } = useSelector((state: RootState) => state.auth);
  const [tasks, setTasks] = useState<DocumentData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || user === undefined) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    const q = query(
      collection(db, 'todo'),
      where('user_id', '==', user?.user.uid),
      orderBy('timestamp')
    );
    onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data }))
      );
    });
  }, []);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <>
      <Header>To do App</Header>
      <Container position='absolute' top='0.75rem' right='11rem'>
        <Box
          as='button'
          fontWeight='500'
          color='#3f3d56'
          fontSize='1.1rem'
          onClick={handleSignOut}
        >
          Sign out
        </Box>
      </Container>
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
