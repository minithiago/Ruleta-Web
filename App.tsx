
import React, { useState, useCallback, useRef, useEffect } from 'react';
import WheelCanvas from './components/WheelCanvas';
import ParticipantList from './components/ParticipantList';
import { Participant, RouletteState } from './types';
import { COLORS, INITIAL_NAMES } from './constants';
import { generateWinnerMessage } from './services/geminiService';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(
    INITIAL_NAMES.map((name, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      color: COLORS[i % COLORS.length]
    }))
  );

  const [state, setState] = useState<RouletteState>({
    isSpinning: false,
    rotation: 0,
    winner: null,
    aiMessage: null
  });

  const rotationRef = useRef(0);
  const requestRef = useRef<number>();

  const addParticipant = (name: string) => {
    if (participants.length >= 24) {
      alert("Demasiados participantes (máximo 24)");
      return;
    }
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color: COLORS[participants.length % COLORS.length]
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const clearParticipants = () => {
    setParticipants([]);
  };

  const spin = useCallback(() => {
    if (state.isSpinning || participants.length < 2) return;

    setState(prev => ({ ...prev, isSpinning: true, winner: null, aiMessage: null }));

    const spinDuration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    const initialRotation = rotationRef.current;
    const totalRotation = initialRotation + (Math.PI * 2 * 5) + (Math.random() * Math.PI * 2);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function: cubic out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = initialRotation + (totalRotation - initialRotation) * easeOut;
      
      rotationRef.current = currentRotation;
      setState(prev => ({ ...prev, rotation: currentRotation }));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        const normalizedRotation = ((currentRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        const anglePerSlice = (Math.PI * 2) / participants.length;
        const winnerPointerAngle = (Math.PI * 1.5 - normalizedRotation) % (Math.PI * 2);
        const adjustedAngle = (winnerPointerAngle + (Math.PI * 2)) % (Math.PI * 2);
        const winnerIndex = Math.floor(adjustedAngle / anglePerSlice);
        
        const winner = participants[winnerIndex];
        
        setState(prev => ({ ...prev, isSpinning: false, winner }));
        
        if (winner) {
          generateWinnerMessage(winner.name).then(msg => {
            setState(prev => ({ ...prev, aiMessage: msg }));
          });
        }
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  }, [state.isSpinning, participants]);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Ruleta de la suerte
        </h1>
        <p className="text-indigo-200/60 max-w-lg mx-auto text-lg">
          Personaliza tu sorteo, gira la rueda y deja que el destino elija al ganador.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-7xl items-start">
        {/* Left: Settings */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <ParticipantList 
            participants={participants}
            onAdd={addParticipant}
            onRemove={removeParticipant}
            onClear={clearParticipants}
            isSpinning={state.isSpinning}
          />
        </div>

        {/* Center: Wheel */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center justify-center gap-8">
          <div className="relative">
             <WheelCanvas 
              participants={participants} 
              rotation={state.rotation} 
            />
            
            {/* Winner Announcement */}
            {state.winner && !state.isSpinning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="bg-black/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] animate-winner-reveal text-center max-w-sm pointer-events-auto">
                  <div className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-1">Tenemos Ganador</div>
                  <h3 className="text-4xl font-black text-white mb-3 break-words">
                    {state.winner.name}
                  </h3>
                  {state.aiMessage && (
                    <p className="text-indigo-200/80 italic text-sm border-t border-white/10 pt-4 leading-relaxed">
                      "{state.aiMessage}"
                    </p>
                  )}
                  <button 
                    onClick={() => setState(p => ({...p, winner: null, aiMessage: null}))}
                    className="mt-6 px-6 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-300 transition-all uppercase tracking-tighter"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={spin}
            disabled={state.isSpinning || participants.length < 2}
            className={`
              relative px-12 py-5 rounded-2xl font-black text-2xl transition-all duration-300
              flex items-center gap-4 overflow-hidden group
              ${state.isSpinning || participants.length < 2
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-[0_10px_40px_-10px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95'
              }
            `}
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <i className={`fa-solid ${state.isSpinning ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
            <span>{state.isSpinning ? 'GIRANDO...' : '¡GIRAR AHORA!'}</span>
          </button>

          {participants.length < 2 && (
            <p className="text-amber-400 animate-pulse font-medium text-sm">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              Añade al menos 2 nombres para jugar
            </p>
          )}
        </div>
      </main>

      {/* Footer / Features */}
      
    </div>
  );
};

export default App;
