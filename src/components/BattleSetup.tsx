import { useState } from 'react';
import { ArrowLeft, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { BattleConfig } from '../App';

interface BattleSetupProps {
  onBack: () => void;
  onStart: (config: BattleConfig) => void;
}

const mockFriends = [
  { id: '1', name: 'Budi', avatar: '👦', online: true },
  { id: '2', name: 'Siti', avatar: '👧', online: true },
  { id: '3', name: 'Andi', avatar: '🧑', online: false },
  { id: '4', name: 'Dewi', avatar: '👩', online: true },
  { id: '5', name: 'Rudi', avatar: '👨', online: true },
  { id: '6', name: 'Maya', avatar: '👧', online: false },
];

export function BattleSetup({ onBack, onStart }: BattleSetupProps) {
  const [mode, setMode] = useState<'1v1' | 'multiplayer'>('1v1');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      }
      const maxPlayers = mode === '1v1' ? 1 : 4;
      if (prev.length >= maxPlayers) return prev;
      return [...prev, friendId];
    });
  };

  const handleStart = () => {
    onStart({
      mode,
      arenaType: 'friends',
      opponents: selectedFriends,
      subject: subject || undefined,
      chapter: chapter || undefined,
    });
  };

  const canStart = selectedFriends.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </motion.button>
        <h1 className="text-gray-800">SETUP BATTLE</h1>
      </div>

      {/* Battle Mode */}
      <div className="mb-6">
        <h3 className="text-gray-700 mb-3">BATTLE MODE</h3>
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMode('1v1');
              if (selectedFriends.length > 1) {
                setSelectedFriends([selectedFriends[0]]);
              }
            }}
            className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
              mode === '1v1'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-700'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              mode === '1v1' ? 'border-white' : 'border-gray-300'
            }`}>
              {mode === '1v1' && <div className="w-3 h-3 bg-white rounded-full" />}
            </div>
            <span>1-on-1 Battle</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('multiplayer')}
            className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
              mode === 'multiplayer'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-700'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              mode === 'multiplayer' ? 'border-white' : 'border-gray-300'
            }`}>
              {mode === 'multiplayer' && <div className="w-3 h-3 bg-white rounded-full" />}
            </div>
            <span>Multiplayer (2-5 players)</span>
          </motion.button>
        </div>
      </div>

      {/* Select Opponent */}
      <div className="mb-6">
        <h3 className="text-gray-700 mb-3">
          PILIH LAWAN {mode === '1v1' ? '(Max 1)' : '(Max 4)'}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {mockFriends.map((friend) => (
            <motion.button
              key={friend.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFriend(friend.id)}
              className={`relative p-3 rounded-2xl transition-all ${
                selectedFriends.includes(friend.id)
                  ? 'bg-gradient-to-br from-green-400 to-blue-500 shadow-lg'
                  : 'bg-white'
              }`}
              disabled={!friend.online}
            >
              <div className={`text-3xl mb-1 ${!friend.online && 'opacity-30'}`}>
                {friend.avatar}
              </div>
              <div className={`text-xs ${
                selectedFriends.includes(friend.id) ? 'text-white' : 'text-gray-700'
              }`}>
                {friend.name}
              </div>
              <div className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${
                friend.online ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              {selectedFriends.includes(friend.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Optional Filters */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="text-gray-700 text-sm mb-2 block">
            SUBJECT <span className="text-gray-400">(Opsional)</span>
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white text-gray-700 border-2 border-gray-200 focus:border-blue-500 outline-none"
          >
            <option value="">Semua Mata Pelajaran</option>
            <option value="math">Matematika</option>
            <option value="science">IPA</option>
            <option value="english">Bahasa Inggris</option>
            <option value="indonesian">Bahasa Indonesia</option>
          </select>
        </div>

        <div>
          <label className="text-gray-700 text-sm mb-2 block">
            CHAPTER <span className="text-gray-400">(Opsional)</span>
          </label>
          <select
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white text-gray-700 border-2 border-gray-200 focus:border-blue-500 outline-none"
            disabled={!subject}
          >
            <option value="">Semua Chapter</option>
            <option value="algebra">Aljabar</option>
            <option value="geometry">Geometri</option>
            <option value="trigonometry">Trigonometri</option>
          </select>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={canStart ? { scale: 1.02 } : {}}
        whileTap={canStart ? { scale: 0.98 } : {}}
        onClick={handleStart}
        disabled={!canStart}
        className={`w-full p-6 rounded-3xl flex items-center justify-center gap-3 transition-all ${
          canStart
            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-2xl'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        <span className="text-white">START BATTLE!</span>
        <Rocket className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
