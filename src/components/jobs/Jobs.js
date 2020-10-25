import React from 'react';
import EditModal from '../editmodal/EditModal';
import AddJob from './AddJob';
import Job from './Job';
import './jobs.scss';

function Jobs({ firestore, user }) {
	const [jobs, setJobs] = React.useState([]);
	const [users, setUsers] = React.useState([]);
	const [selectedJob, setSelectedJob] = React.useState();
	const [editModalOpen, setEditModalOpen] = React.useState(false);

	React.useEffect(() => {
		firestore.collection('jobs').onSnapshot(snapshot => {
			const jobItems = snapshot.docs.map(doc => {
				return {
					id: doc.id,
					...doc.data(),
				}
			});
			setJobs(jobItems);
		});
	}, [firestore]);

	React.useEffect(() => {
		firestore.collection('users').onSnapshot(snapshot => {
			const userItems = snapshot.docs.map(doc => {
				return {
					id: doc.id,
					...doc.data(),
				}
			});
			setUsers(userItems);
		});
	}, [firestore]);

	const handleOpenEditModal = () => {
		setEditModalOpen(true);
	}

	const handleOpenCreateModal = () => {
		setSelectedJob(undefined);
		setEditModalOpen(true);
	}

	const handleModalClose = () => {
		setSelectedJob(undefined);
		setEditModalOpen(false);
	}

	return <div className="jobsContainer">
			<AddJob firestore={firestore} user={user} openCreateModal={handleOpenCreateModal} />
			{jobs && jobs.map(job => {
					return <Job
						key={job.id}
						job={job}
						firestore={firestore}
						selectedJob={selectedJob}
						setSelectedJob={setSelectedJob}
						openEditModal={handleOpenEditModal}
						assignee={users.find(user => user.email === job.assignee)} />
			})}
			{editModalOpen && <EditModal
				closeEditModal={handleModalClose}
				firestore={firestore}
				job={selectedJob}
				users={users} />
			}
	</div>;
}

export default Jobs;
