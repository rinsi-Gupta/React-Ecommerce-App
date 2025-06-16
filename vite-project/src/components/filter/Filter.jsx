import React, { useContext, useState } from 'react';
import { FaSearch, FaRedo } from 'react-icons/fa';
import myContext from '../../context/data/myContext';

function Filter() {
  const context = useContext(myContext);
  const {
    mode,
    filterType,
    setFilterType,
    product,
    setSearchkey,
    filterColor,
    setFilterColor,
    setFilterPrice,
  } = context;

  const [price, setPrice] = useState(10000);
  const maxPrice = 10000;
  const uniqueCategories = [...new Set(product.map(item => item.category))];

  const handlePriceChange = (e) => {
    const val = parseInt(e.target.value);
    setPrice(val);
    setFilterPrice(`0-${val}`);
  };

  return (
    <div className="w-full md:w-64 bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 p-5 rounded-3xl shadow-2xl border border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">🎯 Filters</h2>
        <button
          onClick={() => {
            setFilterType('');
            setPrice(maxPrice);
            setFilterPrice('');
            setSearchkey('');
            setFilterColor('');
          }}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-semibold"
        >
          <FaRedo className="text-xs" />
          Reset
        </button>
      </div>

      {/* Search */}
      {/* <div className="mb-6 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">🔍 Search</label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => setSearchkey(e.target.value)}
            className="w-full pl-10 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
          />
        </div>
      </div> */}

      {/* Category */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">📂 Category</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          💰 Max Price: <span className="font-semibold text-blue-700 dark:text-blue-300">₹{price}</span>
        </label>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={price}
          onChange={handlePriceChange}
          className="w-full h-2 bg-blue-300 dark:bg-blue-800 rounded-full appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default Filter;
