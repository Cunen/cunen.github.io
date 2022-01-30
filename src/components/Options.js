import { Settings } from '@mui/icons-material';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

function Options({ range, size, handleRangeChange, handleSizeChange, heatmap, setHeatmap }) {
	const [showOptions, setShowOptions] = React.useState(false);

	const toggleVisibility = () => {
		setShowOptions(!showOptions);
	}

	return <Wrapper>
		<Button onClick={toggleVisibility} variant="outlined">
			<Settings />
		</Button>
		{showOptions && <>
			<ToggleButtonGroup color="primary" value={range} exclusive onChange={handleRangeChange}>
				<ToggleButton value="year">YEARLY</ToggleButton>
				<ToggleButton value="month">MONTHLY</ToggleButton>
				<ToggleButton value="week">WEEKLY</ToggleButton>
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