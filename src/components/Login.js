import { Button } from '@mui/material';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import styled from 'styled-components';



function Login({ setUser }) {
	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		const auth = getAuth();
		signInWithPopup(auth, provider).then(authUser => {
			setUser(authUser);
			localStorage.setItem('cunen-is-tracking-you', JSON.stringify(authUser));
		});
	}

	return <Wrapper><Button onClick={signInWithGoogle}>Login</Button></Wrapper>;
}

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
`;

export default Login;