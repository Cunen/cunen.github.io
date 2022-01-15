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
import { Route, Switch } from 'react-router-dom';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { getAuth } from 'firebase/auth';


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
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [accountAnchor, setAccountAnchor] = React.useState();
  const [importOpen, setImportOpen] = React.useState(false);

  const toggleMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const toggleAccount = (e) => setAccountAnchor(e.currentTarget);
  const closeAccount = () => setAccountAnchor(null);

  const logout = () => {
    setAccountAnchor(null);
    const auth = getAuth();
    auth.signOut();
    setUser(undefined);
    localStorage.removeItem('cunen-is-tracking-you');
  }

  const openImport = () => {
    setAccountAnchor(null);
    setImportOpen(true);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu id="menu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
            <MenuItem onClick={closeMenu}>Active Days</MenuItem>
          </Menu>
          <Typography sx={{ flexGrow: 1 }}>Activity Visualizer</Typography>
          {user && <>
            <IconButton onClick={toggleAccount}>
              <AccountCircleIcon />
            </IconButton>
            <Menu id="account" anchorEl={accountAnchor} open={Boolean(accountAnchor)} onClose={closeAccount}>
              <MenuItem onClick={logout}>Logout</MenuItem>
              <MenuItem onClick={openImport}>Import</MenuItem>
            </Menu>
          </>}
        </Toolbar>

        <Wrapper>
          {!user && <Login setUser={setUser} />}
          {user &&
          <Switch>
            <Route path="/">
              <Stats db={db} user={user} importOpen={importOpen} setImportOpen={setImportOpen} />
            </Route>
          </Switch>}
        </Wrapper>
      </AppBar>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 64px);
  display: flex;
  background-color: #000;
  color: white;
`;

export default App;
