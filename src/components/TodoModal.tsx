import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import short from 'short-uuid';
import { addTask, Task, updateTask } from '../features/todoSlice';

interface TodoModalProps {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  Task: Task | null;
}

export default function TodoModal({ isOpen, onClose, Task }: TodoModalProps) {
  const [title, setTitle] = useState(Task?.title ? Task.title : '');
  const [status, setStatus] = useState(Task?.status ? Task.status : false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    setTitle(Task?.title ? Task.title : '');
    setStatus(Task?.status ? Task.status : false);
  }, [isOpen, Task]);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (title === '') {
      setIsError(true);
      return;
    }

    if (!Task) {
      dispatch(
        addTask({
          id: short.generate(),
          title,
          status: Boolean(status),
          timestamp: new Date().toLocaleString('en-US'),
        })
      );

      toast({
        title: 'Successfully created',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
        position: 'bottom-right',
        duration: 1000,
      });
    } else {
      dispatch(
        updateTask({
          id: Task.id,
          title,
          status: Boolean(status),
          timestamp: Task.timestamp,
        })
      );

      toast({
        title: 'Successfully updated',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
        position: 'bottom-right',
        duration: 1000,
      });
    }
    setTitle('');
    setStatus(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{Task ? 'Update Task' : 'Add Task'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl marginBottom='1em' isInvalid={isError} isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder='Enter Title...'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {isError && (
              <FormHelperText color='tomato' fontWeight='600'>
                Title cannot be empty
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              defaultValue={status.toString()}
              onChange={(e) => {
                setStatus(e.currentTarget.value === 'true');
              }}
            >
              <option value='false'>Incomplete</option>
              <option value='true'>Completed</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            type='submit'
            mr={3}
            onClick={handleSubmit}
            colorScheme='blue'
            backgroundColor='blue.700'
          >
            {Task ? 'Update Task' : 'Add Task'}
          </Button>
          <Button
            colorScheme='red'
            onClick={() => {
              setIsError(false);
              setTitle('');
              setStatus(false);
              onClose();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
