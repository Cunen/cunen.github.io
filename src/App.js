import './App.css';
import React from 'react';
import Stats from './components/Stats';
import styled from 'styled-components';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Login from './components/Login';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const firebase = initializeApp({
  apiKey: 'AIzaSyDuLhFU-X9QUqlx0Cw1sn92eAtB7pSOSk0',
  authDomain: 'housework-a9d38.firebaseapp.com',
  databaseURL: 'https://housework-a9d38.firebaseio.com',
  projectId: 'housework-a9d38',
  storageBucket: 'housework-a9d38.appspot.com',
  messagingSenderId: '475852222396',
  appId: '1:475852222396:web:9fa6485a42ba1284e985b9',
  measurementId: 'G-ZVBWH6CY7R'
});

const db = getFirestore(firebase);

function App() {
  // Get tracked lol
  const tracker = localStorage.getItem('cunen-is-tracking-you');
  const [user, setUser] = React.useState(tracker ? JSON.parse(tracker) : undefined);

  console.log(window.location.search);


  return (
    <ThemeProvider theme={darkTheme}>
      <Wrapper>
        {!user && <Login setUser={setUser} />}
        {user &&
        <Switch>
          <Route exact path="/exchange_token">
            <Login setUser={setUser} />
          </Route>
          <Route path="/">
            <Stats db={db} setUser={setUser} user={user} />
          </Route>
        </Switch>}
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #000;
  color: white;
`;

export default App;
