import { MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { getDaysInYear } from './Stats';

function Options({ range, variant, size, handleRangeChange, handleVariantChange, handleSizeChange, year, setYear, setDays }) {
	const handleYearChange = (e, value) => {
		setYear(e.target.value);
		setDays(getDaysInYear(e.target.value));
	}

	return <Wrapper>
		<Select
			labelId="yearlabel"
			id="year-select"
			value={year}
			label="Year"
			onChange={handleYearChange}
		>
			<MenuItem value={2022}>2022</MenuItem>
			<MenuItem value={2021}>2021</MenuItem>
			<MenuItem value={2020}>2020</MenuItem>
			<MenuItem value={2019}>2019</MenuItem>
			<MenuItem value={2018}>2018</MenuItem>
		</Select>
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
	</Wrapper>;
}

const Wrapper = styled.div`
  display: flex;
	justify-content: center;
	flex-wrap: wrap;
	overflow: hidden;
	padding: 16px;
	padding-bottom: 0px;
  gap: 16px;
`;

export default Options;