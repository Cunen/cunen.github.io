import { useCallback, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';

/** Closing the popup yourself is a decision, not a failure worth reporting. */
const SILENT_CODES = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
]);

const codeOf = (error: unknown): string =>
  typeof error === 'object' && error !== null
    ? ((error as { code?: string }).code ?? '')
    : '';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  // Starts undecided so the header does not flash "Sign in" at an editor on load.
  const [resolved, setResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setResolved(true);
      }),
    []
  );

  const signIn = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (caught) {
      const code = codeOf(caught);
      if (SILENT_CODES.has(code)) return;
      console.error('[calendar] Google sign-in failed', caught);
      setError(
        code === 'auth/popup-blocked'
          ? 'Your browser blocked the sign-in popup.'
          : 'Sign-in failed. Try again.'
      );
    }
  }, []);

  const signOut = useCallback(() => {
    setError(null);
    void firebaseSignOut(auth).catch((caught: unknown) => {
      console.error('[calendar] sign-out failed', caught);
    });
  }, []);

  return { user, canEdit: user !== null, resolved, error, signIn, signOut };
};
