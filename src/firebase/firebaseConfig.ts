import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDU4TpKa2Q7YoGe8Epf06zZgN60heeCBvI',
  authDomain: 'cospark-71d2e.firebaseapp.com',
  projectId: 'cospark-71d2e',
  storageBucket: 'cospark-71d2e.appspot.com',
  messagingSenderId: '332973014967',
  appId: 'YOUR_APP_ID',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { auth };