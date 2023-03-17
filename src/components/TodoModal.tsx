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
import { useDispatch, useSelector } from 'react-redux';
import { addTask, Task, updateTask } from '../features/todoSlice';
import { nanoid } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../app/store';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

interface TodoModalProps {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  Task: Task | null;
}

const handleSubmit = async () => {
  try {
    await addDoc(collection(db, 'todo'), {
      title: title,
      status: status,
      timestamp: new Date().toLocaleDateString('en-US'),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }
  }
};

export default function TodoModal({ isOpen, onClose, Task }: TodoModalProps) {
  const [title, setTitle] = useState(Task?.title ? Task.title : '');
  const [status, setStatus] = useState(Task?.status ? Task.status : false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { user } = useSelector((state: RootState) => state.auth);

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
          id: nanoid(11),
          user_id: user?.user.uid as string,
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
          user_id: user?.user.uid as string,
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
