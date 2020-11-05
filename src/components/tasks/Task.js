import React from 'react';
import Icon from '../icon/Icon';

export default function Task({ task, selectedTask, setSelectedTask, firestore }) {
  const [confirm, setConfirm] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState();

  const handleClick = () => {
    if (editing) return;
    selectedTask === task
      ? setSelectedTask(undefined)
      : setSelectedTask(task);
  };

  const handleDelete = () => {
    if (!task) return;
    setSelectedTask(undefined);
    const item = firestore.collection('tasks').doc(task.id);
    item.delete();  
  };

  const handleSetEdit = () => {
    if (editing) return;
    setEditValue(task.name);
    setEditing(true);
  }

  const getValue = () => {
    return editing ? editValue : task.name;
  }

  const handleNameChange = event => {
    setEditValue(event.target.value);
  }

  const handleBlur = () => {
    const item = firestore.collection('tasks').doc(task.id);
    const name = editValue ? editValue : task.name;
    item.update({ name });
    setEditing(false);
  }

  React.useEffect(() => {
    if (editing) {
      document.getElementById('editTaskName').focus();
    }
  }, [editing]);

  return <>
    <div className="jobCube" onClick={handleClick}>
      <Icon icon="Check" size={30} />
      <input
        id="editTaskName"
        className="taskEditField"
        type="text"
        value={getValue()}
        disabled={!editing}
        onChange={handleNameChange}
        onBlur={handleBlur} />
    </div>
    {selectedTask === task && !editing &&
      <div className="expandedJob">
        <button className="jobBtn" onClick={handleSetEdit}>Edit</button>
        {confirm
          ? <button className="jobBtn" onClick={handleDelete} disabled={editing}>Are you sure?</button>
          : <button className="jobBtn" onClick={() => setConfirm(true)}>Mark done</button>
        }
      </div>
    }
  </>
};