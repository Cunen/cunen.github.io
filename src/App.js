import React from 'react';
import './App.scss';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Jobs from './components/jobs/Jobs';

firebase.initializeApp({
  apiKey: 'AIzaSyDuLhFU-X9QUqlx0Cw1sn92eAtB7pSOSk0',
  authDomain: 'housework-a9d38.firebaseapp.com',
  databaseURL: 'https://housework-a9d38.firebaseio.com',
  projectId: 'housework-a9d38',
  storageBucket: 'housework-a9d38.appspot.com',
  messagingSenderId: '475852222396',
  appId: '1:475852222396:web:9fa6485a42ba1284e985b9',
  measurementId: 'G-ZVBWH6CY7R'
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return <button onClick={signInWithGoogle}>Log in</button>;
}

function SignOut() {
  const signOutFromGoogle = () => auth.signOut();
  return <button onClick={signOutFromGoogle}>Log out</button>;
}

function UserInfo({ user }) {
  if (!user) return <SignIn />;
  return <>
    <img className="userImage" src={user.photoURL} alt={user.displayName} />
    Welcome {user.displayName}
  </>;
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <div className="header">
        <UserInfo user={user} />
      </div>
      {user && <Jobs firestore={firestore} user={user} />}
    </div>
  );
}

export default App;
