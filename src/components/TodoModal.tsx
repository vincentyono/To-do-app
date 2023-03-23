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
import { addTask, TaskDocument, updateTask } from '../features/todoSlice';
import { AppDispatch, RootState } from '../app/store';
import { auth } from '../firebase';

interface TodoModalProps {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  task: TaskDocument | null;
}

export default function TodoModal({ isOpen, onClose, task }: TodoModalProps) {
  const [title, setTitle] = useState(task?.title ? task.title : '');
  const [status, setStatus] = useState(task?.status ? task.status : false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.todo);

  useEffect(() => {
    setTitle(task?.title ? task.title : '');
    setStatus(task?.status ? task.status : false);
  }, [isOpen, task]);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (title === '') {
      setIsError(true);
      return;
    }

    // Add task
    if (!task) {
      dispatch(
        addTask({
          user_id: auth.currentUser?.uid as string,
          title,
          status: Boolean(status),
          timestamp: new Date().getTime(),
        })
      );
      // Update Task
    } else {
      dispatch(
        updateTask({
          id: task.id,
          title,
          status,
        })
      );
    }
    setTitle('');
    setStatus(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task ? 'Update Task' : 'Add Task'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl marginBottom='1em' isInvalid={isError} isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder='Enter Title...'
              value={title}
              focusBorderColor='#3F3D56'
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
              focusBorderColor='#3F3D56'
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
            color='white'
            backgroundColor='#3F3D56'
            _hover={{
              backgroundColor: '#5a5779',
            }}
          >
            {task ? 'Update Task' : 'Add Task'}
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
