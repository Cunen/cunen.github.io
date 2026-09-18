/** Shared Finnish labels that have to agree in number. */

export const goingLabel = (count: number): string => `${count} tulossa`;

export const interestedLabel = (count: number): string =>
  `${count} ${count === 1 ? 'kiinnostunut' : 'kiinnostunutta'}`;

export const upcomingLabel = (count: number): string =>
  `${count} ${count === 1 ? 'tuleva keikka' : 'tulevaa keikkaa'}`;

export const UNTITLED = 'Nimetön keikka';
