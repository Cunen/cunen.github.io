import React from 'react';
import styled from 'styled-components';
import Day from './Day';

function Days({ days, title, size, variant, selectedDate, setSelectedDate, activities }) {
	return <Wrapper>
		<Title>{title}</Title>
		<Container>
			{days.map((day, i) => {
				if (day === null) {
					return <Day key={'nullday-' + i} day={day} />;
				}
				const acts = activities.filter(act => {
					const dateMatch = act.date === day;
					const secondsMatch = act.date?.seconds === day.getTime() / 1000;
					return dateMatch || secondsMatch;
				});
				return <Day key={day} day={day} size={size} variant={variant} selectedDate={selectedDate} setSelectedDate={setSelectedDate} activities={acts} /> 
			})}
		</Container>
	</Wrapper>;
}

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	padding: 4px;
	align-items: center;
`;

const Title = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 80px;
	height: 0px;
`;

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-wrap: wrap;
	gap: 4px;
`;

export default Days;