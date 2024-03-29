import React from 'react';
import styled from 'styled-components';
import Day from './Days/Day';

function Days({ days, size, selectedDate, setSelectedDate, heatmap }) {
	const renderDays = () => {
		return <Wrapper>
			{days.map((day, i) => {
				if (day === null) {
					return <Day key={'nullday-' + i} day={day} size={size} />;
				}
				return <Day
					key={day.day}
					day={day.day}
					size={size}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					activities={day.activities}
					heatmap={heatmap} /> 
				})}
		</Wrapper>;
	}

	return <>
		{renderDays()}
	</>;
}

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: center;
`;

export default Days;