import React from 'react';
import {IconContext} from 'react-icons';
import {FaUtensils, FaBed, FaShoppingCart} from 'react-icons/fa';

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
    name: 'Shopping',
    icon: <FaShoppingCart />,
  },
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