import React from 'react';
import AddTask from './AddTask';
import Task from './Task';
import '../jobs/jobs.scss';

function Tasks({ firestore, user }) {
	const [tasks, setTasks] = React.useState([]);
	const [selectedTask, setSelectedTask] = React.useState();

	React.useEffect(() => {
		firestore.collection('tasks').onSnapshot(snapshot => {
			const taskItems = snapshot.docs.map(doc => {
				return {
					id: doc.id,
					...doc.data(),
				}
			});
			setTasks(taskItems);
		});
	}, [firestore]);

	const handleAddTask = () => {
		firestore.collection('tasks').add({
			name: 'Uusi tehtävä',
	});
	};

	return <div className="jobsContainer">
			{tasks && tasks.map(task => {
					return <Task
						key={task.id}
						task={task}
						selectedTask={selectedTask}
						setSelectedTask={setSelectedTask}
						firestore={firestore} />
			})}
			<AddTask onClick={handleAddTask} />
	</div>;
}

export default Tasks;
