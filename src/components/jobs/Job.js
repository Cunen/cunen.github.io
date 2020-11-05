import React from 'react';
import { useCategories } from '../categories/Categories';
import Icon from '../icon/Icon';

function Timeleft({ job }) {
  const completedAtMilliseconds = job.completedAt.seconds * 1000;
  const nowMilliseconds = new Date().getTime();
  const secondDiff = (completedAtMilliseconds + (job.intervalUnit.milliseconds * job.interval) - nowMilliseconds) / 1000;
  const isLate = secondDiff <= 0;
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = week * 4;

  const getUnitAndTimeLeft = () => {
    const diff = Math.abs(secondDiff)
    if (diff < minute) {
      return Math.floor(diff) + ' seconds';
    } else if (diff < hour) {
      return Math.floor(diff / minute) + ' minutes';
    } else if (diff < day) {
      return Math.floor(diff / hour) + ' hours';
    } else if (diff < week) {
      return Math.floor(secondDiff / day) + ' days';
    } else if (diff < month) {
      return Math.floor(diff / week) + ' weeks';
    } else {
      return Math.floor(diff / month) + ' months';
    }
  }

  const getClassName = () => {
    const classes = ['timeleft'];
    if (isLate) classes.push('late');
    if (secondDiff < day) classes.push('soon');
    else classes.push('early');
    return classes.join(' ');
  }

  return <div className={getClassName()}>
    {!isLate && 'in '}
    {getUnitAndTimeLeft()}
    {isLate && ' late'}
  </div>;
}

function AssigneeBubble({ url }) {
  return <img className="assigneeBubble" src={url} alt={url} />
}

export default function Job({ job, firestore, selectedJob, setSelectedJob, openEditModal, assignee }) {
  const [confirm, setConfirm] = React.useState(false);

  React.useEffect(() => {
    if (selectedJob !== job) {
      setConfirm(false);
    }
  }, [selectedJob, job]);

  const handleClick = () => {
    selectedJob === job ? setSelectedJob(undefined) : setSelectedJob(job);
  }

  const markAsDone = () => {
    setConfirm(false);
    const item = firestore.collection('jobs').doc(job.id);
    item.update({
      completedAt: new Date(),
    });
  }

  return <>
    <div className="jobCube" onClick={handleClick}>
      {assignee && <AssigneeBubble url={assignee.imageUrl} />}
      <Timeleft job={job} />
      <Icon icon={job.category} size={30} />
      {job.name}
    </div>
    {selectedJob === job &&
      <div className="expandedJob">
        <button className="jobBtn" onClick={openEditModal}>Edit</button>
        {confirm
          ? <button className="jobBtn" onClick={markAsDone}>Are you sure?</button>
          : <button className="jobBtn" onClick={() => setConfirm(true)}>Mark done</button>
        }
      </div>
    }
  </>
};