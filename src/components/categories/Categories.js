import React from 'react';
import {IconContext} from 'react-icons';
import {FaUtensils, FaBed, FaShoppingCart, FaToilet, FaHiking, FaCouch, FaHome} from 'react-icons/fa';

const categories = [
  {
    name: 'Bedroom',
    icon: <FaBed />,
  },
  {
    name: 'Kitchen',
    icon: <FaUtensils />,
  },
  {
    name: 'Living room',
    icon: <FaCouch />,
  },
  {
    name: 'House',
    icon: <FaHome />,
  },
  {
    name: 'Shopping',
    icon: <FaShoppingCart />,
  },
  {
    name: 'Toilet',
    icon: <FaToilet />,
  },
  {
    name: 'Outside',
    icon: <FaHiking />,
  }
]

export function useCategories() {
  const getCategoryIcon = (category, size = 24, color = 'black') => {
    const cat = categories.find(entry => entry.name === category);
    if (!cat) return <>404</>;
    return <IconContext.Provider value={{ style: {fontSize: size + 'px', color }}}>
      <div>
        {cat.icon}
      </div>
    </IconContext.Provider>
  }


  return { categories, getCategoryIcon };
};