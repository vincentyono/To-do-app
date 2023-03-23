import { onAuthStateChanged } from 'firebase/auth';
import { store } from '../app/store';
import { auth } from '../firebase';
import { setUID } from './authSlice';

onAuthStateChanged(auth, (user) => {
  store.dispatch(setUID(user?.uid as string));
});
