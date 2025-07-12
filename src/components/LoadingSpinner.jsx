import React from 'react';

export default function LoadingSpinner({ size = 'medium', color = 'text-blue-500' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="loading-light">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}