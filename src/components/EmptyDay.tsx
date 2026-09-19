import styled from 'styled-components';
import { dayCellHeight } from './calendarGrid';

/**
 * A day that pads the first or last week out to seven columns. It belongs to a
 * neighbouring month, which renders it there, so here it is only a hole in the
 * grid: no number, no event, nothing to press.
 */
const EmptyDay = styled.div`
  ${dayCellHeight}
`;

export default EmptyDay;
