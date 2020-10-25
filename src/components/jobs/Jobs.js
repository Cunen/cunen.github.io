import React from 'react';
import EditModal from '../editmodal/EditModal';
import AddJob from './AddJob';
import Job from './Job';
import './jobs.scss';

function Jobs({ firestore, user }) {
	const [jobs, setJobs] = React.useState([]);
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
						openEditModal={handleOpenEditModal} />
			})}
			{editModalOpen && <EditModal closeEditModal={handleModalClose} firestore={firestore} job={selectedJob} />}
	</div>;
}

export default Jobs;
