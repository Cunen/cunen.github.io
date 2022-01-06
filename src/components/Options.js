import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import Logout from './Logout';

function Options({ range, variant, size, handleRangeChange, handleVariantChange, handleSizeChange, setUser }) {
	return <Wrapper>
		<ToggleButtonGroup color="primary" value={range} exclusive onChange={handleRangeChange}>
			<ToggleButton value="year">YEAR</ToggleButton>
			<ToggleButton value="month">MONTH</ToggleButton>
			<ToggleButton value="week">WEEK</ToggleButton>
		</ToggleButtonGroup>
		<ToggleButtonGroup color="primary" value={variant} exclusive onChange={handleVariantChange}>
			<ToggleButton value="square">SQUARE</ToggleButton>
			<ToggleButton value="horizontal">HORIZONTAL</ToggleButton>
			<ToggleButton value="vertical">VERTICAL</ToggleButton>
		</ToggleButtonGroup>
		<ToggleButtonGroup color="primary" value={size} exclusive onChange={handleSizeChange}>
			<ToggleButton value="s">S</ToggleButton>
			<ToggleButton value="m">M</ToggleButton>
			<ToggleButton value="l">L</ToggleButton>
		</ToggleButtonGroup>
		<Logout setUser={setUser} />
	</Wrapper>;
}

const Wrapper = styled.div`
  display: flex;
	flex-wrap: wrap;
	flex: 0 1;
	justify-content: center;
	padding: 16px;
	padding-bottom: 0px;
  gap: 16px;
`;

export default Options;