import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../firebase';

export interface UserData {
  email: string;
  password: string;
}

export const signUp = createAsyncThunk(
  'signUp',
  async (user: UserData, thunkApi) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      return await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
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

export const signInEmail = createAsyncThunk(
  'signin-email',
  async (user: UserData, thunkApi) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      return await signInWithEmailAndPassword(auth, user.email, user.password);
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

export const signInGoogle = createAsyncThunk(
  'signin-google',
  async (_, thunkApi) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      return await signInWithPopup(auth, googleAuthProvider);
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

export const signOut = createAsyncThunk('signout', async (_, thunkApi) => {
  try {
    return await auth.signOut();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return thunkApi.rejectWithValue(error.message);
    }

    if (typeof error === 'string') {
      return thunkApi.rejectWithValue(error);
    }
  }
});

export const resetPassword = createAsyncThunk(
  'resetPassword',
  async (email: string, thunkApi) => {
    try {
      return await sendPasswordResetEmail(auth, email);
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

const initialState = {
  isLoading: false,
  error: null as unknown | null,
  resetPasswordSent: false,
  uid: auth.currentUser?.uid as null | string | undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUID: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.uid = action.payload?.user.uid;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(signUp.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.error = action.payload as unknown;
      state.isLoading = false;
    });

    builder.addCase(signInEmail.fulfilled, (state, action) => {
      state.uid = action.payload?.user.uid;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(signInEmail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signInEmail.rejected, (state, action) => {
      state.error = action.payload as unknown;
      state.isLoading = false;
    });

    builder.addCase(signInGoogle.fulfilled, (state, action) => {
      state.uid = action.payload?.user.uid;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(signInGoogle.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signInGoogle.rejected, (state, action) => {
      state.error = action.payload as unknown;
      state.isLoading = false;
    });

    builder.addCase(signOut.fulfilled, (state, action) => {
      state.uid = null;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(signOut.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signOut.rejected, (state, action) => {
      state.error = action.payload as unknown;
      state.isLoading = false;
    });

    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.resetPasswordSent = true;
      state.error = null;
    });
    builder.addCase(resetPassword.pending, (state, action) => {
      state.resetPasswordSent = false;
      state.isLoading = true;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.resetPasswordSent = false;
      state.isLoading = false;
      state.error = action.payload as unknown;
    });
  },
});

export const { setUID } = authSlice.actions;
export default authSlice.reducer;
