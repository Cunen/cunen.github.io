import styled from 'styled-components';
import { calendarColumns } from './calendarGrid';
import { phone } from '../breakpoints';
import { WEEKDAY_LABELS } from '../dates';

/** Lives in the sticky header rather than in the grid, so it survives scrolling. */
const WeekdayRow = () => (
  <Row aria-hidden="true">
    {WEEKDAY_LABELS.map((label) => (
      <Weekday key={label}>{label}</Weekday>
    ))}
  </Row>
);

const Row = styled.div`
  ${calendarColumns}
`;

const Weekday = styled.div`
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);

  ${phone} {
    padding: 0;
    text-align: center;
    letter-spacing: 0;
  }
`;

export default WeekdayRow;
