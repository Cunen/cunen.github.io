import { ContentCopy } from "@mui/icons-material";
import { Button, Chip, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";

export const profileIsAuthorized = (firebaseUser) => {
  return (
    firebaseUser &&
    !!firebaseUser.authExpires &&
    !!firebaseUser.authToken &&
    !!firebaseUser.refreshToken
  );
};

function Profile({ db, user, firebaseUser }) {
  const [clientID, setClientID] = React.useState("");
  const [clientSecret, setClientSecret] = React.useState("");

  const handleClientIDChange = (e) => {
    setClientID(e.target.value.trim());
  };

  const handleClientSecretChange = (e) => {
    setClientSecret(e.target.value.trim());
  };

  const authorize = async () => {
    const { origin } = window.location;

    if (!clientID || isNaN(clientID) || !clientSecret) {
      console.warn("Incorrect ClientId or clientSecret");
      return;
    }

    const updatedUser = { ...firebaseUser };
    updatedUser.clientID = clientID;
    updatedUser.clientSecret = clientSecret;
    await setDoc(doc(db, `user-${firebaseUser.id}`, "user"), updatedUser);

    window.location.href = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${origin}/exchange_token&approval_prompt=force&scope=activity:read_all`;
  };

  const copyAccess = () => {
    const url = [
      window.location.protocol + "/",
      window.location.host,
      "#/guest",
      user.uid,
    ];
    navigator.clipboard.writeText(url.join("/"));
  };

  useEffect(() => {
    if (firebaseUser) {
      console.log(firebaseUser);
      setClientSecret(firebaseUser.clientSecret);
      setClientID(firebaseUser.clientID);
    }
  }, [firebaseUser]);

  return (
    <Wrapper>
      <Strava>
        <Typography variant="h4">Basic Information</Typography>
        <Button variant="contained" onClick={copyAccess}>
          <ContentCopy />
          Copy Guest Access
        </Button>

        <Typography variant="h4">Strava API Information</Typography>
        <Chip
          label={
            profileIsAuthorized(firebaseUser) ? "Connected" : "Unauthorized"
          }
          color={profileIsAuthorized(firebaseUser) ? "success" : "error"}
        />
        <TextField
          label="Client ID"
          fullWidth
          value={clientID}
          onChange={handleClientIDChange}
        />
        <TextField
          label="Client secret"
          fullWidth
          value={clientSecret}
          onChange={handleClientSecretChange}
        />
        <Button onClick={authorize}>
          {profileIsAuthorized(firebaseUser) ? "Re-authorize" : "Authorize"}
        </Button>
        <Typography>
          Disclaimer: This shit is not stored in db, it's handled in
          localStorage on your machine so obviously it comes with limitations
        </Typography>
      </Strava>
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

const Strava = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
  width: 400px;
`;

export default Profile;
