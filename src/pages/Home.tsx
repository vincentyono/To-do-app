import Header from '../components/Header';
import Footer from '../components/Footer';
import GetStarted from '/get-started.svg';
import { Button, Container, Stack, Text } from '@chakra-ui/react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from '../firebase';

const H2 = styled.h2`
  text-align: center;
  margin-block: 2rem;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Poppins' sans-serif;
  color: #3f3d56;
`;

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <>
      <Header variant='default' />
      <Container as='main' maxW='md' marginBlock='3rem 1.5rem'>
        <img src={GetStarted} alt='cat' />
        <H2>A simple To do app</H2>
        <Text textAlign='center' fontWeight='500'>
          Sign in with email using
        </Text>
        <Text textAlign='center'>Email: guest@email.com</Text>
        <Text textAlign='center'>Password: testing123</Text>
        <Stack paddingInline='3.5rem'>
          <Button
            as={Link}
            to={'/signin'}
            bg='#6C63FF'
            color='white'
            marginBlock='2rem'
            _hover={{ backgroundColor: '#5c56c0' }}
            onClick={() => navigate('/signin')}
          >
            Get started
          </Button>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
