import React from 'react';
import { useCategories } from '../categories/Categories';

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
      return diff + ' seconds';
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

export default function Job({ job, firestore, selectedJob, setSelectedJob, openEditModal }) {
  const { getCategoryIcon } = useCategories();

  const handleClick = () => {
    setSelectedJob(job);
  }

  const markAsDone = () => {
    const item = firestore.collection('jobs').doc(job.id);
    item.update({
      completedAt: new Date(),
    });
  }

  return <div className="jobCube" onClick={handleClick}>
      {job === selectedJob
        ? <>
            <button className="jobBtn" onClick={markAsDone}>Mark done</button>
            <button className="jobBtn" onClick={openEditModal}>Edit</button>
          </>
        : <>
          <Timeleft job={job} />
          {getCategoryIcon(job.category, 70)}
          {job.name}
        </>
      }
  </div>
};