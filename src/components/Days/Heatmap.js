import React from 'react';
import styled from 'styled-components';

export const getColorFromCalories = (cal) => {
  if (cal >= 1000) return `hsl(166, 100%, 50%)`;
  else if (cal >= 800) return `hsl(145, 100%, 50%)`;
  else if (cal >= 600) return `hsl(133, 100%, 50%)`;

  const excellentResult = 500;
  const hslMax = 133;
  const result = Math.max(0, Math.min(1, cal / excellentResult));
  return `hsl(${hslMax * result}, 50%, 40%)`;
};

export const getColorFromTime = (time) => {
  if (time >= 14400) return `hsl(166, 100%, 50%)`;
  else if (time >= 10800) return `hsl(145, 100%, 50%)`;
  else if (time >= 7200) return `hsl(133, 100%, 50%)`;

  const excellentResult = 5400;
  const hslMax = 133;
  const result = Math.max(0, Math.min(1, time / excellentResult));
  return `hsl(${hslMax * result}, 50%, 40%)`;
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
      const color = mode === 'calories' ? getColorFromCalories(sum) : getColorFromTime(sum);
      return `${color} ${point.toFixed(1)}%`;
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