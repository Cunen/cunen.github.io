import React from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import Options from './Options';
import DayDialog from './DayDialog';
import ImportDialog from './ImportDialog';
import DayGroups from './Days/DayGroups';

export const getDaysInYear = year => {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year + 1, 0, 1);
	const days = [];
	while (startDate < endDate) {
		days.push(new Date(startDate));
		startDate.setDate(startDate.getDate() + 1);
	}
	return days;
}

export const getCodeFromWindowSearch = () => {
	const search = window.location.search;
	const replaced = search.replace('?', '');
	const split = replaced.split('&');
	const obj = {}
	split.forEach(s => {
		const equalSplit = s.split('=');
		obj[equalSplit[0]] = equalSplit[1];
	});
	return obj.code;
}

function Stats({ db, user, importOpen, setImportOpen }) {
	const [year, setYear] = React.useState(2022);
	const [days, setDays] = React.useState(getDaysInYear(year));
	const [range, setRange] = React.useState('year');
  const [size, setSize] = React.useState('m');
  const [variant, setVariant] = React.useState('square');
	const [selectedDate, setSelectedDate] = React.useState();
	const [activities, setActivities] = React.useState([]);
	const [userCollection] = React.useState('activities-' + user.user.uid);
	const [heatmap, setHeatmap] = React.useState(null);
	const dbRef = collection(db, userCollection);

	React.useEffect(() => {
		getDocs(dbRef).then(res => {
			const acts = res.docs.map(doc => ({ ...doc.data(), id: doc.id }));
			setActivities(acts);
		})
	}, []);

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
			year={year}
			setYear={setYear}
			setDays={setDays}
			range={range}
			variant={variant}
			size={size}
			handleRangeChange={handleRangeChange}
			handleVariantChange={handleVariantChange}
			handleSizeChange={handleSizeChange}
			heatmap={heatmap}
			setHeatmap={setHeatmap} />
		<Scrollable>
			<DayGroups
				days={days}
				year={year}
				activities={activities}
				range={range}
				size={size}
				variant={variant}
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
				heatmap={heatmap} />
		</Scrollable>
		<DayDialog
			db={db}
			dbRef={dbRef}
			activities={activities}
			selectedDate={selectedDate}
			setSelectedDate={setSelectedDate}
			setActivities={setActivities}
			userCollection={userCollection} />
		<ImportDialog
			open={importOpen || !!getCodeFromWindowSearch()}
			close={setImportOpen}
			db={db}
			userCollection={userCollection}
			dbRef={dbRef} />
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
