
import React from 'react';
import { PPEItem } from '../types';

interface DetailsModalProps {
  item: PPEItem;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      <div className="bg-white/90 w-full max-w-4xl rounded-2xl mac-shadow overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        {/* Left Side: Image */}
        <div className="md:w-1/2 relative bg-gray-100">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-times text-white text-[10px]"></i>
          </button>
        </div>

        {/* Right Side: Info */}
        <div className="md:w-1/2 p-8 overflow-y-auto max-h-[80vh]">
          <div className="mb-6">
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">{item.category}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{item.name}</h2>
            <div className="mt-2 inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-mono">
              Standart: {item.gost}
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tavsif</h4>
              <p className="text-gray-700 leading-relaxed text-sm">{item.description}</p>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Material va Tarkib</h4>
              <p className="text-gray-700 text-sm">{item.materials}</p>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Texnik Parametrlar</h4>
              <div className="grid grid-cols-2 gap-4">
                {item.specs.map((spec, idx) => (
                  <div key={idx} className="bg-white/50 border border-gray-200 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{spec.label}</p>
                    <p className="text-xs text-gray-800 font-medium mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Ranglar</h4>
              <div className="flex gap-2">
                {item.colors.map((color, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-600 text-xs rounded-md">
                    {color}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30">
              Buyurtma Berish
            </button>
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-all">
              Hujjatni Yuklash (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
