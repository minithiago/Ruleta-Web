
import React from 'react';
import { Participant } from '../types';

interface ParticipantListProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  isSpinning: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ 
  participants, 
  onAdd, 
  onRemove, 
  onClear,
  isSpinning
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col h-full max-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-users text-indigo-400"></i>
          Participantes ({participants.length})
        </h2>
        <button 
          onClick={onClear}
          disabled={isSpinning || participants.length === 0}
          className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          Limpiar todo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSpinning}
            placeholder="Escribe un nombre..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-gray-500"
          />
          <button 
            type="submit"
            disabled={isSpinning || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </form>

      <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {participants.length === 0 ? (
          <div className="text-center py-10 text-gray-400 italic">
            No hay participantes aún
          </div>
        ) : (
          participants.map((p) => (
            <div 
              key={p.id} 
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-lg p-3 group transition-all hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: p.color }}
                ></div>
                <span className="font-medium text-gray-200">{p.name}</span>
              </div>
              <button
                onClick={() => onRemove(p.id)}
                disabled={isSpinning}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all disabled:hidden"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))
        )}
      </div>
      
      <p className="mt-4 text-xs text-gray-400 italic">
        * Puedes añadir hasta 12 personas para una visualización óptima.
      </p>
    </div>
  );
};

export default ParticipantList;
