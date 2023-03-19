import axios from "axios";
import React from "react";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";

function AuthCodePage({ db, code, firebaseUser }) {
  const goToImport = () =>
    (window.location.href = window.location.origin + "/#/profile");

  const getAccessToken = async () => {
    if (!firebaseUser) return goToImport();
    const { clientID, clientSecret } = firebaseUser;
    if (!code || !clientID || !clientSecret) return goToImport();
    try {
      const postResults = await axios.post(
        "https://www.strava.com/oauth/token",
        {
          client_id: parseInt(clientID),
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
        }
      );
      if (postResults?.data?.access_token) {
        // Success
        const updatedUser = { ...firebaseUser };
        updatedUser.authToken = postResults.data.access_token;
        updatedUser.refreshToken = postResults.data.refresh_token;
        updatedUser.authExpires = postResults.data.expires_at;
        await setDoc(doc(db, `user-${firebaseUser.id}`, "user"), updatedUser);
      }
      window.location.href = goToImport();
    } catch (err) {
      console.error("Code Conversion To Access Token", err);
      return (window.location.href = goToImport());
    }
  };

  React.useEffect(() => {
    getAccessToken();
  }, []);

  return <Wrapper>Loading...</Wrapper>;
}

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default AuthCodePage;
