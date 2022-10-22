import React from 'react';
import styled from 'styled-components';
import { Redirect, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

export default function Guest({ setGuest }) {
	const { id } = useParams();
	setGuest(id);
	return <Redirect to="/" />;
}

export function GuestDialog({ guest, setGuest }) {
	const [visible, setVisible] = React.useState(true);
	if (!guest || !visible) return null;
	return <Dialog>
		Logged in as:
		<br />
		guest-{guest}
		<Wrapper>
			<Button variant="contained" color="primary" onClick={() => setVisible(false)}>Dismiss</Button>
			<Button variant="contained" color="secondary"  onClick={() => setGuest(undefined)}>Log out</Button>
		</Wrapper>
	</Dialog>;
}


const Dialog = styled.div`
	position: fixed;
	display: flex;
	flex-direction: column;
	z-index: 100;
	background-color: #272727;
	box-shadow: 0 0 4px white;
	border-radius: 4px;
	padding: 16px;
	top: 80px;
	left: 16px;
	gap: 16px;
	max-width: 300px;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	flex: 1;
	gap: 16px;
`;
