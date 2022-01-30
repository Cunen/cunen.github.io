import React from 'react';
import styled from 'styled-components';
import { getColorFromCalories, getColorFromTime } from './Heatmap';

export const getWidth = (size, variant) => {
	if (variant === 'vertical') return 8;
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

export const getHeight = (size, variant) => {
	if (variant === 'horizontal') return 8;
	switch (size) {
		case 's':
			return  24;
		case 'l':
			return  40;
		case 'm':
			default:
				return 32;
	}
}


function Day({ day, size, variant, selectedDate, setSelectedDate, activities, heatmap }) {

	if (day === null) {
		return <NullDay width={getWidth(size, variant)} height={getHeight(size, variant)} />
	}

	const handleClick = () => setSelectedDate(day);
	const hasActivities = activities.length > 0;
	const today = new Date();
	const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
	const isSelected = selectedDate && day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear();
	const outline = isToday || isSelected;
	const borderColor = isSelected ? '#ff0000' : isToday ? '#ffffff' : '#505050';
	const caloriesSum = Object.values(activities).reduce((a, b) => a + b.calories, 0);
	const timeSum = Object.values(activities).reduce((a, b) => a + b.duration, 0);
	const activityColor = !hasActivities 
		? 'transparent'
		: heatmap === 'calories'
			? getColorFromCalories(caloriesSum)
			: heatmap === 'minutes'
				? getColorFromTime(timeSum)
				: 'hsl(133, 54%, 43%)';


	return <Wrapper
		activityColor={activityColor}
		width={getWidth(size, variant)}
		height={getHeight(size, variant)}
		outline={outline}
		borderColor={borderColor}
		onClick={handleClick}>
			{variant === 'square' && activities.length ? <CornerBadge>{activities.length}</CornerBadge> : ''}
	</Wrapper>;
}

const NullDay = styled.div`
	transition: all 1s;
	background-color: #0e0e0e;
	border: 1px solid #040404;
	width: ${props => props.width || 32}px;
	height: ${props => props.height || 32}px;
`;

const Wrapper = styled.div`
	display: flex;
	position: relative;
	
	border: 1px solid ${props => props.borderColor};
	background-color: ${props => props.activityColor};
	transition: all 1s;
	outline: ${props => `${Number(props.outline)}px solid ${props.borderColor}`};
	width: ${props => props.width || 32}px;
	height: ${props => props.height || 32}px;
`;

const CornerBadge = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 12px;
	height: 12px;
	position: absolute;
	font-size: 12px;
	color: #424242;
	top: 0;
	left: 0;
`;

export default Day;