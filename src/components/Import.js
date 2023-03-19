import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Button, Chip, TextField } from "@mui/material";
import axios from "axios";
import fiLocale from "date-fns/locale/fi";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect } from "react";
import styled from "styled-components";

export const dateFromEpoch = (epoch) =>
  !epoch ? new Date() : new Date(epoch * 1000);
export const epochFromDate = (date) =>
  !date ? 0 : Math.floor(date.getTime() / 1000);

export const convertStravaType = (type) => {
  switch (type) {
    case "Ride":
      return "Cycle";
    case "Run":
      return "Run";
    case "WeightTraining":
      return "Gym";
    case "Walk":
      return "Walk";
    case "Kayaking":
      return "Kayak";
    case "Hike":
      return "Hike";
    case "Workout":
      return "Workout";
    default:
      return "Other";
  }
};

export const getCaloriesByType = (type, duration, distance) => {
  if (!duration && !distance) return 0;
  switch (type) {
    case "Ride":
      return Math.floor(30 * (distance / 1000));
    case "Walk":
    case "Hike":
      return Math.floor(60 * (distance / 1000));
    case "Run":
      return Math.floor(75 * (distance / 1000));
    case "Gym":
    default:
      return Math.floor(366 * (duration / 60 / 60));
  }
};

export const stravaAuthExpired = (firebaseUser) => {
  if (!firebaseUser || !firebaseUser.authExpires) return true;
  const date = dateFromEpoch(firebaseUser.authExpires);
  return date <= new Date();
};

export const renewStravaAuth = async (db, firebaseUser, setFirebaseUser) => {
  const { clientID, clientSecret, refreshToken } = firebaseUser;
  if (!clientID || !clientSecret || !refreshToken) return;
  try {
    const postResults = await axios.post("https://www.strava.com/oauth/token", {
      client_id: parseInt(clientID),
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });
    if (postResults?.data?.access_token) {
      // Success
      const updatedUser = { ...firebaseUser };
      updatedUser.authToken = postResults.data.access_token;
      updatedUser.refreshToken = postResults.data.refresh_token;
      updatedUser.authExpires = postResults.data.expires_at;
      setFirebaseUser(updatedUser);
      await setDoc(doc(db, `user-${firebaseUser.id}`, "user"), updatedUser);
    }
  } catch (err) {
    console.error("Refresh Token Error", err);
  }
};

export const stravaAuthOk = (firebaseUser) => {
  if (
    !firebaseUser ||
    !firebaseUser.authToken ||
    !firebaseUser.refreshToken ||
    !firebaseUser.clientID ||
    !firebaseUser.clientSecret
  ) {
    return false;
  }
  return !stravaAuthExpired(firebaseUser);
};

export const runStravaImport = async (
  db,
  firebaseUser,
  setFirebaseUser,
  after,
  before,
  redirect = true
) => {
  if (!stravaAuthOk(firebaseUser)) return;
  const beforeEpoc = before ? `&before=${epochFromDate(before)}` : "";
  const afterEpoc = after ? `&after=${epochFromDate(after)}` : "";
  try {
    let page = 1;
    let rows = 200;
    const results = [];

    while (rows === 200) {
      const imported = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities?access_token=${firebaseUser.authToken}&per_page=200&page=${page}${beforeEpoc}${afterEpoc}`
      );
      if (imported.data) {
        results.push(...imported.data);
      }
      rows = imported.data?.length;
      page++;
    }

    const activities = results.map((r) => {
      const type = convertStravaType(r.type);
      const duration = r.elapsed_time;
      const distance = r.distance;
      const calories = getCaloriesByType(type, duration, distance);
      const map = r.map ? r.map.summary_polyline : null;
      return {
        type,
        calories,
        id: "strava-" + r.id,
        startTime: new Date(r.start_date),
        date: new Date(r.start_date),
        duration,
        distance,
        encodedPolyline: map,
      };
    });

    const userCollection = "user-" + firebaseUser.id;
    const dbRef = collection(db, userCollection);
    const response = await getDocs(dbRef);
    const existingData = response.docs
      .find((r) => r.id === "activities")
      ?.data();
    const existingActivities = existingData ? existingData.list : [];

    // Clearly something wrong
    if (existingActivities.length <= 0) return;

    for (const a in activities) {
      const activity = activities[a];
      const foundIndex = existingActivities.findIndex(
        (ea) => ea.id === activity.id
      );
      if (foundIndex >= 0) existingActivities[foundIndex] = activity;
      else existingActivities.push(activity);
    }

    if (existingActivities.length >= activities.length) {
      await setDoc(doc(db, userCollection, "activities"), {
        list: existingActivities,
      });

      const updatedUser = { ...firebaseUser };
      updatedUser.lastImport = new Date();
      setFirebaseUser(updatedUser);
      await setDoc(doc(db, `user-${firebaseUser.id}`, "user"), updatedUser);
    }

    if (redirect) {
      window.location.href = window.location.origin;
    }
  } catch (err) {
    console.error("Import error", err);
  }
};

function Import({ db, firebaseUser, setFirebaseUser }) {
  const [before, setBefore] = React.useState(null);
  const [after, setAfter] = React.useState(null);

  const handleBeforeChange = setBefore;
  const handleAfterChange = setAfter;

  // const resetAuth = () => {
  //   setImportInfo(defaultInfo);
  //   window.localStorage.setItem(lsCode, JSON.stringify(defaultInfo));
  //   goToMain();
  // };

  useEffect(() => {
    if (firebaseUser && firebaseUser.lastImport) {
      setAfter(firebaseUser.lastImport.toDate());
    }
    if (!firebaseUser || !stravaAuthExpired(firebaseUser)) return;
    renewStravaAuth(db, firebaseUser, setFirebaseUser);
  }, [db, firebaseUser, setFirebaseUser]);

  return (
    <Wrapper>
      <Container>
        <Chip
          label={
            stravaAuthExpired(firebaseUser)
              ? "Authentication expired"
              : "Authenticated"
          }
          color={stravaAuthExpired(firebaseUser) ? "error" : "success"}
        />
        {stravaAuthOk(firebaseUser) ? (
          <>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={fiLocale}
            >
              <DesktopDatePicker
                label="After"
                inputFormat="dd.MM.yyyy"
                value={after}
                onChange={handleAfterChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DesktopDatePicker
                label="Before Date"
                inputFormat="dd.MM.yyyy"
                value={before}
                onChange={handleBeforeChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                onClick={() =>
                  runStravaImport(
                    db,
                    firebaseUser,
                    setFirebaseUser,
                    before,
                    after
                  )
                }
                variant="contained"
              >
                Import
              </Button>
              {/* {!importStatus && (
                <Button onClick={runStravaImport} variant="contained">
                  Import
                </Button>
              )}
              {importStatus && (
                <Loader>
                  <LoaderText>
                    <Typography>{(progress * 100).toFixed(1)}</Typography>
                  </LoaderText>
                  <Bar progress={progress * 100} />
                </Loader>
              )} */}
            </LocalizationProvider>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={() => renewStravaAuth(db, firebaseUser, setFirebaseUser)}
            >
              Refresh Token
            </Button>
            {/* <Button variant="contained" onClick={resetAuth}>
              Reset Authentication
            </Button> */}
          </>
        )}
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
  width: 400px;
`;

export default Import;
