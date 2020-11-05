import React from 'react';
import { IconContext } from 'react-icons';
import { categoriesAndIcons } from '../categories/Categories';
import './icon.scss';

export default function Icon({ icon, size = 24, color = 'black' }) {
  const iconItem = categoriesAndIcons.find(entry => entry.name === icon);
  if (!iconItem) return <>404</>;
  return <IconContext.Provider value={{ style: {fontSize: size + 'px', color }}}>
    <div className="iconWrapper">
      {iconItem.icon}
    </div>
  </IconContext.Provider>
};