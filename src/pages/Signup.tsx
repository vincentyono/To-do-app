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
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { LinkTo } from '../components/LinkTo';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { signInGoogle, signUp } from '../features/authSlice';
import { AppDispatch, RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Title = styled.header`
  font-size: 1.5em;
  font-weight: 600;
`;

export default function Signup() {
  const { error, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [internalError, setInternalError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isPasswordNotMatchError, setIsPasswordNotMatchError] = useState(false);
  const [isPasswordNotLongEnoughError, setIsPasswordLongNotEnoughError] =
    useState(false);
  const navigate = useNavigate();

  const handleSignUpWithEmail = () => {
    if (password.length < 6) {
      setIsPasswordLongNotEnoughError(true);
      return;
    }

    if (password !== passwordConfirmation) {
      setIsPasswordNotMatchError(true);
      return;
    }
    dispatch(signUp({ email, password }));

    if (error === 'Firebase: Error (auth/internal-error).') {
      setInternalError(true);
      return;
    }

    if (error === 'Firebase: Error (auth/email-already-in-use).') {
      setEmailError(true);
      return;
    }

    setInternalError(false);
    setEmailError(false);
    setIsPasswordLongNotEnoughError(false);
    setIsPasswordNotMatchError(false);
  };

  const handleSignInWithGoogle = () => {
    dispatch(signInGoogle());
  };

  useEffect(() => {
    if (auth.currentUser) navigate('/dashboard');
  }, [auth.currentUser]);

  return (
    <>
      <Header variant='default' />
      {internalError && (
        <Container maxW='lg' paddingInline='2rem' marginBottom='1rem'>
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle>Internal Error!</AlertTitle>
            <AlertDescription>Please try again later.</AlertDescription>
          </Alert>
        </Container>
      )}
      <Container
        position='relative'
        maxW='md'
        p='2rem'
        marginInline='auto'
        boxShadow='md'
        marginBottom='2rem'
      >
        <Title>Sign up</Title>
        <FormControl marginTop='1rem'>
          <FormLabel>Email</FormLabel>
          <Input
            type='email'
            focusBorderColor='#3F3D56'
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {emailError && (
            <FormErrorMessage>
              This email is already being used.
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          marginBlock='1rem'
          isInvalid={isPasswordNotLongEnoughError}
        >
          <FormLabel>Password</FormLabel>
          <Input
            type='password'
            focusBorderColor={
              isPasswordNotLongEnoughError ? '#E53E3E' : '#3F3D56'
            }
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {isPasswordNotLongEnoughError && (
            <FormHelperText fontWeight='500' color='#E53E3E'>
              Password need to be at least 6 characters
            </FormHelperText>
          )}
        </FormControl>

        <FormControl marginBlock='1rem 2rem'>
          <FormLabel>Password Confirmation</FormLabel>
          <Input
            type='password'
            focusBorderColor={isPasswordNotMatchError ? '#E53E3E' : '#3F3D56'}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
          />
          {isPasswordNotMatchError && (
            <FormErrorMessage fontWeight='500' color='#E53E3E'>
              Password doesn't match
            </FormErrorMessage>
          )}
        </FormControl>

        <Stack>
          <Button
            type='submit'
            variant='outline'
            bg='#6C63FF'
            color='white'
            _hover={{ backgroundColor: '#5c56c0' }}
            leftIcon={<EmailIcon />}
            onClick={() => handleSignUpWithEmail()}
          >
            Sign up with email
          </Button>
        </Stack>

        <Box fontWeight='500' textAlign='center' marginBlock='1.5rem'>
          Have an account?{' '}
          <LinkTo
            path='/signin'
            style={{ color: '#5c56c0', textDecoration: 'underline' }}
          >
            Sign In
          </LinkTo>
        </Box>
        <Stack>
          <Button
            variant='outline'
            maxW='md'
            leftIcon={<FcGoogle />}
            onClick={() => handleSignInWithGoogle()}
          >
            Sign in with Google
          </Button>
        </Stack>
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
