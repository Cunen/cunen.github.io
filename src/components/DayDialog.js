import React from 'react';
import { addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import TypeIcon from './TypeIcon';
import { Avatar, Button, ButtonGroup, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography, ListItemButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { dayOrderFromDate, monthFromDate } from '../utils/dateUtils';
import EditDialog from './EditDialog';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HelpIcon from '@mui/icons-material/Help';

function DayDialog({ dbRef, db, selectedDate, setSelectedDate, activities, setActivities, userCollection }) {
	const [selectedActivity, setSelectedActivity] = React.useState();

	const handleModalClose = () => {
		setSelectedDate(undefined);
	}

	const getActivitiesForSelectedDate = () => {
		if (!selectedDate) return [];
		return activities.filter(act => {
			const activityDate = act.date.toDate();
			return activityDate.getDate() === selectedDate.getDate()
				&& activityDate.getMonth() === selectedDate.getMonth()
				&& activityDate.getFullYear() === selectedDate.getFullYear();
		});
	}

	const addActivity = async (type) => {
		if (!selectedDate) return;
		const activity = {
			calories: 300,
			date: selectedDate,
			startTime: new Date(),
			duration: 1800,
			distance: 3500,
			type: type || 'walk',
		};
		const addedDoc = await addDoc(dbRef, activity);
		const addedActivity = await getDoc(addedDoc);
		setActivities([{ ...addedActivity.data(), id: addedActivity.id }, ...activities]);
	}

	const deleteActivity = (id) => {
		deleteDoc(doc(db, userCollection, id));
		setActivities(activities.filter(a => a.id !== id));
	}

	const getSecondaryText = (activity) => {
		const { distance, duration, calories } = activity;
		const dis = (distance / 1000).toFixed(2);
		const dur = (duration / 60).toFixed(0);
		if (activity.type === 'Gym') return `${dur} min | ${calories} kcal`;
		return `${dis} km | ${dur} min | ${calories} kcal`;
	}

	const getPrimaryText = (activity) => {
		const { type, startTime } = activity;
		const startDate = startTime.toDate();
		const timeStamp = startDate.getHours() + ':' + startDate.getMinutes();
		return `${timeStamp} ${type}`;
	}

	const handleEditClose = () => {
		setSelectedActivity(undefined);
	}

	const handleDateChange = (change) => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + change);
		setSelectedDate(newDate);
	}


	const activitiesForDay = getActivitiesForSelectedDate();

	return <Dialog open={!!selectedDate} onClose={handleModalClose}>
		<DialogTitle style={{ padding: '16px' }}>
			<TitleContent>
				<IconButton onClick={() => handleDateChange(-1)}><ArrowLeftIcon /></IconButton>
				<DateTitle>{monthFromDate(selectedDate)} {dayOrderFromDate(selectedDate)}, {selectedDate?.getFullYear()}</DateTitle>
				<IconButton onClick={() => handleDateChange(1)}><ArrowRightIcon /></IconButton>
			</TitleContent>
		</DialogTitle>
		<DialogContent>
			<ListWrapper>
				<List component="nav">
					{activitiesForDay.map((activity, i) => {
						return <ListItem secondaryAction={
							<IconButton edge="end" aria-label="delete" onClick={() => deleteActivity(activity.id)}>
								<DeleteIcon />
							</IconButton>
						}
						key={'activity' + i}>
							<ListItemButton onClick={() => setSelectedActivity(activity)} style={{ flex: '1' }}>
								<ListItemAvatar>
									<Avatar>
										<TypeIcon type={activity.type} />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={getPrimaryText(activity)} secondary={getSecondaryText(activity)}></ListItemText>
							</ListItemButton>
						</ListItem>;
					})}
					{activitiesForDay.length === 0 && <ListItem>
						<ListItemAvatar>
							<Avatar>
								<HelpIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="No activities found" secondary="You can add them from below"></ListItemText>
					</ListItem>}
				</List>
			</ListWrapper>
			<EditDialog
				activity={selectedActivity}
				userCollection={userCollection}
				activities={activities}
				setActivities={setActivities}
				close={handleEditClose}
				db={db}>
			</EditDialog>

			<BGWrapper>
				<Typography>Quick Add</Typography>
				<ButtonGroup size="large">
					<Button title="Walk" onClick={() => addActivity('Walk')}><TypeIcon type="Walk" /></Button>
					<Button title="Run" onClick={() => addActivity('Run')}><TypeIcon type="Run" /></Button>
					<Button title="Gym" onClick={() => addActivity('Gym')}><TypeIcon type="Gym" /></Button>
					<Button title="Cycle" onClick={() => addActivity('Cycle')}><TypeIcon type="Cycle" /></Button>
				</ButtonGroup>
			</BGWrapper>
		</DialogContent>
	</Dialog>
}

const BGWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-wrap: wrap;
	width: calc(min(448px, 100%));
`;

const ListWrapper = styled.div`
	display: flex;
	justify-content: center;
	min-height: 360px;
	@media (max-width: 460px) {
		margin-left: -24px;
		margin-right: -24px;
	}
`;

const TitleContent = styled.div`
	display: flex;
	align-items: center;
`;

const DateTitle = styled.div`
	display: flex;
	justify-content: center;
	font-size: 16px;
	flex: 1;
`;

export default DayDialog;