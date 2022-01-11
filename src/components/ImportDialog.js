import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import fiLocale from 'date-fns/locale/fi';
import { getCodeFromWindowSearch } from './Stats';

const storedcid = 'cunen-stole-your-client-id';
const storedsecret = 'cunen-stole-your-client-secret';

function ImportDialog({ db, dbRef, userCollection, open, close }) {
	const [clientID, setClientID] = React.useState(window.localStorage.getItem(storedcid));
	const [clientSecret, setClientSecret] = React.useState(window.localStorage.getItem(storedsecret));
	const [code] = React.useState(getCodeFromWindowSearch());
	const [accessToken, setAccessToken] = React.useState();
	const [importStatus, setImportStatus] = React.useState();
	const [progress, setProgress] = React.useState(0);
	const [before, setBefore] = React.useState(null);
	const [after, setAfter] = React.useState(null);

	const handleModalClose = () => {
		close(false);
	}

	const convertStravaType = (type) => {
		switch (type) {
			case 'Ride':
				return 'Cycle';
			case 'Run':
				return 'Run'
			case 'WeightTraining':
				return 'Gym';
			case 'Walk':
			default:
				return 'Walk'
		}
	}

	const getCaloriesByType = (type, duration, distance) => {
		switch (type) {
			case 'Ride':
				return Math.floor(30 * (distance / 1000));
			case 'Walk':
				return Math.floor(60 * (distance / 1000));
			case 'Run':
				return Math.floor(75 * (distance / 1000));
			case 'Gym':
				return Math.floor(366 * ((duration / 60) / 60));
			default:
		}
	}

	const runStravaImport = async () => {
		setImportStatus('Getting Access Token');
		const token = accessToken || await getAccessToken();
		if (!code || !token) {
			setImportStatus();
			return;
		}
		let page = 1;
		let rows = 200;
		const results = [];
		setImportStatus('fetching-data');

		const beforeEpoc = before ? `&before=${before.getTime()}` : '';
		const afterEpoc = after ? `&after=${after.getTime()}` : '';

		while (rows === 200) {
			const imported = await axios.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${token}&per_page=200&page=${page}${beforeEpoc}${afterEpoc}`);
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
		window.location.href = window.location.origin;
	}

	const getAccessToken = async () => {
		if (!code || !clientID || !clientSecret) return;
		const postResults = await axios.post('https://www.strava.com/oauth/token', {
			client_id: parseInt(clientID),
			client_secret: clientSecret,
			code,
			grant_type: 'authorization_code'
		});
		const at = postResults?.data?.access_token;
		if (at) setAccessToken(at);
		return at;
	}

	const authorize = () => {
		const { origin } = window.location;
		window.location.href = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${origin}&approval_prompt=force&scope=activity:read_all`;
	}

	const handleClientIDChange = (e) => {
		const { value } = e.target; 
		setClientID(value);
		window.localStorage.setItem(storedcid, value);
	}

	const handleClientSecretChange = (e) => {
		const { value } = e.target; 
		setClientSecret(value);
		window.localStorage.setItem(storedsecret, value);
	}

	const handleBeforeChange = (e) => {
		setBefore(e);
	}

	const handleAfterChange = (e) => {
		setAfter(e);
	}

	return <Dialog open={open} onClose={handleModalClose}>
		<DialogTitle>Strava Import</DialogTitle>
		<DialogContent>
			<Typography>Don't fuck with this if you don't know what you are doing</Typography>
			<Wrapper>
				{!code && <>
					<TextField label="Client ID" fullWidth value={clientID} onChange={handleClientIDChange} />
					<TextField label="Client secret" fullWidth value={clientSecret} onChange={handleClientSecretChange} />
					<Button onClick={authorize}>Authorize</Button>
				</>}
				{code &&
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
							<Bar progress={progress * 100}></Bar>
						</Loader>}
						<Button onClick={() => window.location.href = window.location.origin} variant="outlined">Reset</Button>
					</LocalizationProvider>
				}
			</Wrapper>
		</DialogContent>
	</Dialog>;
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 16px 0;
	color: white;
	width: 500px;
	height: 500px;
`;

const Loader = styled.div`
	position: relative;
	display: flex;
	border-radius: 4px;
	max-height: 40px;
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

export default ImportDialog;