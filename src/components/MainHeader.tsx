import styled from 'styled-components';
import { Button, Select, useDisclosure } from '@chakra-ui/react';
import TodoModal from './TodoModal';
import { useDispatch } from 'react-redux';
import { filterTask } from '../features/todoSlice';
import { Filter } from '../features/todoSlice';
import { AppDispatch } from '../app/store';

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  min-width: '100%';
`;

const Option = styled.option`
  color: #000;
`;

export default function MainHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(filterTask(e.currentTarget.value as Filter));
  };

  return (
    <Container>
      <Button
        bg='#3f3d56'
        color='white'
        _hover={{
          backgroundColor: '#3f3d56e0',
        }}
        paddingInline='2rem'
        onClick={onOpen}
      >
        Add Task
      </Button>
      <Select
        bg='#3f3d56'
        color='white'
        _hover={{
          backgroundColor: '#3f3d56e0',
        }}
        colorScheme='blue'
        variant='filled'
        width='fit-content'
        fontWeight='600'
        _focus={{
          boxShadow: 'none',
          backgroundColor: '#3f3d56',
          borderColor: 'gray.200',
        }}
        onChange={(e) => handleSelect(e)}
      >
        <Option value={Filter.ALL}>All</Option>
        <Option value={Filter.INCOMPLETE}>Incomplete</Option>
        <Option value={Filter.COMPLETED}>Completed</Option>
      </Select>
      <TodoModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        task={null}
      />
    </Container>
  );
}
