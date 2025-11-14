import { useState, useEffect } from 'react';
import { Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BattleState } from '../App';

interface BattleQuestionProps {
  battleState: BattleState;
  onUpdateState: (newState: Partial<BattleState>) => void;
  onFinish: () => void;
}

const mockQuestions = [
  {
    subject: 'Matematika',
    question: 'Berapa hasil dari 15 × 8 + 20?',
    answers: ['140', '135', '150', '120'],
    correct: 0,
    difficulty: 2,
  },
  {
    subject: 'Matematika',
    question: 'Jika x + 5 = 12, maka nilai x adalah?',
    answers: ['5', '7', '8', '17'],
    correct: 1,
    difficulty: 1,
  },
  {
    subject: 'IPA',
    question: 'Proses fotosintesis terjadi pada bagian?',
    answers: ['Akar', 'Batang', 'Daun', 'Bunga'],
    correct: 2,
    difficulty: 1,
  },
  {
    subject: 'Bahasa Inggris',
    question: 'What is the past tense of "go"?',
    answers: ['Goed', 'Went', 'Gone', 'Going'],
    correct: 1,
    difficulty: 2,
  },
  {
    subject: 'Matematika',
    question: 'Luas lingkaran dengan jari-jari 7 cm adalah? (π = 22/7)',
    answers: ['154 cm²', '144 cm²', '164 cm²', '174 cm²'],
    correct: 0,
    difficulty: 3,
  },
  {
    subject: 'IPA',
    question: 'Planet terdekat dengan matahari adalah?',
    answers: ['Venus', 'Mars', 'Merkurius', 'Bumi'],
    correct: 2,
    difficulty: 1,
  },
  {
    subject: 'Matematika',
    question: '√144 = ?',
    answers: ['10', '11', '12', '13'],
    correct: 2,
    difficulty: 1,
  },
  {
    subject: 'Bahasa Indonesia',
    question: 'Kata baku dari "praktek" adalah?',
    answers: ['Praktik', 'Praktek', 'Praktis', 'Praktikan'],
    correct: 0,
    difficulty: 2,
  },
  {
    subject: 'IPA',
    question: 'H2O adalah rumus kimia dari?',
    answers: ['Oksigen', 'Hidrogen', 'Air', 'Udara'],
    correct: 2,
    difficulty: 1,
  },
  {
    subject: 'Matematika',
    question: '25% dari 200 adalah?',
    answers: ['25', '50', '75', '100'],
    correct: 1,
    difficulty: 2,
  },
];

const mockPlayers = [
  { name: 'You', avatar: '😊', position: 0, color: 'bg-blue-500' },
  { name: 'Budi', avatar: '👦', position: 0, color: 'bg-green-500' },
  { name: 'Siti', avatar: '👧', position: 0, color: 'bg-pink-500' },
];

export function BattleQuestion({ battleState, onUpdateState, onFinish }: BattleQuestionProps) {
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [players, setPlayers] = useState(mockPlayers);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const currentQuestion = mockQuestions[battleState.currentQuestion];
  const isCorrect = selectedAnswer === currentQuestion.correct;

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          if (selectedAnswer === null) {
            handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [selectedAnswer, battleState.currentQuestion]);

  useEffect(() => {
    // Simulate other players answering
    if (!showResult) {
      const delay1 = setTimeout(() => {
        setPlayers(prev => prev.map((p, i) => 
          i === 1 ? { ...p, position: p.position + 1 } : p
        ));
      }, Math.random() * 3000 + 1000);

      const delay2 = setTimeout(() => {
        setPlayers(prev => prev.map((p, i) => 
          i === 2 ? { ...p, position: p.position + 1 } : p
        ));
      }, Math.random() * 3000 + 1500);

      return () => {
        clearTimeout(delay1);
        clearTimeout(delay2);
      };
    }
  }, [battleState.currentQuestion, showResult]);

  const handleAutoSubmit = () => {
    setShowResult(true);
    setTimeout(nextQuestion, 2000);
  };

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === currentQuestion.correct;
    if (isCorrect) {
      const baseScore = currentQuestion.difficulty * 10;
      const timeBonus = Math.floor((timer / 30) * 10);
      const totalPoints = baseScore + timeBonus;

      onUpdateState({
        score: battleState.score + totalPoints,
        answers: [...battleState.answers, true],
      });

      setPlayers(prev => prev.map((p, i) => 
        i === 0 ? { ...p, position: p.position + 1 } : p
      ));

      // Create particle effect
      const newParticles = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    } else {
      onUpdateState({
        answers: [...battleState.answers, false],
      });
    }

    setTimeout(nextQuestion, 2500);
  };

  const nextQuestion = () => {
    if (battleState.currentQuestion >= 9) {
      // Calculate final opponent scores
      const opponentScores = [
        { name: 'Budi', score: Math.floor(Math.random() * 200) + 500, avatar: '👦' },
        { name: 'Siti', score: Math.floor(Math.random() * 200) + 400, avatar: '👧' },
      ];
      onUpdateState({ opponentScores });
      onFinish();
    } else {
      onUpdateState({
        currentQuestion: battleState.currentQuestion + 1,
      });
      setSelectedAnswer(null);
      setShowResult(false);
      setTimer(30);
    }
  };

  const getTimerColor = () => {
    if (timer > 15) return 'text-green-500';
    if (timer > 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <span className="text-gray-700">{currentQuestion.subject}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-700">
            Q {battleState.currentQuestion + 1}/10
          </div>
          <div className="flex gap-1">
            {[...Array(currentQuestion.difficulty)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Timer */}
      <motion.div
        animate={timer <= 10 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: timer <= 10 ? Infinity : 0 }}
        className={`flex items-center justify-center gap-2 mb-6 ${getTimerColor()}`}
      >
        <Clock className="w-5 h-5" />
        <span className="text-2xl">{String(timer).padStart(2, '0')}</span>
      </motion.div>

      {/* Race Track */}
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg relative overflow-hidden">
        <div className="text-sm text-gray-500 mb-3 text-center">Race Track</div>
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={index} className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{player.avatar}</span>
                <span className="text-sm text-gray-600">{player.name}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(player.position / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${player.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl">
          🏁
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
        <div className="text-gray-500 text-sm mb-2">QUESTION:</div>
        <div className="text-gray-800 text-lg">{currentQuestion.question}</div>
      </div>

      {/* Answers */}
      <div className="space-y-3 relative">
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ 
                opacity: 0, 
                scale: 0,
                x: particle.x,
                y: particle.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-400 rounded-full pointer-events-none"
            />
          ))}
        </AnimatePresence>

        {currentQuestion.answers.map((answer, index) => (
          <motion.button
            key={index}
            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
            onClick={() => handleAnswerClick(index)}
            disabled={selectedAnswer !== null}
            animate={
              selectedAnswer === index && !isCorrect
                ? { x: [-10, 10, -10, 10, 0] }
                : {}
            }
            transition={{ duration: 0.4 }}
            className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
              selectedAnswer === null
                ? 'bg-white hover:bg-blue-50 text-gray-800'
                : selectedAnswer === index
                ? isCorrect
                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                  : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                : showResult && index === currentQuestion.correct
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedAnswer === null
                  ? 'bg-blue-100 text-blue-600'
                  : selectedAnswer === index || (showResult && index === currentQuestion.correct)
                  ? 'bg-white/30 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span>{answer}</span>
            </div>
            {showResult && (selectedAnswer === index || index === currentQuestion.correct) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xl"
              >
                {index === currentQuestion.correct ? '✓' : '✗'}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Feedback Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 p-4 rounded-2xl text-center ${
              isCorrect
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {isCorrect ? (
              <>
                <div className="text-xl mb-1">🎉 Hebat!</div>
                <div className="text-sm">+{currentQuestion.difficulty * 10 + Math.floor((timer / 30) * 10)} poin</div>
              </>
            ) : (
              <>
                <div className="text-xl mb-1">Tidak apa-apa!</div>
                <div className="text-sm">Lanjut ke soal berikutnya! 💪</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
