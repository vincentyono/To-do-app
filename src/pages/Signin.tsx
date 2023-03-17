import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Header from '../components/Header';
import styled from 'styled-components';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import Footer from '../components/Footer';
import { LinkTo } from '../components/LinkTo';

const Title = styled.header`
  font-size: 1.5em;
  font-weight: 600;
`;

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfimation] = useState('');

  return (
    <>
      <Header>To do App</Header>
      <Container
        bg='white'
        maxW='md'
        p='2rem'
        marginInline='auto'
        boxShadow='md'
        marginBottom='2rem'
      >
        <Title>Sign in</Title>
        <FormControl marginTop='1rem'>
          <FormLabel>Email</FormLabel>
          <Input type='email' focusBorderColor='#3F3D56' />
        </FormControl>
        <FormControl marginTop='1rem'>
          <FormLabel>Password</FormLabel>
          <Input type='password' focusBorderColor='#3F3D56' />
        </FormControl>
        <Box marginBlock='0.5rem 1rem' fontWeight='500'>
          Forgot your password?{' '}
          <LinkTo path='/forgot-password'>Reset Password</LinkTo>
        </Box>
        <Stack>
          <Button
            color='white'
            variant='outline'
            bg='#6C63FF'
            _hover={{ backgroundColor: '#5c56c0' }}
            leftIcon={<EmailIcon />}
          >
            Sign in with email
          </Button>
          <Button as='a' variant='outline' maxW='md' leftIcon={<FcGoogle />}>
            Sign in with Google
          </Button>
        </Stack>
        <Box marginBlock='1rem 0.5rem' textAlign='center' fontWeight='500'>
          Don't have an account?{' '}
          <LinkTo path='/signup'>Create an account</LinkTo>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
