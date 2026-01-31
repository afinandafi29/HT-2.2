import React from 'react';

const AppIcon = ({ id, title, icon, type, svg, url, onClick }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-[70px] h-[70px] rounded-[15px] cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
        style={type === 'image' ? { backgroundImage: `url('${icon}')`, backgroundSize: 'cover' } : {}}
        onClick={onClick}
      >
        {type === 'svg' && svg}
      </div>
      <div className="text-center text-xs mt-1 text-white font-['Work_Sans']">
        {title}
      </div>
    </div>
  );
};

export default AppIcon;