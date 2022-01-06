import { Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import React from 'react';

function Logout({ setUser }) {
	const signOutFromGoogle = () => {
		const auth = getAuth();
		auth.signOut();
		setUser(undefined);
		localStorage.removeItem('cunen-is-tracking-you');
	}

	return <Button onClick={signOutFromGoogle}>Logout</Button>;
}


export default Logout;