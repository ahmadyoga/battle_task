import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { BattleConfig } from '../App';

interface WaitingRoomProps {
  config: BattleConfig;
  onCancel: () => void;
  onStart: () => void;
}

const mockPlayers = [
  { id: '1', name: 'You', avatar: '😊', ready: false },
  { id: '2', name: 'Budi', avatar: '👦', ready: false },
  { id: '3', name: 'Siti', avatar: '👧', ready: false },
];

export function WaitingRoom({ config, onCancel, onStart }: WaitingRoomProps) {
  const [players, setPlayers] = useState(mockPlayers);
  const [countdown, setCountdown] = useState(30);
  const [isSliding, setIsSliding] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate other players getting ready
    const readyTimer1 = setTimeout(() => {
      setPlayers(prev => prev.map((p, i) => i === 1 ? { ...p, ready: true } : p));
    }, 2000);

    const readyTimer2 = setTimeout(() => {
      setPlayers(prev => prev.map((p, i) => i === 2 ? { ...p, ready: true } : p));
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(readyTimer1);
      clearTimeout(readyTimer2);
    };
  }, []);

  useEffect(() => {
    if (players.every(p => p.ready)) {
      setTimeout(() => {
        onStart();
      }, 2000);
    }
  }, [players, onStart]);

  const handleSlide = (e: React.MouseEvent | React.TouchEvent) => {
    if (players[0].ready || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(clientX - rect.left, rect.width - 60));
    
    setSlidePosition(position);

    if (position > rect.width - 80) {
      setPlayers(prev => prev.map((p, i) => i === 0 ? { ...p, ready: true } : p));
      setIsSliding(false);
    }
  };

  const readyCount = players.filter(p => p.ready).length;
  const totalPlayers = players.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-blue-500 to-blue-600 text-white p-6 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-white mb-2">WAITING ROOM</h1>
        <motion.div
          animate={{ scale: countdown <= 10 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1, repeat: countdown <= 10 ? Infinity : 0 }}
          className={`text-2xl ${countdown <= 10 ? 'text-red-300' : 'text-white'}`}
        >
          Starting in: {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
        </motion.div>
      </motion.div>

      {/* Players Ready Count */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-6 text-center"
      >
        <div className="text-sm text-white/80 mb-1">PLAYERS READY</div>
        <div className="text-3xl text-white">{readyCount}/{totalPlayers}</div>
      </motion.div>

      {/* Player List */}
      <div className="flex-1 space-y-3 mb-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={player.ready ? {} : { rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl"
              >
                {player.avatar}
              </motion.div>
              <span className="text-white">{player.name}</span>
            </div>
            <div>
              {player.ready ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 text-green-300"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>READY</span>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center gap-2 text-white/60"
                >
                  <Loader2 className="w-6 h-6" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ready Slider */}
      {!players[0].ready && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div 
            ref={sliderRef}
            className="bg-white/20 backdrop-blur-md rounded-full p-2 relative h-16 overflow-hidden"
          >
            <div className="absolute inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-30" 
                 style={{ width: `${(slidePosition / 300) * 100}%` }} 
            />
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 240 }}
              dragElastic={0.1}
              onDrag={(e) => handleSlide(e as any)}
              className="absolute left-2 top-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
              style={{ x: slidePosition }}
            >
              →
            </motion.div>
            <div className="text-center text-white pt-3 select-none pointer-events-none">
              Slide to Ready →
            </div>
          </div>
        </motion.div>
      )}

      {/* Cancel Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCancel}
        className="w-full p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white"
      >
        Cancel Battle
      </motion.button>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 400, opacity: 0 }}
            animate={{ 
              y: 900, 
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
