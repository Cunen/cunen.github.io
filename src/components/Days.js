import { DirectionsRun, DirectionsWalk, DirectionsBike, FitnessCenter } from '@mui/icons-material';
import { Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import Day from './Days/Day';

function Days({ days, size, variant, selectedDate, setSelectedDate, heatmap, dayVisualizer, dataVisualizer}) {
	const summary = React.useMemo(() => {
		const sum = { 
			walks: 0, walkDist: 0, walkTime: 0, walkCalories: 0,
			runs: 0, runDist: 0, runTime: 0, runCalories: 0,
			cycles: 0, cycleDist: 0, cycleTime: 0, cycleCalories: 0,
			gyms: 0, gymTime: 0, gymCalories: 0,
			others: 0, otherTime: 0, otherCalories: 0, otherDistance: 0,
			activities: 0, distance: 0, time: 0, calories: 0 };
		days.forEach(day => {
			if (day && day.activities) {
				day.activities.forEach(activity => {
					sum.activities++;
					sum.time += activity.duration || 0;
					sum.distance += activity.distance || 0;
					sum.calories += activity.calories || 0;
					switch (activity.type) {
						case 'Walk':
							sum.walks++;
							sum.walkTime += activity.duration || 0;
							sum.walkCalories += activity.calories || 0;
							sum.walkDist += activity.distance || 0;
							break;
						case 'Run':
							sum.runs++;
							sum.runTime += activity.duration || 0;
							sum.runCalories += activity.calories || 0;
							sum.runDist += activity.distance || 0;
							break;
						case 'Cycle':
							sum.cycles++;
							sum.cycleTime += activity.duration || 0;
							sum.cycleCalories += activity.calories || 0;
							sum.cycleDist += activity.distance || 0;
							break;
						case 'Gym':
							sum.gyms++;
							sum.gymTime += activity.duration || 0;
							sum.gymCalories += activity.calories || 0;
							break;
						default:
							sum.others++;
							sum.otherTime += activity.duration || 0;
							sum.otherCalories += activity.calories || 0;
							sum.otherDist += activity.distance || 0;
							break;
					}
				});
			}
		})
		return sum;
	}, [days]);

	if (!dayVisualizer) return null;

	const renderDays = () => {
		if (!dayVisualizer) return null;
		return <Wrapper>
			{days.map((day, i) => {
				if (day === null) {
					return <Day key={'nullday-' + i} day={day} size={size} variant={variant} />;
				}
				return <Day
					key={day.day}
					day={day.day}
					size={size}
					variant={variant}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					activities={day.activities}
					heatmap={heatmap} /> 
				})}
		</Wrapper>;
	}

	const renderData = () => {
		if (!dataVisualizer || summary.activities === 0) return null;

		if (days.length < 10) {
			return <DataWrapper>
				<Typography fontSize={12}>{summary.activities} Activities, {summary.walks} walks, {summary.runs} runs, {summary.cycles} cycles, {summary.gyms} gyms</Typography>
				<Typography fontSize={12}>{summary.calories}kcal, {(summary.time / 3600).toFixed(0)}h {((summary.time % 3600) / 60).toFixed(0)}m, {(summary.distance / 1000).toFixed(2)}km</Typography>
			</DataWrapper>
		}

		return <DataWrapper>
			<Typography fontSize={12}>{summary.activities} Activities</Typography>
			<Bar>
				<BarBit title={summary.walks} width={summary.walks / summary.activities} color='#267026'><DirectionsWalk /></BarBit>
				<BarBit title={summary.runs} width={summary.runs / summary.activities} color='#b32825'><DirectionsRun /></BarBit>
				<BarBit title={summary.cycles} width={summary.cycles / summary.activities} color='#9f9f2f'><DirectionsBike /></BarBit>
				<BarBit title={summary.gyms} width={summary.gyms / summary.activities} color='#223c93'><FitnessCenter /></BarBit>
				<BarBit title={summary.others} width={summary.others / summary.activities}></BarBit>
			</Bar>
			<Typography fontSize={12}>{summary.calories}kcal Burned</Typography>
			<Bar>
				<BarBit width={summary.walkCalories / summary.calories} color='#267026'><DirectionsWalk /></BarBit>
				<BarBit width={summary.runCalories / summary.calories} color='#b32825'><DirectionsRun /></BarBit>
				<BarBit width={summary.cycleCalories / summary.calories} color='#9f9f2f'><DirectionsBike /></BarBit>
				<BarBit width={summary.gymCalories / summary.calories} color='#223c93'><FitnessCenter /></BarBit>
				<BarBit width={summary.otherCalories / summary.calories}></BarBit>
			</Bar>
			<Typography fontSize={12}>{(summary.time / 3600).toFixed(0)} Hours {((summary.time % 3600) / 60).toFixed(0)} Minutes</Typography>
			<Bar>
				<BarBit width={summary.walkTime / summary.time} color='#267026'><DirectionsWalk /></BarBit>
				<BarBit width={summary.runTime / summary.time} color='#b32825'><DirectionsRun /></BarBit>
				<BarBit width={summary.cycleTime / summary.time} color='#9f9f2f'><DirectionsBike /></BarBit>
				<BarBit width={summary.gymTime / summary.time} color='#223c93'><FitnessCenter /></BarBit>
				<BarBit width={summary.otherTime / summary.time}></BarBit>
			</Bar>
			<Typography fontSize={12}>{(summary.distance / 1000).toFixed(2)} km of Distance</Typography>
			<Bar>
				<BarBit width={summary.walkDist / summary.distance} color='#267026'><DirectionsWalk /></BarBit>
				<BarBit width={summary.runDist / summary.distance} color='#b32825'><DirectionsRun /></BarBit>
				<BarBit width={summary.cycleDist / summary.distance} color='#9f9f2f'><DirectionsBike /></BarBit>
				<BarBit width={summary.otherDist / summary.distance}></BarBit>
			</Bar>
		</DataWrapper>;
	}

	return <>
		{renderData()}
		{renderDays()}
	</>;
}

const Bar = styled.div`
	display: flex;
	width: 100%;
	height: 40px;
	border: 1px solid white;
	@media (max-width: 800px) {
		height: 24px;
	}
`;

const BarBit = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	width: ${props => props.width !== undefined ? props.width * 100 + '%' : 'unset'};
	height: 100%;
	background-color: ${props => props.color ? props.color : '#383b46'};
`;

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: center;
`;

const DataWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding-bottom: 8px;
`;

export default Days;