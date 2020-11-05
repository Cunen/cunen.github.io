import React from 'react';
import Icon from '../icon/Icon';

export default function AddJob({ openCreateModal }) {
  return <div className="addJob jobCube" onClick={openCreateModal}>
      <Icon icon="Plus" size={30} color="rgb(0, 123, 255)" />
      Add a new job
  </div>;
};