import { Bell, Award, Trophy, Globe, Users, BarChart3, Zap, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen } from '../App';

interface BattleHubProps {
  onNavigate: (screen: Screen) => void;
}

export function BattleHub({ onNavigate }: BattleHubProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-blue-500 to-blue-600 text-white p-6 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-300" />
          <h1 className="text-white">BATTLE ARENA</h1>
          <Trophy className="w-8 h-8 text-yellow-300" />
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
              3
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Award className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
      >
        <h3 className="text-white mb-4 text-center">Statistik Hari Ini</h3>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-2xl text-white">5</span>
            </div>
            <p className="text-white/80 text-sm">Menang</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-5 h-5 text-green-300" />
              <span className="text-2xl text-white">8</span>
            </div>
            <p className="text-white/80 text-sm">Battle</p>
          </div>
        </div>
      </motion.div>
      {/* Arena Cards */}
      <div className="space-y-4 mb-8">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('setup')}
          className="w-full bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-4"
          >
            <Globe className="w-16 h-16 text-white opacity-20" />
          </motion.div>
          <div className="relative z-10 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-10 h-10" />
              <div>
                <div className="text-white">CHALLENGE</div>
                <div className="text-white">THE WORLD</div>
              </div>
            </div>
            <p className="text-white/90 text-sm mt-2">Bertanding dengan pemain acak</p>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('setup')}
          className="w-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-4"
          >
            <Users className="w-16 h-16 text-white opacity-20" />
          </motion.div>
          <div className="relative z-10 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-10 h-10" />
              <div>
                <div className="text-white">CHALLENGE</div>
                <div className="text-white">FRIENDS</div>
              </div>
            </div>
            <p className="text-white/90 text-sm mt-2">Tantang teman-temanmu</p>
          </div>
        </motion.button>
      </div>

      {/* Leaderboard Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6" />
          <span className="text-white">Lihat Leaderboard</span>
        </div>
        <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
          →
        </div>
      </motion.button>

    </div>
  );
}
