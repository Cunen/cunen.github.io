import React from 'react';
import { useCategories } from '../categories/Categories';
import './editmodal.scss';

const hourInMilliseconds = 3600000;
const dayInMilliseconds = hourInMilliseconds * 24;
const weekInMilliseconds = dayInMilliseconds * 7;
const monthInMilliseconds = weekInMilliseconds * 4;

const intervalUnits = [
  { title: 'Hours', milliseconds: hourInMilliseconds },
  { title: 'Days', milliseconds: dayInMilliseconds },
  { title: 'Weeks', milliseconds: weekInMilliseconds },
  { title: 'Months', milliseconds: monthInMilliseconds },
]

export default function EditModal({ firestore, closeEditModal, job, users }) {
  const { categories } = useCategories();
  const [name, setName] = React.useState(job ? job.name : '');
  const [interval, setInterval] = React.useState(job ? job.interval : 1);
  const [intervalUnit, setIntervalUnit] = React.useState(job ? job.intervalUnit : intervalUnits[0]);
  const [points, setPoints] = React.useState(job ? job.points : 1);
  const [category, setCategory] = React.useState(job ? job.category : categories[0].name);
  const [assignee, setAssignee] = React.useState(job ? job.assignee : 'nobody');

  const handleNameChange = event => setName(event.currentTarget.value);
  const handleIntervalChange = event => setInterval(event.currentTarget.value);
  const handlePointsChange = event => setPoints(event.currentTarget.value);
  const handleCategoryChange = event => setCategory(event.currentTarget.value);
  const handleAssigneeChange = event => setAssignee(event.currentTarget.value);

  const handleCloseClick = event => {
    if (event.target.id === 'modalBackground') {
      closeEditModal();
    }
  }

  const handleAddJob = (event) => {
    event.preventDefault();
    if (!name || !interval || !points) return;
    firestore.collection('jobs').add({
        name,
        interval,
        intervalUnit,
        points,
        category,
        completedAt: new Date(),
        assignee,
    });
    closeEditModal();
  };

  const handleEditJob = (event) => {
    event.preventDefault();
    if (!job || !name || !interval || !points) return;;
    const item = firestore.collection('jobs').doc(job.id);
    item.update({
      name,
      interval,
      intervalUnit,
      points,
      category,
      assignee,
    });
    closeEditModal();
  }

  const handleDelete = () => {
    if (!job) return;
    const item = firestore.collection('jobs').doc(job.id);
    item.delete();
    closeEditModal();
  };

  return <div id="modalBackground" className="modalBackground" onClick={handleCloseClick} onSubmit={job ? handleEditJob : handleAddJob}>
    <div className="modal">
      <form>
        <label htmlFor="name">
          {job ? 'Edit job' : 'Create a job'}
        </label>
        <input type="text" id="name" name="name" placeholder="Name" value={name} onChange={handleNameChange}/>

        <label htmlFor="category">Category</label>
        <select name="category" id="category" value={category} onChange={handleCategoryChange}>
          {categories.map(cat => {
            return <option key={cat.name} value={cat.name}>{cat.name}</option>
          })}
        </select>

        <label htmlFor="interval">Repeat every</label>
        <input type="number" name="interval" id="interval" value={interval} onChange={handleIntervalChange} />
        <div className="durationButtons">
          {intervalUnits.map(unit => {
            return <button
              className={unit.title === intervalUnit.title ? 'selected' : ''}
              key={unit.title}
              type="button"
              onClick={() => setIntervalUnit(unit)}>{unit.title}
            </button>;
          })}
        </div>

        <label htmlFor="points">Points</label>
        <input type="number" name="points" id="points" value={points} onChange={handlePointsChange} />

        <label htmlFor="assignee">Assignee</label>
        <select name="assignee" id="assignee" value={assignee} onChange={handleAssigneeChange}>
          <option value="nobody">Anyone</option>
          {users.map(user => {
            return <option key={user.email} value={user.email}>{user.name}</option>;
          })}
        </select>

        {!job && <button type="submit" disabled={!name}>Create</button>}
        {job && <div className="dualButtons">
          <button type="subbmit">Save</button>
          <button type="button" onClick={handleDelete}>Delete</button>
        </div>} 
      </form>
      
    </div>
  </div>;
}
