import React from 'react';
import {IconContext} from 'react-icons';
import {FaPlus} from 'react-icons/fa';
import EditModal from '../editmodal/EditModal';
import './jobs.scss';
 
function AddJob({ firestore, user }) {
    const handleAddJob = () => {
        firestore.collection('jobs').add({
            name: 'new job',
        });
    };

    return <div className="addJob jobCube">
				<IconContext.Provider value={{ style: {fontSize: '100px', color: "rgb(0, 123, 255)"}}}>
					<div>
						<FaPlus />
					</div>
				</IconContext.Provider>
        <button onClick={handleAddJob}>Add job</button>
    </div>;
};

function Job({ job, firestore }) {
    const handleDeleteJob = () => {
        const item = firestore.collection('jobs').doc(job.id);
        item.delete();
    };
    return <div className="jobCube">
        {job.name}
        <button onClick={handleDeleteJob}>Remove Job</button>
    </div>
};

function Jobs({ firestore, user }) {
	const [jobs, setJobs] = React.useState([]);
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
    return <div className="jobsContainer">
				<EditModal />
        <AddJob firestore={firestore} user={user} />
        {jobs && jobs.map(job => {
            return <Job key={job.id} job={job} firestore={firestore} />
        })}
    </div>;
}

export default Jobs;
