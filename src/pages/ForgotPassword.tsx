import { EmailIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import styled from 'styled-components';
import { LinkTo } from '../components/LinkTo';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../features/authSlice';
import { AppDispatch, RootState } from '../app/store';

const Title = styled.h1`
  font-size: 1.5em;
  font-weight: 600;
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [isInvalidEmail, setIsInvalidEmail] = useState<boolean>(false);
  const { isLoading, resetPasswordSent } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleResetPassword = () => {
    const emailValidator = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!emailValidator.test(email)) {
      setIsInvalidEmail(true);
      return;
    }

    try {
      dispatch(resetPassword(email));
      setIsInvalidEmail(false);
    } catch (error: unknown) {
      setIsInvalidEmail(true);
      return;
    }
    setEmail('');
  };

  return (
    <>
      <Header variant='default' />
      {resetPasswordSent && (
        <Container maxW='lg' paddingInline='2rem' marginBottom='1rem'>
          <Alert status='warning'>
            <AlertIcon />
            <AlertTitle>An email has been sent to your inbox</AlertTitle>
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
        <Title>Reset Password</Title>

        <FormControl marginTop='1rem' isInvalid={isInvalidEmail}>
          <FormLabel>Email</FormLabel>
          <Input
            type='email'
            value={email}
            focusBorderColor='#3F3D56'
            onChange={(e) => setEmail(e.target.value)}
          />
          {isInvalidEmail && (
            <FormErrorMessage fontWeight='500'>
              User doesn't exist, please enter another email.
            </FormErrorMessage>
          )}
        </FormControl>
        <Stack>
          <Button
            color='white'
            variant='outline'
            bg='#6C63FF'
            marginTop='1rem'
            _hover={{ backgroundColor: '#5c56c0' }}
            leftIcon={<EmailIcon />}
            onClick={() => {
              handleResetPassword();
            }}
          >
            Reset Password
          </Button>
          <LinkTo
            path='/signin'
            style={{
              color: '#5c56c0',
              textAlign: 'center',
              marginTop: '1rem',
              fontWeight: 500,
              textDecoration: 'underline',
            }}
          >
            Back to Sign in
          </LinkTo>
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
