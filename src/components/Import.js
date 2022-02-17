import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Button, Chip, TextField, Typography } from '@mui/material';
import axios from 'axios';
import fiLocale from 'date-fns/locale/fi';
import { doc, setDoc } from 'firebase/firestore';
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

function Import({ db, user }) {
	const [importInfo, setImportInfo] = React.useState(window.localStorage.getItem(lsCode) ? JSON.parse(window.localStorage.getItem(lsCode)) : defaultInfo);
	const [before, setBefore] = React.useState(null);
	const [after, setAfter] = React.useState(window.localStorage.getItem('cunen-last-import-date') ? new Date(window.localStorage.getItem('cunen-last-import-date')) : null);
	const [importStatus, setImportStatus] = React.useState();
	const [progress, setProgress] = React.useState(0);
	const [userCollection] = React.useState('activities-' + user.uid);

	const goToMain = () => {
		window.location.href = window.location.origin;
	}

	const convertStravaType = (type) => {
		switch (type) {
			case 'Ride':
				return 'Cycle';
			case 'Run':
				return 'Run'
			case 'WeightTraining':
			case 'Workout':
				return 'Gym';
			case 'Walk':
				return 'Walk';
			case 'Kayaking':
				return 'Kayak';
			case 'Hike':
				return 'Hike';
			default:
				return 'Other'
		}
	}

	const getCaloriesByType = (type, duration, distance) => {
		if (!duration && !distance) return 0;
		switch (type) {
			case 'Ride':
				return Math.floor(30 * (distance / 1000));
			case 'Walk':
			case 'Hike':
				return Math.floor(60 * (distance / 1000));
			case 'Run':
				return Math.floor(75 * (distance / 1000));
			case 'Gym':
			default:
				return Math.floor(366 * ((duration / 60) / 60));
		}
	}

	const dateFromEpoch = (epoch) => {
		if (!epoch) return new Date();
		return new Date(epoch * 1000);
	}

	const epochFromDate = (date) => {
		if (!date) return 0;
		return Math.floor(date.getTime() / 1000);
	}

	const isExpired = () => {
		if (!importInfo.expires) return true;
		const date = dateFromEpoch(importInfo.expires);
		return date <= new Date();
	}

	const authOk = () => {
		if (!importInfo.authToken || !importInfo.refreshToken || !importInfo.clientID || !importInfo.clientSecret) {
			goToMain();
			return false;
		}
		return !isExpired();
	}

	const handleBeforeChange = (e) => {
		setBefore(e);
	}

	const handleAfterChange = (e) => {
		setAfter(e);
	}

	const handleTokenRefresh = async () => {
		const { clientID, clientSecret, refreshToken } = importInfo;
		if (!clientID || !clientSecret || !refreshToken) return;
		try {
			const postResults = await axios.post('https://www.strava.com/oauth/token', {
				client_id: parseInt(clientID),
				client_secret: clientSecret,
				refresh_token: refreshToken,
				grant_type: 'refresh_token'
			});
			if (postResults?.data?.access_token) {
				const clonedInfo = { ...importInfo };
				clonedInfo.authToken = postResults.data.access_token;
				clonedInfo.refreshToken = postResults.data.refresh_token;
				clonedInfo.expires = postResults.data.expires_at;
				setImportInfo(clonedInfo);
				window.localStorage.setItem(lsCode, JSON.stringify(clonedInfo));
			} else {
				goToMain();
			}
		} catch(err) {
			console.error('Refresh Token Error', err);
			goToMain();
		}
	}

	const runStravaImport = async () => {
		if (!authOk()) return;
		const beforeEpoc = before ? `&before=${epochFromDate(before)}` : '';
		const afterEpoc = after ? `&after=${epochFromDate(after)}` : '';
		try {
			let page = 1;
			let rows = 200;
			const results = [];
			setImportStatus('fetching-data');

			while (rows === 200) {
				const imported = await axios.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${importInfo.authToken}&per_page=200&page=${page}${beforeEpoc}${afterEpoc}`);
				if (imported.data) {
					results.push(...imported.data);
				}
				rows = imported.data?.length;
				page++;
			}
	
			setImportStatus('Converting Data');
			const activities = results.map(r => {
				const type = convertStravaType(r.type);
				const duration = r.elapsed_time;
				const distance = r.distance;
				const calories = getCaloriesByType(type, duration, distance);
				return {
					type,
					calories,
					id: 'strava-' + r.id,
					startTime: new Date(r.start_date),
					date: new Date(r.start_date),
					duration,
					distance,
				};
			});
	
			setImportStatus('Importing to Firebase');
			setProgress(0);
			for (const a in activities) {
				const activity = activities[a];
				setProgress(a / activities.length);
				await setDoc(doc(db, userCollection, activity.id), activity);
			}
			setProgress(1);
			setImportStatus();

			const newDate = new Date();
			newDate.setDate(newDate.getDate() - 1);
			window.localStorage.setItem('cunen-last-import-date', newDate.toISOString());

			window.location.href = window.location.origin;
		} catch (err) {
			console.error('Import error', err);
		}
	}

	const resetAuth = () => {
		setImportInfo(defaultInfo);
		window.localStorage.setItem(lsCode, JSON.stringify(defaultInfo));
		goToMain();
	}

	return <Wrapper>
		<Container>
			<Chip label={isExpired() ? 'Authentication expired' : 'Authenticated'} color={isExpired() ? 'error' : 'success'} />
			{authOk()
				? <>
						<LocalizationProvider dateAdapter={AdapterDateFns} locale={fiLocale}>
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
							{!importStatus && <Button onClick={runStravaImport} variant="contained">Import</Button>}
							{importStatus && <Loader>
								<LoaderText>
									<Typography>{(progress * 100).toFixed(1)}</Typography>
								</LoaderText>
								<Bar progress={progress * 100} />
							</Loader>}
						</LocalizationProvider>
				</>
				: <>
					<Button variant="contained" onClick={handleTokenRefresh}>Refresh Token</Button>
					<Button variant="contained" onClick={resetAuth}>Reset Authentication</Button>
				</>}
		</Container>
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

const Container = styled.div`
	gap: 16px;
	display: flex;
	flex-direction: column;
	width: 400px;
`;

const Loader = styled.div`
	position: relative;
	display: flex;
	border-radius: 4px;
	max-height: 40px;
	min-height: 40px;
	flex: 1;
	background-color: #262626;
`;

const LoaderText = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Bar = styled.div`
	display: flex;
	flex: 1;
	border-radius: 4px;
	max-width: ${props => props.progress}%;
	background-color: #90caf9;
`;

export default Import;