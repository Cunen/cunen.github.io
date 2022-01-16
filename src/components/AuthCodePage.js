import axios from 'axios';
import React from 'react';
import styled from 'styled-components';
import { lsCode } from './Import';



function AuthCodePage({ code }) {
	const goToImport = () => window.location.href = window.location.origin + '/#/profile';

	const getAccessToken = async () => {
		const storedInfo = window.localStorage.getItem(lsCode);
		if (!storedInfo) return goToImport();
		let parsedInfo = JSON.parse(storedInfo);
		const { clientID, clientSecret } = parsedInfo;
		if (!code || !clientID || !clientSecret) return goToImport();
		try {
			const postResults = await axios.post('https://www.strava.com/oauth/token', {
				client_id: parseInt(clientID),
				client_secret: clientSecret,
				code,
				grant_type: 'authorization_code'
			});
			if (postResults?.data?.access_token) {
				parsedInfo.authToken = postResults.data.access_token;
				parsedInfo.refreshToken = postResults.data.refresh_token;
				parsedInfo.expires = postResults.data.expires_at;
				window.localStorage.setItem(lsCode, JSON.stringify(parsedInfo));
			}
			window.location.href = goToImport();
		} catch (err) {
			console.error('Code Conversion To Access Token', err);
			return window.location.href = goToImport();
		}
	}

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