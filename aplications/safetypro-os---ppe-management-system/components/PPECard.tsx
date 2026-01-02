
import React from 'react';
import { PPEItem } from '../types';

interface PPECardProps {
  item: PPEItem;
  onClick: (item: PPEItem) => void;
}

const PPECard: React.FC<PPECardProps> = ({ item, onClick }) => {
  return (
    <div 
      className="group bg-white/40 hover:bg-white/60 border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer mac-shadow"
      onClick={() => onClick(item)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          {item.gost}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
        <p className="text-gray-500 text-xs mt-1 truncate">{item.category}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Material: {item.materials.slice(0, 20)}...</span>
          <button className="bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors">
            <i className="fas fa-arrow-right text-gray-600 text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PPECard;
