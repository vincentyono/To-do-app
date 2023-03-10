import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  timestamp: string;
  status: boolean;
}

export enum Filter {
  ALL = 'All',
  INCOMPLETE = 'Incomplete',
  COMPLETED = 'Completed',
}

const getInitialValue = (): Task[] => {
  const localTodoApp = window.localStorage.getItem('todoApp');

  if (localTodoApp) return JSON.parse(localTodoApp);

  window.localStorage.setItem('todoApp', JSON.stringify([]));
  return [];
};

const initialState = {
  value: getInitialValue(),
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
