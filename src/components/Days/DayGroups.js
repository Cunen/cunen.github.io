import { Typography } from '@mui/material';
import React from 'react';
import { monthFromNumber } from '../../utils/dateUtils';
import Days from '../Days';
import { getWidth } from './Day';
import Heatmap from './Heatmap';

function DayGroups({ days, year, activities, range, size, variant, selectedDate, setSelectedDate, heatmap, dayVisualizer, dataVisualizer }) {
	const [daysInWeeks, setDaysInWeeks] = React.useState([]);
	const [daysInMonths, setDaysInMonths] = React.useState([]);
	const [daysInYear, setDaysInYear] = React.useState([]);

	const getActivitiesForDay = React.useCallback((day) => {
		return activities.filter(act => {
			const activityDate = act.date.toDate();
			return activityDate.getDate() === day.getDate()
				&& activityDate.getMonth() === day.getMonth()
				&& activityDate.getFullYear() === day.getFullYear();
		});
	}, [activities]);

	const getYear = React.useCallback(() => {
		const y = days.map(day => {
			return {
				day,
				activities: getActivitiesForDay(day),
			};
		});
		setDaysInWeeks([]);
		setDaysInMonths([]);
		setDaysInYear(y);
	}, [days, getActivitiesForDay]);

	const getMonths = React.useCallback(() => {
		const array = new Array(12).fill(0);
		const m = array.map((mo, i) => {
			const daysInMonth = days.filter(date => date.getMonth() === i);
			return daysInMonth.map(day => { 
				return { day, activities: getActivitiesForDay(day)}
			});
		})
		setDaysInWeeks([]);
		setDaysInMonths(m);
		setDaysInYear([]);
	}, [days, getActivitiesForDay]);

	const getWeeks = React.useCallback(() => {
		const weeks = [];
		let week = [];
		let first = true;
		days.forEach(day => {
			week.push({
				day,
				activities: getActivitiesForDay(day),
			});
			if (day.getDay() === 0) {
				if (first && week.length < 7) {
					const array = new Array(7 - week.length).fill(null);
					week.unshift(...array);
					first = false;
				}
				weeks.push([...week]);
				week = [];
			} else if (day.getDate() === 31 && day.getMonth() === 11) {
				const array = new Array(7 - week.length).fill(null);
				week.push(...array);
				weeks.push([...week]);
				week = [];
			}
		});
		setDaysInWeeks(weeks);
		setDaysInMonths([]);
		setDaysInYear([]);
	}, [days, getActivitiesForDay]);

	React.useEffect(() => {
		if (!activities) return;
		switch(range) {
			case 'week':
				return getWeeks();
			case 'month':
				return getMonths();
			case 'year':
			default:
				return getYear();
		}
	}, [activities, getMonths, getWeeks, getYear, range]);

	const renderYear = () => {
		if (range !== 'year') return;
		return <>
			<Typography>{year}</Typography>
			<Heatmap days={daysInYear} height={64} maxWidth={daysInYear.length * (getWidth(size, variant) + 6)} mode={heatmap} />
			<Days days={daysInYear} size={size} variant={variant} selectedDate={selectedDate} setSelectedDate={setSelectedDate} heatmap={heatmap} dayVisualizer={dayVisualizer} dataVisualizer={dataVisualizer} />
		</>;
	}

	const renderMonths = () => {
		if (range !== 'month') return;
		return daysInMonths.map((daysInMonth, i) => {
			return <>
				<Typography>{monthFromNumber(i)}</Typography>
				<Heatmap days={daysInMonth} height={32} maxWidth={daysInMonth.length * (getWidth(size, variant) + 6)} mode={heatmap} />
				<Days days={daysInMonth} size={size} variant={variant} selectedDate={selectedDate} setSelectedDate={setSelectedDate} heatmap={heatmap} dayVisualizer={dayVisualizer} dataVisualizer={dataVisualizer} />
			</>
		});
	}

	const renderWeeks = () => {
		if (range !== 'week') return;
		return daysInWeeks.map((daysInWeek, i) => {
			return <>
				<Typography>Week {i}</Typography>
				<Heatmap days={daysInWeek} height={16} maxWidth={7 * getWidth(size, variant) + 6 * 6} mode={heatmap} />
				<Days days={daysInWeek} size={size} variant={variant} selectedDate={selectedDate} setSelectedDate={setSelectedDate} heatmap={heatmap} dayVisualizer={dayVisualizer} dataVisualizer={dataVisualizer} />
			</>
		});
	}

	return <>
		{renderYear()}
		{renderMonths()}
		{renderWeeks()}
	</>;
}

export default DayGroups;