import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface TaskDocument {
  id?: string;
  user_id?: string;
  title?: string;
  timestamp?: number;
  status?: boolean;
}
export interface Task {
  user_id: string;
  title: string;
  timestamp: number;
  status: boolean;
}

export enum Filter {
  ALL = 'All',
  INCOMPLETE = 'Incomplete',
  COMPLETED = 'Completed',
}

const initialState = {
  error: null as unknown | null,
  isLoading: false,
  allTasks: [] as TaskDocument[],
  filteredTasks: [] as TaskDocument[],
  filter: 'All' as Filter,
};

export const taskCollection = collection(db, 'todo-task');

export const addTask = createAsyncThunk(
  'addTask',
  async (task: Task, thunkApi) => {
    try {
      return await addDoc(taskCollection, { ...task });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkApi.rejectWithValue(error.message);
      }

      if (typeof error === 'string') {
        return thunkApi.rejectWithValue(error);
      }
    }
  }
);

export const updateTask = createAsyncThunk(
  'updateTask',
  async (newDocument: TaskDocument, thunkApi) => {
    try {
      const oldDocument = doc(db, `todo-task/${newDocument.id}`);
      await updateDoc(oldDocument, {
        title: newDocument.title,
        status: newDocument.status,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkApi.rejectWithValue(error.message);
      }

      if (typeof error === 'string') {
        return thunkApi.rejectWithValue(error);
      }
    }
  }
);
export const deleteTask = createAsyncThunk(
  'deleteTask',
  async (id: string, thunkApi) => {
    try {
      const document = doc(db, `todo-task/${id}`);
      return await deleteDoc(document);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkApi.rejectWithValue(error.message);
      }

      if (typeof error === 'string') {
        return thunkApi.rejectWithValue(error);
      }
    }
  }
);

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTask: (state, action: PayloadAction<TaskDocument[]>) => {
      state.allTasks = [...action.payload];
      if (state.filter === Filter.ALL) {
        state.filteredTasks = [...action.payload];
      } else if (state.filter === Filter.INCOMPLETE) {
        state.filteredTasks = action.payload.filter(
          (task) => task.status === false
        );
      } else if (state.filter === Filter.COMPLETED) {
        state.filteredTasks = action.payload.filter(
          (task) => task.status === true
        );
      }
    },

    filterTask: (state, action: PayloadAction<Filter>) => {
      if (action.payload == Filter.ALL) {
        state.filteredTasks = state.allTasks;
      } else if (action.payload == Filter.INCOMPLETE) {
        state.filteredTasks = state.allTasks.filter(
          (task) => task.status === false
        );
      } else {
        state.filteredTasks = state.allTasks.filter(
          (task) => task.status === true
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(addTask.pending, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(addTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as unknown;
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateTask.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteTask.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { filterTask, setTask } = todoSlice.actions;
export default todoSlice.reducer;
