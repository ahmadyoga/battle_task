import { useEffect, useState } from 'react';
import { Trophy, Home, RotateCcw, BarChart3, Zap, Target, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { BattleState } from '../App';

interface BattleResultsProps {
  battleState: BattleState;
  onHome: () => void;
  onRematch: () => void;
  onLeaderboard: () => void;
}

export function BattleResults({ battleState, onHome, onRematch, onLeaderboard }: BattleResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  const correctAnswers = battleState.answers.filter(a => a).length;
  const accuracy = Math.round((correctAnswers / 10) * 100);
  const avgSpeed = 12;

  // Sort players by score
  const allPlayers = [
    { name: 'You', score: battleState.score, avatar: '😊' },
    ...battleState.opponentScores,
  ].sort((a, b) => b.score - a.score);

  const yourRank = allPlayers.findIndex(p => p.name === 'You') + 1;
  const isWinner = yourRank === 1;

  useEffect(() => {
    setShowConfetti(true);
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#3B82F6', '#8B5CF6', '#F97316', '#FBBF24', '#22C55E', '#EF4444'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.5,
    }));
    setConfettiPieces(pieces);
  }, []);

  const getStarCount = () => {
    if (accuracy >= 90) return 5;
    if (accuracy >= 75) return 4;
    if (accuracy >= 60) return 3;
    if (accuracy >= 40) return 2;
    return 1;
  };

  const getMessage = () => {
    if (isWinner) return ['VICTORY!', 'KAMU JUARA!', '🏆'];
    if (yourRank === 2) return ['GREAT JOB!', 'Bagus Sekali!', '🥈'];
    if (yourRank === 3) return ['GOOD EFFORT!', 'Mantap!', '🥉'];
    return ['KEEP TRYING!', 'Semangat! Coba lagi!', '💪'];
  };

  const [title, subtitle, emoji] = getMessage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-blue-500 to-blue-600 text-white p-6 pb-8 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && confettiPieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{ y: -100, x: `${piece.x}%`, rotate: 0 }}
          animate={{ 
            y: 1000, 
            rotate: 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: "easeIn",
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}

      {/* Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-3">{emoji}</div>
        <motion.h1
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-white mb-2"
        >
          {title}
        </motion.h1>
        <p className="text-white/90 text-xl">{subtitle}</p>
      </motion.div>

      {/* Winner Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-3xl p-8 mb-6 text-center shadow-2xl ${
          isWinner
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
            : 'bg-white/20 backdrop-blur-md'
        }`}
      >
        <div className="text-4xl mb-3">{yourRank === 1 ? '👑' : yourRank === 2 ? '🥈' : yourRank === 3 ? '🥉' : '😊'}</div>
        <div className="text-white mb-2">
          {yourRank === 1 ? 'WINNER' : `RANK #${yourRank}`}
        </div>
        <div className="text-white mb-2">YOU</div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="text-5xl text-white mb-3"
        >
          {battleState.score}
        </motion.div>
        <div className="flex justify-center gap-1">
          {[...Array(getStarCount())].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              ⭐
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Other Players */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6"
      >
        <h3 className="text-white mb-4 text-center">OTHER PLAYERS</h3>
        <div className="space-y-3">
          {allPlayers.filter(p => p.name !== 'You').map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{player.avatar}</div>
                <span className="text-white">{player.name}</span>
              </div>
              <span className="text-white">{player.score} pts</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Your Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6"
      >
        <h3 className="text-white mb-4 text-center">YOUR STATS</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-300" />
              <span className="text-white">Correct</span>
            </div>
            <span className="text-white">{correctAnswers}/10</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-300" />
              <span className="text-white">Avg Speed</span>
            </div>
            <span className="text-white">{avgSpeed}s</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white">Accuracy</span>
            </div>
            <span className="text-white">{accuracy}%</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2"
          >
            <Home className="w-6 h-6" />
            <span className="text-sm text-white">Home</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRematch}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-sm text-white">Rematch</span>
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLeaderboard}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-4 flex items-center justify-center gap-2"
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-white">View Leaderboard</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
