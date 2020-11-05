import React from 'react';
import Icon from '../icon/Icon';

export default function AddTask({ onClick }) {
  return <div className="addJob jobCube" onClick={onClick}>
      <Icon icon="Plus" size={30} color="rgb(0, 123, 255)" />
      Add a new Task
  </div>;
};