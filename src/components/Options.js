import { Settings } from '@mui/icons-material';
import { Button, FormControlLabel, MenuItem, Select, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { getDaysInYear } from './Stats';

function Options({ range, variant, size, handleRangeChange, handleVariantChange, handleSizeChange, year, setYear, setDays, heatmap, setHeatmap, dataVisualizer, dayVisualizer, setDataVisualizer, setDayVisualizer }) {
	const [showOptions, setShowOptions] = React.useState(false);

	const handleYearChange = (e, value) => {
		setYear(e.target.value);
		setDays(getDaysInYear(e.target.value));
	}

	const toggleVisibility = () => {
		setShowOptions(!showOptions);
	}

	return <Wrapper>
		<Button onClick={toggleVisibility} variant="outlined">
			<Settings />
		</Button>
		{showOptions && <>
			<Select value={year} onChange={handleYearChange}>
				<MenuItem value={2022}>2022</MenuItem>
				<MenuItem value={2021}>2021</MenuItem>
				<MenuItem value={2020}>2020</MenuItem>
				<MenuItem value={2019}>2019</MenuItem>
				<MenuItem value={2018}>2018</MenuItem>
			</Select>
			<ToggleButtonGroup color="primary" value={range} exclusive onChange={handleRangeChange}>
				<ToggleButton value="year">YEARLY</ToggleButton>
				<ToggleButton value="month">MONTHLY</ToggleButton>
				<ToggleButton value="week">WEEKLY</ToggleButton>
			</ToggleButtonGroup>
			<ToggleButtonGroup color="primary" value={variant} exclusive onChange={handleVariantChange}>
				<ToggleButton value="square">SQUARE</ToggleButton>
				<ToggleButton value="horizontal">HORIZONTAL</ToggleButton>
				<ToggleButton value="vertical">VERTICAL</ToggleButton>
			</ToggleButtonGroup>
			<ToggleButtonGroup color="primary" value={size} exclusive onChange={handleSizeChange}>
				<ToggleButton value="s">SMALL</ToggleButton>
				<ToggleButton value="m">MEDIUM</ToggleButton>
				<ToggleButton value="l">LARGE</ToggleButton>
			</ToggleButtonGroup>
			<ToggleButtonGroup color="primary" exclusive value={heatmap} onChange={(e,v) => setHeatmap(v)}>
				<ToggleButton value="">No Heatmap</ToggleButton>
				<ToggleButton value="calories">Calories</ToggleButton>
				<ToggleButton value="minutes">Time</ToggleButton>
			</ToggleButtonGroup>
			<FormControlLabel control={<Switch checked={dayVisualizer} onChange={() => setDayVisualizer(!dayVisualizer)}/>} label="Days Visualizer" />
			<FormControlLabel control={<Switch checked={dataVisualizer} onChange={() => setDataVisualizer(!dataVisualizer)} />} label="Show data" />
		</>}
	</Wrapper>;
}

const Wrapper = styled.div`
  display: flex;
	flex-wrap: wrap;
	overflow: hidden;
	padding: 16px;
	padding-bottom: 0px;
  gap: 16px;
	min-height: 56px;
`;

export default Options;