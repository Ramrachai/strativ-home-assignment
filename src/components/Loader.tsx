import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-black tracking-wider mb-4">Loading</p>
      <div className="flex w-20 items-center justify-center">
        <div className="w-6 h-[3px] bg-lime-500 animate-loader rounded-[5px] mx-1" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-6 h-[3px] bg-lime-500 animate-loader rounded-[5px] mx-1" style={{ animationDelay: '0.4s' }}></div>
        <div className="w-6 h-[3px] bg-lime-500 animate-loader rounded-[5px] mx-1" style={{ animationDelay: '0.6s' }}></div>
        <div className="w-6 h-[3px] bg-lime-500 animate-loader rounded-[5px] mx-1" style={{ animationDelay: '0.8s' }}></div>
      </div>
    </div>
  );
};

export default Loader;
