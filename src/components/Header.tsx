import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppDispatch } from '../app/store';
import { signOut } from '../features/authSlice';
import { auth } from '../firebase';

interface HeaderProps {
  variant: 'default' | 'dashboard';
}

const Container = styled.header`
  min-width: 100%;
  padding-inline: 25%;
  margin-top: 2rem;
  margin-bottom: 4rem;
`;

const DashboardContainer = styled.header`
  display: flex;
  justify-content: space-between;
  min-width: 100%;
  padding-inline: 25%;
  margin-top: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 650px) {
    padding-inline: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
  color: #3f3d56;
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
  color: #3f3d56;

  @media (max-width: 650px) {
    font-size: 1.5rem;
  }
`;

export default function Header({ variant }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      {variant === 'default' ? (
        <>
          <Container>
            <Link to='/'>
              <Title>To do App</Title>
            </Link>
          </Container>
        </>
      ) : (
        <>
          <DashboardContainer>
            <Link to='/'>
              <Logo>To do App</Logo>
            </Link>
            <Menu>
              <MenuButton
                colorScheme='none'
                as={Button}
                color='black'
                _hover={{ cursor: 'pointer' }}
              >
                <Box display='flex' alignItems='center' gap='0.5rem'>
                  <Avatar
                    size='sm'
                    backgroundColor='#3f3d56'
                    src={auth.currentUser?.photoURL as string}
                  />
                  <Text>{auth.currentUser?.email}</Text>
                  <ChevronDownIcon />
                </Box>
              </MenuButton>
              <MenuList backgroundColor='#3f3d56'>
                <MenuItem
                  fontWeight='500'
                  backgroundColor='#3f3d56'
                  color='white'
                  _hover={{ backgroundColor: '#5a5779' }}
                  onClick={() => {
                    dispatch(signOut());
                    navigate('/signout');
                  }}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </DashboardContainer>
        </>
      )}
    </>
  );
}
