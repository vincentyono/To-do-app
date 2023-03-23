import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Header from '../components/Header';
import styled from 'styled-components';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import Footer from '../components/Footer';
import { LinkTo } from '../components/LinkTo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { signInEmail, signInGoogle } from '../features/authSlice';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Title = styled.header`
  font-size: 1.5em;
  font-weight: 600;
`;

export default function Signin() {
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailOrPasswordError, setIsEmailOrPasswordError] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInternalError, setIsInternalError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSignInWithEmail = () => {
    const emailValidator = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!emailValidator.test(email)) {
      setIsInvalidEmail(true);
      return;
    }

    if (password.length === 0) {
      setIsInvalidPassword(true);
      return;
    }

    dispatch(signInEmail({ email, password }));

    if (
      error === 'Firebase: (auth/invalid-email).' ||
      error === 'Firebase: (auth/invalid-password).'
    ) {
      setIsInternalError(false);
      setIsEmailOrPasswordError(true);
      return;
    }

    if (error == 'Firebase: Error (auth/internal-error).') {
      setIsEmailOrPasswordError(false);
      setIsInternalError(true);
      return;
    }

    if (auth.currentUser) {
      navigate('/dashboard');
    }

    setIsEmailOrPasswordError(false);
  };

  const handleSignInWithGoogle = () => {
    dispatch(signInGoogle());
    if (error) {
      setIsEmailOrPasswordError(true);
      return;
    }

    setIsEmailOrPasswordError(false);
  };

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard');
    }
  }, [auth.currentUser]);

  return (
    <>
      <Header variant='default' />
      {isEmailOrPasswordError && (
        <Container maxW='lg' paddingInline='2rem' marginBottom='1rem'>
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle>Invalid Credentials!</AlertTitle>
            <AlertDescription>Please try again.</AlertDescription>
          </Alert>
        </Container>
      )}
      {isInternalError && (
        <Container maxW='lg' paddingInline='2rem' marginBottom='1rem'>
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle>Invalid Credentials!</AlertTitle>
            <AlertDescription>Please try again.</AlertDescription>
          </Alert>
        </Container>
      )}
      <Container
        position='relative'
        bg='white'
        maxW='md'
        p='2rem'
        marginInline='auto'
        boxShadow='md'
        marginBottom='2rem'
      >
        <Title>Sign in</Title>

        <FormControl marginTop='1rem' isInvalid={isInvalidEmail}>
          <FormLabel>Email</FormLabel>
          <Input
            type='email'
            value={email}
            focusBorderColor='#3F3D56'
            onChange={(e) => setEmail(e.target.value)}
          />
          {isInvalidEmail && (
            <FormErrorMessage fontWeight='500'>Invalid Email</FormErrorMessage>
          )}
        </FormControl>
        <FormControl marginTop='1rem' isInvalid={isInvalidPassword}>
          <FormLabel>Password</FormLabel>
          <Input
            type='password'
            value={password}
            focusBorderColor='#3F3D56'
            onChange={(e) => setPassword(e.target.value)}
          />
          {isInvalidPassword && (
            <FormErrorMessage fontWeight='500'>
              Password cannot be empty
            </FormErrorMessage>
          )}
        </FormControl>
        <Box marginBlock='0.5rem 1rem' fontWeight='500'>
          Forgot your password?{' '}
          <LinkTo
            path='/forgot-password'
            style={{ color: '#5c56c0', textDecoration: 'underline' }}
          >
            Reset Password
          </LinkTo>
        </Box>

        <Stack>
          <Button
            color='white'
            variant='outline'
            bg='#6C63FF'
            _hover={{ backgroundColor: '#5c56c0' }}
            leftIcon={<EmailIcon />}
            onClick={() => handleSignInWithEmail()}
          >
            Sign in with email
          </Button>
          <Button
            as='a'
            variant='outline'
            maxW='md'
            leftIcon={<FcGoogle />}
            _hover={{
              cursor: 'pointer',
            }}
            onClick={() => handleSignInWithGoogle()}
          >
            Sign in with Google
          </Button>
        </Stack>
        <Box marginBlock='1rem 0.5rem' textAlign='center' fontWeight='500'>
          Don't have an account?{' '}
          <LinkTo
            path='/signup'
            style={{ color: '#5c56c0', textDecoration: 'underline' }}
          >
            Create an account
          </LinkTo>
        </Box>
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
      </Container>
      <Footer />
    </>
  );
}
