import { Button, Chip, TextField, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

export const lsCode = 'cunenTrackerData';
const defaultInfo = {
	clientID: '',
	clientSecret: '',
	expires: null,
	authToken: '',
	refreshToken: '',
}

export const profileIsAuthorized = () => {
	const info = window.localStorage.getItem(lsCode) ? JSON.parse(window.localStorage.getItem(lsCode)) : defaultInfo
	return !!info.expires && !!info.authToken && !!info.refreshToken;
}

function Profile() {
	const [importInfo, setImportInfo] = React.useState(window.localStorage.getItem(lsCode) ? JSON.parse(window.localStorage.getItem(lsCode)) : defaultInfo);

	const isAuthorized = (e) => {
		return !!importInfo.expires && !!importInfo.authToken && !!importInfo.refreshToken;
	}

	const handleClientIDChange = (e) => {
		const clonedInfo = { ...importInfo };
		clonedInfo.clientID = e.target.value.trim();
		clonedInfo.expires = null;
		clonedInfo.authToken = '';
		clonedInfo.refreshToken = '';
		window.localStorage.setItem(lsCode, JSON.stringify(clonedInfo));
		setImportInfo(clonedInfo);
	}

	const handleClientSecretChange = (e) => {
		const clonedInfo = { ...importInfo };
		clonedInfo.clientSecret = e.target.value.trim();
		clonedInfo.expires = null;
		clonedInfo.authToken = '';
		clonedInfo.refreshToken = '';
		window.localStorage.setItem(lsCode, JSON.stringify(clonedInfo));
		setImportInfo(clonedInfo);
	}

	const authorize = () => {
		const { origin } = window.location;
		const { clientID } = importInfo;
		if (!clientID && isNaN(clientID)) {
			console.warn('Incorrect ClientID');
			return;
		}
		window.location.href = `http://www.strava.com/oauth/authorize?client_id=${importInfo.clientID}&response_type=code&redirect_uri=${origin}/exchange_token&approval_prompt=force&scope=activity:read_all`;
	}

	return <Wrapper>
		<Strava>
			<Typography variant="h4">Basic Information</Typography>
			<Typography>I have no idea who you are...</Typography>

			<Typography variant="h4">Strava API Information</Typography>
			<Chip label={isAuthorized() ? 'Connected' : 'Unauthorized'} color={isAuthorized() ? 'success' : 'error'} />
			<TextField label="Client ID" fullWidth value={importInfo.clientID} onChange={handleClientIDChange} />
			<TextField label="Client secret" fullWidth value={importInfo.clientSecret} onChange={handleClientSecretChange} />
			<Button onClick={authorize}>{isAuthorized() ? 'Re-authorize' : 'Authorize'}</Button>
			<Typography>Disclaimer: This shit is not stored in db, it's handled in localStorage on your machine so obviously it comes with limitations</Typography>
		</Strava>
	</Wrapper>;
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