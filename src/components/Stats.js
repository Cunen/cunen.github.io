import React from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import Days from './Days';
import Options from './Options';
import DayDialog from './DayDialog';

const getDaysInYear = year => {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year + 1, 0, 1);
	const days = [];
	while (startDate < endDate) {
		days.push(new Date(startDate));
		startDate.setDate(startDate.getDate() + 1);
	}
	return days;
}

function Stats({ db, setUser, user }) {
	const [year] = React.useState(2022);
	const [days] = React.useState(getDaysInYear(year));
	const [range, setRange] = React.useState('year');
  const [size, setSize] = React.useState('m');
  const [variant, setVariant] = React.useState('square');
	const [selectedDate, setSelectedDate] = React.useState();
	const [activities, setActivities] = React.useState([]);
	const [userCollection] = React.useState('activities-' + user.user.uid);
	const dbRef = collection(db, userCollection);

	React.useEffect(() => {
		getDocs(dbRef).then(res => {
			const acts = res.docs.map(doc => ({ ...doc.data(), id: doc.id }));
			setActivities(acts);
		})
	}, []);

	const renderYear = () => {
		return <Days title={year} days={days} size={size} variant={variant} selectedDate={selectedDate} setSelectedDate={setSelectedDate} activities={activities} />;
	}

	const renderMonths = () => {
		const array = new Array(12).fill(0);
		return <>{array.map((m, i) => {
			const dates = days.filter(date => date.getMonth() === i);
			return <Days key={'month'+i} title={'Month ' + (i + 1)} days={dates} size={size} variant={variant} selectedDate={selectedDate} setSelectedDate={setSelectedDate} activities={activities} />;
		})}</>
	}

	const renderWeeks = () => {
		const weeks = [];
		let week = [];
		days.forEach(day => {
			week.push(day);
			if (day.getDay() === 0) {
				weeks.push([...week]);
				week = [];
			}
		});
		return weeks.map((week, i) => <Days key={'week'+i} title={'Week ' + i} days={week} size={size} variant={variant} selectedDate={selectedDate} setSelectedDate={setSelectedDate} activities={activities} />)
	}

	const renderDays = () => {
		switch(range) {
			case 'week':
				return renderWeeks();
			case 'month':
				return renderMonths();
			case 'year':
			default:
				return renderYear();
		}
	}

	const handleRangeChange = (e, value) => {
		setRange(value);
	}

  const handleVariantChange = (e, value) => {
    setVariant(value);
  }

  const handleSizeChange = (e, value) => {
    setSize(value);
  }

	return <Wrapper>
		<Options
			range={range}
			variant={variant}
			size={size}
			handleRangeChange={handleRangeChange}
			handleVariantChange={handleVariantChange}
			handleSizeChange={handleSizeChange}
			setUser={setUser} />
		<Scrollable>
			{renderDays()}
		</Scrollable>
		<DayDialog
			db={db}
			dbRef={dbRef}
			activities={activities}
			selectedDate={selectedDate}
			setSelectedDate={setSelectedDate}
			setActivities={setActivities}
			userCollection={userCollection} />
	</Wrapper>;
}

const Wrapper = styled.div`
  display: flex;
	flex: 1;
	gap: 16px;
  flex-direction: column;
	width: calc(min(80%, 800px));
`;

const Scrollable = styled.div`
	padding: 16px;
	padding-top: 0px;
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: auto;
`;

export default Stats;
