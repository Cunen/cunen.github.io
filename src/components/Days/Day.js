import { CircularProgress, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { getColorFromCalories, getColorFromTime } from './Heatmap';

export const getSize = (size) => {
	switch (size) {
		case 's':
			return 24;
		case 'l':
			return 40;
		case 'm':
			default:
				return 32;
	}
}

function Day({ day, size, selectedDate, setSelectedDate, activities, heatmap }) {

	if (day === null) {
		return <NullDay width={getSize(size)} height={getSize(size)} />
	}

	const handleClick = () => setSelectedDate(day);
	const hasActivities = activities.length > 0;
	const today = new Date();
	const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
	const isSelected = selectedDate && day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear();
	const borderColor = isSelected ? '#ff0000' : isToday ? '#ffffff' : '#505050';
	const itemSize = getSize(size);

	const aCount = activities.length || 1;

	const walks = (activities.filter(a => a.type === 'Walk').length / aCount) * 100;
	const gyms = (activities.filter(a => a.type === 'Gym').length / aCount) * 100 + walks;
	const cycles = (activities.filter(a => a.type === 'Cycle').length / aCount) * 100 + gyms;
	const runs = (activities.filter(a => a.type === 'Run').length / aCount) * 100 + cycles;
	const others = (activities.filter(a => !(['Walk', 'Run', 'Cycle', 'Gym'].includes(a.type))).length / aCount) * 100 + runs;

	return <Wrapper
		size={itemSize}
		borderColor={hasActivities ? 'transparent' : borderColor}
		onClick={handleClick}>
			{hasActivities && <CircleWrapper size={itemSize}>
				<CircularProgress variant="determinate" size={itemSize} thickness={10} value={others} color="secondary" />
				<CircularProgress variant="determinate" size={itemSize} thickness={10} value={runs} color="error" />
				<CircularProgress variant="determinate" size={itemSize} thickness={10} value={cycles} color="warning" />
				<CircularProgress variant="determinate" size={itemSize} thickness={10} value={gyms} color="info" />
				<CircularProgress variant="determinate" size={itemSize} thickness={10} value={walks} color="success" />
				<Typography fontSize={12}>{activities.length}</Typography>
			</CircleWrapper>}
	</Wrapper>;
}

const NullDay = styled.div`
	transition: all 1s;
	background-color: #0e0e0e;
	border: 1px solid #040404;
	width: ${props => props.width || 32}px;
	height: ${props => props.height || 32}px;
`;

const CircleWrapper = styled.div`
	width: ${props => props.size || 32}px;
	height: ${props => props.size || 32}px;
	display: flex;
	justify-content: center;
	align-items: center;
	& > span {
		position: absolute;
	}
`;

const Wrapper = styled.div`
	display: flex;
	position: relative;
	border-radius: 50%;
	border: 1px solid ${props => props.borderColor};
	transition: all 1s;
	width: ${props => props.size || 32}px;
	height: ${props => props.size || 32}px;
`;

export default Day;