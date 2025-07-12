import React from 'react';
import { Heart, Star, User, Calendar } from 'lucide-react';

export default function ItemCard({ item, onSelect, showOwner = true }) {
  const conditionColors = {
    excellent: 'badge-green',
    good: 'badge-blue',
    fair: 'badge-purple',
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div 
      className="card-light overflow-hidden cursor-pointer hover-lift-light"
      onClick={handleClick}
    >
      {/* Image container */}
      <div className="relative overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Points badge */}
          <div className="badge-blue px-3 py-1 rounded-lg">
            <span className="text-sm font-semibold">{item.pointsValue} pts</span>
          </div>
          
          {/* Favorite button */}
          <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-300">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        
        {/* Condition badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`${conditionColors[item.condition]} px-3 py-1 rounded-lg text-sm font-medium`}>
            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
        </div>
        
        {/* Category and size */}
        <div className="flex items-center justify-between gap-2">
          <div className="badge-light px-3 py-1 rounded-lg">
            <span className="text-xs font-medium">{item.category}</span>
          </div>
          <div className="badge-light px-3 py-1 rounded-lg">
            <span className="text-xs font-medium">Size {item.size}</span>
          </div>
        </div>
        
        {/* Owner info */}
        {showOwner && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{item.ownerName.charAt(0)}</span>
              </div>
              <span className="text-gray-600 text-sm font-medium">{item.ownerName}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{new Date(item.dateUploaded).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}