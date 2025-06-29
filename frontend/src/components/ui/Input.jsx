// frontend/src/components/ui/Input.jsx
import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, name, id, className = '', ...props }) => {
  return (
    <input
      type={type}
      name={name}
      id={id || name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${className}`}
      {...props}
    />
  );
};

export default Input;
