import styled from 'styled-components';
import type { User } from 'firebase/auth';
import { phone } from '../breakpoints';

type Props = {
  user: User | null;
  /** False until Firebase has restored any existing session. */
  resolved: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
};

const AccountButton = ({ user, resolved, onSignIn, onSignOut }: Props) => {
  if (!resolved) return <Placeholder aria-hidden="true" />;

  if (!user) {
    return (
      <SignInButton type="button" onClick={onSignIn}>
        Sign in to edit
      </SignInButton>
    );
  }

  const name = user.displayName ?? user.email ?? 'Signed in';

  return (
    <Account>
      {user.photoURL ? (
        <Avatar src={user.photoURL} alt="" referrerPolicy="no-referrer" />
      ) : (
        <AvatarFallback aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      )}
      <Name title={name}>{name}</Name>
      <SignOutButton type="button" onClick={onSignOut}>
        Sign out
      </SignOutButton>
    </Account>
  );
};

/** Holds the row height steady while the session is being restored. */
const Placeholder = styled.div`
  height: 32px;
`;

const SignInButton = styled.button`
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-muted);
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: var(--accent);
  }
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const Avatar = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarFallback = styled.span`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent-soft);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
`;

const Name = styled.span`
  font-size: 13px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${phone} {
    max-width: 120px;
  }
`;

const SignOutButton = styled.button`
  border: 0;
  background: none;
  padding: 4px;
  font-size: 13px;
  color: var(--muted);
  text-decoration: underline;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: var(--text);
  }
`;

export default AccountButton;
