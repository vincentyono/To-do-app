import { useState } from 'react';
import {
  Checkbox,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import styled from 'styled-components';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import TodoModal from './TodoModal';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../features/todoSlice';
import { AppDispatch } from '../app/store';

interface TodoCardProps {
  id: string;
  title: string;
  timestamp: string;
  status: boolean;
}

const Container = styled.article`
  display: flex;
  align-items: center;
  min-width: 100%;
  background-color: #fff;
  padding: 1rem;
  margin-block: 0.5rem;
  border-radius: 5px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-inline: 1rem;
`;

const ButtonContainer = styled.div`
  margin-left: auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: 'Poppins' sans-serif;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
`;

export default function TodoCard({
  id,
  title,
  timestamp,
  status,
}: TodoCardProps) {
  const [isChecked, setIsChecked] = useState(status);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(Boolean(e.currentTarget.checked));
    dispatch(
      updateTask({
        id,
        title,
        timestamp: Date.parse(timestamp),
        status: Boolean(e.currentTarget.checked),
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteTask(id));
    toast({
      title: 'Successfully deleted',
      status: 'success',
      variant: 'subtle',
      isClosable: true,
      position: 'bottom-right',
      duration: 1000,
    });
  };

  return (
    <Container>
      <Checkbox
        size='lg'
        colorScheme='purple'
        isChecked={status}
        onChange={(e) => handleCheck(e)}
      />
      <TitleContainer>
        {status ? (
          <Title style={{ textDecoration: 'line-through', color: '#00000080' }}>
            {title}
          </Title>
        ) : (
          <Title>{title}</Title>
        )}

        <Timestamp>{timestamp}</Timestamp>
      </TitleContainer>
      <ButtonContainer>
        <IconButton
          icon={<DeleteIcon />}
          aria-label={'Delete'}
          mr={2}
          colorScheme='red'
          onClick={() => handleDelete()}
        />
        <IconButton
          icon={<EditIcon />}
          aria-label={'Edit'}
          onClick={onOpen}
          color='white'
          backgroundColor='#3f3d56'
          _hover={{
            backgroundColor: '#5a5779',
          }}
        />
      </ButtonContainer>
      <TodoModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        task={{ id, title, status }}
      />
    </Container>
  );
}
