import { Button } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, } from 'firebase/auth';
import React from 'react';
import styled from 'styled-components';
import { auth } from '../App';

function Login({ setUser }) {
	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider).then(authUser => {
			setUser(authUser.user);
			localStorage.setItem('cunen-is-tracking-you', JSON.stringify(authUser.user));
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