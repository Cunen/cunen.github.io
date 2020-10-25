import React from 'react';
import { IconContext } from 'react-icons';
import { FaPlus } from 'react-icons/fa';

export default function AddJob({ openCreateModal }) {
  return <div className="addJob jobCube" onClick={openCreateModal}>
      <IconContext.Provider value={{ style: {fontSize: '100px', color: "rgb(0, 123, 255)"}}}>
        <div>
          <FaPlus />
        </div>
      </IconContext.Provider>
      Add a new job
  </div>;
};