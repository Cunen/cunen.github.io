import React from 'react';
import styled from 'styled-components';

const getWidth = (size, variant) => {
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

const getHeight = (size, variant) => {
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


function Day({ day, size, variant, selectedDate, setSelectedDate, activities }) {

	if (day === null) {
		return <NullDay width={getWidth(size, variant)} height={getHeight(size, variant)} />
	}


	const handleClick = () => setSelectedDate(day);
	const hasActivities = activities.length > 0;
	const today = new Date();
	const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
	const isSelected = selectedDate && day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear();
	const outline = isToday || isSelected;
	const borderColor = isSelected ? '#ff0000' : isToday ? '#ffffff' : '#1e1e1e';

	return <Wrapper
		activity={hasActivities}
		width={getWidth(size, variant)}
		height={getHeight(size, variant)}
		outline={outline}
		borderColor={borderColor}
		onClick={handleClick}>
	</Wrapper>;
}

const NullDay = styled.div`
	background-color: #0e0e0e;
	border: 1px solid #040404;
	width: ${props => props.width || 32}px;
	height: ${props => props.height || 32}px;
`;

const Wrapper = styled.div`
	border: 1px solid ${props => props.borderColor};
	background-color: ${props => props.activity ? '#035800' : 'transparent'};
	transition: all 1s;
	outline: ${props => `${Number(props.outline)}px solid ${props.borderColor}`};
	width: ${props => props.width || 32}px;
	height: ${props => props.height || 32}px;
`;

export default Day;