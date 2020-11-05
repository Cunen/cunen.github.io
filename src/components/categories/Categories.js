import React from 'react';
import {IconContext} from 'react-icons';
import {FaUtensils, FaBed, FaShoppingCart, FaToilet, FaHiking, FaCouch, FaHome, FaPlus} from 'react-icons/fa';

export const categoriesAndIcons = [
  {
    name: 'Bedroom',
    icon: <FaBed />,
    isCategory: true,
  },
  {
    name: 'Kitchen',
    icon: <FaUtensils />,
    isCategory: true,
  },
  {
    name: 'Living room',
    icon: <FaCouch />,
    isCategory: true,
  },
  {
    name: 'House',
    icon: <FaHome />,
    isCategory: true,
  },
  {
    name: 'Shopping',
    icon: <FaShoppingCart />,
    isCategory: true,
  },
  {
    name: 'Toilet',
    icon: <FaToilet />,
    isCategory: true,
  },
  {
    name: 'Outside',
    icon: <FaHiking />,
    isCategory: true,
  },
  {
    name: 'Plus',
    icon: <FaPlus />,
  }
]

export function useCategories() {
  const categories = categoriesAndIcons.filter(i => i.isCategory);
  return { categories };
};