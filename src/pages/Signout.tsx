import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Container,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signout() {
  const [seconds, setSeconds] = useState<number>(3);
  const navigate = useNavigate();
  useEffect(() => {
    if (seconds === 0) {
      navigate('/');
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <Container marginBlock='auto'>
      <Alert
        status='success'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
        maxW='lg'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Logout Successful!
        </AlertTitle>
        <AlertDescription>
          Redirecting to Home page in {seconds} seconds...
        </AlertDescription>
      </Alert>
    </Container>
  );
}
