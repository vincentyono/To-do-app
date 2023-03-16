import Header from '../components/Header';
import Footer from '../components/Footer';
import GetStarted from '/get-started.svg';
import { Button } from '@chakra-ui/react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 20%;
  margin-block: 5rem;
  margin-inline: auto;

  @media (max-width: 1320px) {
    max-width: 30%;
  }

  @media (max-width: 720px) {
    max-width: 50%;
  }

  @media (max-width: 600px) {
    max-width: 60%;
  }

  @media (max-width: 520px) {
    max-width: 65%;
  }

  @media (max-width: 420px) {
    max-width: 80%;
  }

  @media (max-width: 360px) {
    max-width: 85%;
  }
`;

const Image = styled.img``;

const H2 = styled.h2`
  text-align: center;
  margin-block: 2rem;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Poppins' sans-serif;
  color: #3f3d56;
`;

export default function Home() {
  return (
    <>
      <Header>To do App</Header>
      <Main>
        <Image src={GetStarted} alt='cat' />
        <H2>A simple To do app</H2>
        <Button
          as={Link}
          to={'/login'}
          bg='#6C63FF'
          color='white'
          marginBlock='2rem'
          _hover={{ backgroundColor: '#5c56c0' }}
        >
          Get started
        </Button>
      </Main>
      <Footer />
    </>
  );
}
