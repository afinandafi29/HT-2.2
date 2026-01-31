import React, { useEffect, useRef } from 'react';

const SearchContainer = ({ onSearchChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="absolute top-[40px] left-[20px] right-[20px] bg-[#181818] p-[10px] rounded-[50px] z-10">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search Apps or YouTube"
        className="w-full p-[10px] rounded-[5px] bg-[#121212] text-white border-none text-base"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchContainer;