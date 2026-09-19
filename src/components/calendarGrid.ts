import { phone } from '../breakpoints';

/**
 * Shared by the day grid and the sticky weekday row so the two stay in step.
 * Seven equal columns, each free to shrink, so the week never overflows the page.
 */
export const calendarColumns = `
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;

  ${phone} {
    gap: 3px;
  }
`;

/** The height a day occupies, shared so real days and padding days line up. */
export const dayCellHeight = `
  min-height: 118px;

  ${phone} {
    min-height: 58px;
  }
`;
