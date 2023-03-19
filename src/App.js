import "./App.css";
import React from "react";
import Stats from "./components/Stats";
import styled from "styled-components";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Login from "./components/Login";
import { NavLink, Route, Switch } from "react-router-dom";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { getAuth } from "firebase/auth";

import Import, {
  epochFromDate,
  renewStravaAuth,
  runStravaImport,
  stravaAuthExpired,
  stravaAuthOk,
} from "./components/Import";
import AuthCodePage from "./components/AuthCodePage";
import Profile, { profileIsAuthorized } from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Recap from "./components/Recap";
import Map from "./components/Map";
import Guest, { GuestDialog } from "./components/Guest";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const firebase = initializeApp({
  apiKey: "AIzaSyDuLhFU-X9QUqlx0Cw1sn92eAtB7pSOSk0",
  authDomain: "housework-a9d38.firebaseapp.com",
  databaseURL: "https://housework-a9d38.firebaseio.com",
  projectId: "housework-a9d38",
  storageBucket: "housework-a9d38.appspot.com",
  messagingSenderId: "475852222396",
  appId: "1:475852222396:web:9fa6485a42ba1284e985b9",
  measurementId: "G-ZVBWH6CY7R",
});

export const auth = getAuth();

const db = getFirestore(firebase);

const getCodeFromWindowSearch = () => {
  const search = window.location.search;
  const replaced = search.replace("?", "");
  const split = replaced.split("&");
  const obj = {};
  split.forEach((s) => {
    const equalSplit = s.split("=");
    obj[equalSplit[0]] = equalSplit[1];
  });
  return obj.code;
};

function App() {
  // Get tracked lol
  const tracker = localStorage.getItem("cunen-is-tracking-you");

  const [user, setUser] = React.useState(
    tracker ? JSON.parse(tracker) : auth.currentUser
  );

  const [firebaseUser, setFirebaseUser] = React.useState();

  const [guest, setGuest] = React.useState(null);

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [accountAnchor, setAccountAnchor] = React.useState();
  const [activities, setActivities] = React.useState([]);
  const [yearActivities, setYearActivities] = React.useState([]);
  const [year, setYear] = React.useState(new Date().getFullYear());

  const toggleMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const toggleAccount = (e) => setAccountAnchor(e.currentTarget);
  const closeAccount = () => setAccountAnchor(null);

  const logout = () => {
    setAccountAnchor(null);
    const auth = getAuth();
    auth.signOut();
    setUser(undefined);
    localStorage.removeItem("cunen-is-tracking-you");
  };

  const code = getCodeFromWindowSearch();

  // Load user activities when User changes
  React.useEffect(() => {
    if (!user && !guest) return;
    const currentUserCollection = "user-" + (guest || user.uid);
    const dbRef = collection(db, currentUserCollection);
    getDocs(dbRef).then((res) => {
      const data = {};
      res.docs.forEach((doc) => (data[doc.id] = doc.data()));
      if (data.activities && data.activities.list) {
        setActivities(data.activities.list);
      }
      if (data.user) {
        setFirebaseUser(data.user);
      }
    });
  }, [guest, user]);

  React.useState(() => {
    window.setTimeout(() => setUser(auth.currentUser), 2000);
  }, [auth]);

  React.useEffect(() => {
    if (!firebaseUser) return;
    // THIS IS AUTOIMPORT
    const authOk = stravaAuthOk(firebaseUser);
    const expired = stravaAuthExpired(firebaseUser);

    if (!authOk || !firebaseUser.lastImport) return;

    if (expired) {
      renewStravaAuth(db, firebaseUser, setFirebaseUser);
      return;
    }

    const secondsAgo =
      epochFromDate(new Date()) - firebaseUser.lastImport.seconds;

    if (secondsAgo > 3600) {
      const after = firebaseUser.lastImport.toDate();
      // Run the import from one day before last import for safety
      after.setDate(after.getDate() - 1);
      runStravaImport(db, firebaseUser, setFirebaseUser, after, null, false);
    }
  }, [firebaseUser]);

  // Get activities for selected year
  React.useEffect(() => {
    setYearActivities(
      activities.filter((a) => {
        const date = a.date.toDate();
        return date.getFullYear() === year;
      })
    );
  }, [activities, year]);

  if (code && firebaseUser) {
    return <AuthCodePage db={db} code={code} firebaseUser={firebaseUser} />;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="fixed">
        <Toolbar style={{ minHeight: "64px" }}>
          <IconButton onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
          >
            <MenuItem onClick={closeMenu}>
              <NavButton to="/">Dashboard</NavButton>
            </MenuItem>
            <MenuItem onClick={closeMenu}>
              <NavButton to="/recap">Recap</NavButton>
            </MenuItem>
            <MenuItem onClick={closeMenu}>
              <NavButton to="/days">Active Days</NavButton>
            </MenuItem>
            <MenuItem onClick={closeMenu}>
              <NavButton to="/map">Map</NavButton>
            </MenuItem>
            <MenuItem
              onClick={closeMenu}
              disabled={!profileIsAuthorized(firebaseUser)}
            >
              <NavButton to="/import">Import</NavButton>
            </MenuItem>
          </Menu>
          <Typography sx={{ flexGrow: 1 }}>Activity Visualizer</Typography>
          <Select
            size="small"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2019}>2019</MenuItem>
            <MenuItem value={2018}>2018</MenuItem>
          </Select>
          {user && (
            <>
              <IconButton onClick={toggleAccount}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="account"
                anchorEl={accountAnchor}
                open={Boolean(accountAnchor)}
                onClose={closeAccount}
              >
                <MenuItem>
                  <NavButton to="/profile">Profile</NavButton>
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
        <GuestDialog guest={guest} setGuest={setGuest} />
        <Wrapper>
          {!user && !guest && (
            <Switch>
              <Route path="/guest/:id">
                <Guest guest={guest} setGuest={setGuest} />
              </Route>
              <Route exact path="/">
                <Login setUser={setUser} />
              </Route>
            </Switch>
          )}

          {guest && (
            <Switch>
              <Route exact path="/guest/:id">
                <Guest guest={guest} setGuest={setGuest} />
              </Route>
              <Route path="/days">
                <Stats db={db} user={guest} year={year} />
              </Route>
              <Route path="/recap">
                <Recap activities={yearActivities} year={year} />
              </Route>
              <Route path="/map">
                <Map activities={activities} />
              </Route>
              <Route path="/">
                <Dashboard activities={yearActivities} year={year} />
              </Route>
            </Switch>
          )}

          {!guest && user && (
            <Switch>
              <Route exact path="/guest/:id">
                <Guest guest={guest} setGuest={setGuest} />
              </Route>
              <Route exact path="/profile">
                <Profile db={db} user={user} firebaseUser={firebaseUser} />
              </Route>
              <Route exact path="/import">
                <Import
                  db={db}
                  firebaseUser={firebaseUser}
                  setFirebaseUser={setFirebaseUser}
                />
              </Route>
              <Route path="/days">
                <Stats db={db} user={user.uid} year={year} />
              </Route>
              <Route path="/recap">
                <Recap activities={yearActivities} year={year} />
              </Route>
              <Route path="/map">
                <Map activities={activities} />
              </Route>
              <Route path="/">
                <Dashboard activities={yearActivities} year={year} />
              </Route>
            </Switch>
          )}
        </Wrapper>
      </AppBar>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: calc(100vh - 64px);
  background-color: #000;
  color: white;
`;

const NavButton = styled(NavLink)`
  text-decoration: none;
  color: white;
  width: 100%;
  height: 100%;
`;

export default App;
