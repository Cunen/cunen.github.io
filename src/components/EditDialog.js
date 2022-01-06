import React from 'react';
import styled from 'styled-components';
import { Container, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, InputAdornment, Slider, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TypeIcon from './TypeIcon';
import fiLocale from 'date-fns/locale/fi';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function EditDialog({ activity, activities, setActivities, close, db, userCollection }) {
	const [type, setType] = React.useState('Walk');
	const [distance, setDistance] = React.useState(0);
	const [duration, setDuration] = React.useState(0);
	const [calories, setCalories] = React.useState(0);
	const [startTime, setStartTime] = React.useState(new Date());
	const [simple, setSimple] = React.useState(true);

	React.useEffect(() => {
		if (activity) {
			setDistance(activity.distance);
			setDuration(activity.duration);
			setCalories(activity.calories);
			setStartTime(activity.startTime?.toDate());
			setType(activity.type);
		} else {
			setDistance(0);
			setDuration(0);
			setCalories(0);
			setStartTime(new Date());
			setType('Walk');
		}
	}, [activity]);

	const handleTypeChange = (e, value) => {
		setType(value);
	};

	const handleDistanceChange = (e) => {
		setDistance(e.target.value);
	}

	const handleSimpleDistanceChange = (e, value) => {
		setDistance(value * 1000);
	}

	const handleDurationChange = (e) => {
		setDuration(e.target.value);
	}

	const handleSimpleDurationChange = (e, value) => {
		setDuration(value * 60);
	}

	const handleCaloriesChange = (e) => {
		setCalories(e.target.value);
	}
	
	const handleTimeChange = (e) => {
		setStartTime(e);
	}

	const saveAndClose = async () => {
		const data = {};

		if (!isNaN(calories)) data.calories = parseInt(calories);
		if (!isNaN(duration)) data.duration = parseInt(duration);
		if (!isNaN(distance)) data.distance = parseInt(distance);
		if (startTime instanceof Date) data.startTime = startTime;

		data.type = type;

		let activityDoc = doc(db, userCollection, activity.id);
		await updateDoc(activityDoc, data);
		activityDoc = await getDoc(activityDoc);
		
		const clonedActivities = [...activities];
		const activityIndex = clonedActivities.findIndex(a => a.id === activity.id);
		if (activityIndex !== -1) {
			clonedActivities[activityIndex] = { ...activityDoc.data(), id: activity.id };
		}
		setActivities(clonedActivities);
		close();
	}

	return <Dialog open={!!activity} onClose={saveAndClose}>
		<DialogTitle style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
			Edit
			<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={simple}
								onChange={() => setSimple(!simple)}
								inputProps={{ 'aria-label': 'controlled' }} />
						}
						label="Simple Inputs" />
				</FormGroup>
		</DialogTitle>
		<DialogContent>
			<Container style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
				<Typography>Activity Type</Typography>
				<ToggleButtonGroup color="primary" value={type} exclusive onChange={handleTypeChange}>
					<ToggleButton value="Walk"><TypeIcon type="Walk" /></ToggleButton>
					<ToggleButton value="Run"><TypeIcon type="Run" /></ToggleButton>
					<ToggleButton value="Gym"><TypeIcon type="Gym" /></ToggleButton>
					<ToggleButton value="Cycle"><TypeIcon type="Cycle" /></ToggleButton>
				</ToggleButtonGroup>

				<InputWrapper>
					<LocalizationProvider dateAdapter={AdapterDateFns} locale={fiLocale}>
						<TimePicker
							fullWidth
							label="Time"
							value={startTime}
							onChange={handleTimeChange}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
					{type !== 'Gym' && <>
						{simple && <Typography>Distance ({distance / 1000} km)</Typography>}
						{simple 
							? <Slider value={distance / 1000} step={0.1} min={0} max={20} aria-label="Default" valueLabelDisplay="auto" onChange={handleSimpleDistanceChange} />
							: <TextField
								fullWidth
								label="Distance"
								variant="outlined"
								value={distance}
								onChange={handleDistanceChange}
								InputProps={{
									endAdornment: <InputAdornment position="end">m</InputAdornment>,
								}} />
						}
					</>}

					{simple && <Typography>Duration ({duration / 60} min)</Typography>}
					{simple 
						? <Slider value={duration / 60} min={0} max={300} aria-label="Default" valueLabelDisplay="auto" onChange={handleSimpleDurationChange} />
						: <TextField
							fullWidth
							label="Duration"
							value={duration}
							onChange={handleDurationChange}
							InputProps={{
								endAdornment: <InputAdornment position="end">s</InputAdornment>,
							}} />
					}

					{simple && <Typography>Calories ({calories} kcal)</Typography>}
					{simple 
						? <Slider value={calories} step={16} min={0} max={1000} aria-label="Default" valueLabelDisplay="auto" onChange={handleCaloriesChange} />
						: <TextField
						fullWidth
						label="Calories"
						value={calories}
						onChange={handleCaloriesChange}
						InputProps={{
							endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
						}} />
					}
				</InputWrapper>
			</Container>
		</DialogContent>
	</Dialog>
}

const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	min-width: 400px;
	min-height: 314px;
`;

export default EditDialog;