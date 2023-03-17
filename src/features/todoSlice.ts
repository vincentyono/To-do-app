import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  Query,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  timestamp: string;
  status: boolean;
}

export enum Filter {
  ALL = 'All',
  INCOMPLETE = 'Incomplete',
  COMPLETED = 'Completed',
}

const initialState = {
  value: [] as Task[],
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.value.push(action.payload);
      const localTodoApp = window.localStorage.getItem('todoApp');

      if (localTodoApp) {
        const todoAppArr = JSON.parse(localTodoApp);
        todoAppArr.push({ ...action.payload });
        window.localStorage.setItem('todoApp', JSON.stringify(todoAppArr));
      } else {
        window.localStorage.setItem(
          'todoApp',
          JSON.stringify({ ...action.payload })
        );
      }
    },

    updateTask: (state, action: PayloadAction<Task>) => {
      const localTodoApp = window.localStorage.getItem('todoApp');
      if (localTodoApp) {
        const todoAppArr: Task[] = JSON.parse(localTodoApp);

        todoAppArr.forEach((task) => {
          if (task.id === action.payload.id) {
            task.title = action.payload.title;
            task.status = action.payload.status;
          }
        });

        window.localStorage.setItem('todoApp', JSON.stringify(todoAppArr));
        state.value = [...todoAppArr];
      }
    },

    deleteTask: (state, action: PayloadAction<Task>) => {
      const localTodoApp = window.localStorage.getItem('todoApp');
      if (localTodoApp) {
        const todoAppArr: Task[] = JSON.parse(localTodoApp);

        todoAppArr.forEach((task, index) => {
          if (task.id === action.payload.id) {
            todoAppArr.splice(index, 1);
          }
        });

        window.localStorage.setItem('todoApp', JSON.stringify(todoAppArr));
        state.value = [...todoAppArr];
      }
    },

    filterTask: (state, action: PayloadAction<Filter>) => {
      const localTodoApp = window.localStorage.getItem('todoApp');
      if (localTodoApp) {
        const todoAppArr: Task[] = JSON.parse(localTodoApp);

        if (action.payload == Filter.ALL) {
          state.value = [...todoAppArr];
        } else if (action.payload == Filter.INCOMPLETE) {
          state.value = todoAppArr.filter((task) => !task.status);
        } else {
          state.value = todoAppArr.filter((task) => task.status);
        }
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, filterTask } =
  todoSlice.actions;
export default todoSlice.reducer;
