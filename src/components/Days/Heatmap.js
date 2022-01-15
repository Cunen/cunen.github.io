import React from 'react';
import styled from 'styled-components';

export const getColorFromCalories = (cal) => {
  const excellentResult = 500;
  const hslMax = 133;
  const result = Math.max(0, Math.min(1, cal / excellentResult));
  return `hsl(${hslMax * result}, 54%, 43%)`;
};

export const getColorFromTime = (time) => {
  const excellentResult = 5400;
  const hslMax = 133;
  const result = Math.max(0, Math.min(1, time / excellentResult));
  return `hsl(${hslMax * result}, 54%, 43%)`;
};

function Heatmap({ days, height, maxWidth, mode }) {
  const getKcalSum = (day) => {
    return day ? Object.values(day.activities).reduce((a, b) => a + b.calories, 0) : 0;

  }

  const getTimeSum = (day) => {
    return day ? Object.values(day.activities).reduce((a, b) => a + b.duration, 0) : 0;
  }

  const getSliderSteps = () => {
    const len = days.length;
    const shift = 1 / len * 50;
    const steps = days.map((day, i) => {
      const sum = mode === 'calories' ? getKcalSum(day) : getTimeSum(day);
      const point = (i / len * 100) + shift;
      return `${getColorFromCalories(sum)} ${point.toFixed(1)}%`;
    });
    return steps.join(', ');
  }

  if (!mode) return <></>;

	return <HeatSlider steps={getSliderSteps()} height={height} maxWidth={maxWidth} />
}

const HeatSlider = styled.div`
  display: flex;
  width: 100%;
  min-height: ${props => props.height}px;
  max-width: ${props => props.maxWidth}px;
  margin-bottom: 16px;
  background: linear-gradient(90deg, ${props => props.steps});
`;

export default Heatmap;