import React from 'react';
import './App.scss';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Jobs from './components/jobs/Jobs';
import { IconContext } from 'react-icons';
import { FaSignInAlt } from 'react-icons/fa';
import Icon from './components/icon/Icon';
import Tasks from './components/tasks/Tasks';

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
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
		firestore.collection('users').onSnapshot(snapshot => {
			const items = snapshot.docs.map(doc => {
				return {
					id: doc.id,
					...doc.data(),
				}
			});
			setUsers(items);
		});
	}, []);

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(authUser => {
      const user = authUser.user;
      if (users.find(u => u.email === user.email)) return;
      firestore.collection('users').add({
        name: user.displayName,
        email: user.email,
        imageUrl: user.photoURL,
      });
    });
  }
  return <button className="loginButton" onClick={signInWithGoogle}>
    <IconContext.Provider value={{ style: {fontSize: '150px', color: "#ff7f34"}}}>
      <div>
        <FaSignInAlt />
      </div>
    </IconContext.Provider>
    Log in
  </button>;
}

function SignOut() {
  const signOutFromGoogle = () => auth.signOut();
  return <button className="signOutButton" onClick={signOutFromGoogle}>
    <IconContext.Provider value={{ style: {fontSize: '50px', color: "#ff7f34"}}}>
      <div>
        <FaSignInAlt />
      </div>
    </IconContext.Provider>
    Log out
  </button>;
}

function NavMenu({ selectedView, setSelectedView }) {
  const [open, setOpen] = React.useState(false);

  const getClassName = view => {
    if (selectedView === view) return 'selected';
    return '';
  }

  return <div className="clickableMenu" onClick={() => setOpen(!open)}>
    <Icon icon="Menu" color="white" />
    {open &&
      <div className="navMenu">
        <button className={getClassName('jobs')} onClick={() => setSelectedView('jobs')}>Jobs</button>
        <button className={getClassName('tasks')}  onClick={() => setSelectedView('tasks')}>Tasks</button>
      </div>
    }
  </div>;
}

function UserInfo({ user }) {
  const [logoutVisible, setLogoutVisible] = React.useState(false);

  if (!user) return null;
  return <>
    <img
      className="userImage"
      src={user.photoURL}
      alt={user.displayName}
      onClick={() => setLogoutVisible(!logoutVisible)} />
    Welcome {user.displayName}
    {logoutVisible && <SignOut />}
  </>;
}

function App() {
  const [user] = useAuthState(auth);
  const savedView = localStorage.getItem('selectedView');
  const [selectedView, setSelectedView] = React.useState(savedView || 'jobs');

  const handleSetSelectedView = (view) => {
    setSelectedView(view);
    localStorage.setItem('selectedView', view);
  };

  return (
    <div className='App'>
      <div className="header">
        <div className="headerMenu">
          <NavMenu selectedView={selectedView} setSelectedView={handleSetSelectedView} />
        </div>
        <div className="headerInfo">
          <UserInfo user={user} />
        </div>
      </div>
      {user && selectedView === 'jobs' && <Jobs firestore={firestore} user={user} />}
      {user && selectedView === 'tasks' && <Tasks firestore={firestore} user={user} />}
      {!user && <SignIn />}
    </div>
  );
}

export default App;
