import styled from 'styled-components';
import { Button, Select, useDisclosure } from '@chakra-ui/react';
import TodoModal from './TodoModal';
import { useDispatch } from 'react-redux';
import { filterTask } from '../features/todoSlice';
import { Filter } from '../features/todoSlice';

const Container = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Option = styled.option`
  color: #000;
`;

export default function MainHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(filterTask(e.currentTarget.value as Filter));
  };

  return (
    <Container>
      <Button
        bg='blue.700'
        color='blue.50'
        colorScheme='blue'
        paddingInline='2rem'
        onClick={onOpen}
      >
        Add Task
      </Button>
      <Select
        colorScheme='blue'
        variant='filled'
        bg='blue.700'
        color='blue.50'
        width='fit-content'
        fontWeight='600'
        _hover={{
          backgroundColor: 'blue.600',
        }}
        _focus={{
          boxShadow: 'none',
          backgroundColor: 'blue.700',
          borderColor: 'gray.200',
        }}
        onChange={handleSelect}
      >
        <Option value={Filter.ALL}>All</Option>
        <Option value={Filter.INCOMPLETE}>Incomplete</Option>
        <Option value={Filter.COMPLETED}>Completed</Option>
      </Select>
      <TodoModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        Task={null}
      />
    </Container>
  );
}
