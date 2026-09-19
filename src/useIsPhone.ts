import { useSyncExternalStore } from 'react';
import { PHONE_QUERY } from './breakpoints';

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const isPhone = () => window.matchMedia(PHONE_QUERY).matches;

/**
 * The same breakpoint the styles use, for the layout choices CSS cannot make on
 * its own — a button that belongs in a different slot rather than in a different
 * place, and a date written shorter. Rotating the phone re-renders.
 */
export const useIsPhone = (): boolean =>
  useSyncExternalStore(subscribe, isPhone);
