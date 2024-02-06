import React from 'react';

const Badge = ({ value }) => {
  return (
    <div className="relative h-4 w-4 top-0 right-0">
      <span className="badge pulsate">{value}</span>
      <span className="absolute top-0 right-0 w-full h-full rounded-full bg-red-400 animate-pulse"></span>
    </div>
  );
};

export default Badge;
