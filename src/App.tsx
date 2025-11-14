import { useState } from 'react';
import { BattleHub } from './components/BattleHub';
import { BattleSetup } from './components/BattleSetup';
import { WaitingRoom } from './components/WaitingRoom';
import { BattleQuestion } from './components/BattleQuestion';
import { BattleResults } from './components/BattleResults';

export type Screen = 'hub' | 'setup' | 'waiting' | 'battle' | 'results';

export interface BattleConfig {
  mode: '1v1' | 'multiplayer';
  arenaType: 'world' | 'friends';
  opponents: string[];
  subject?: string;
  chapter?: string;
}

export interface BattleState {
  config: BattleConfig;
  currentQuestion: number;
  score: number;
  answers: boolean[];
  opponentScores: { name: string; score: number; avatar: string }[];
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('hub');
  const [battleConfig, setBattleConfig] = useState<BattleConfig>({
    mode: '1v1',
    arenaType: 'world',
    opponents: [],
  });
  const [battleState, setBattleState] = useState<BattleState>({
    config: battleConfig,
    currentQuestion: 0,
    score: 0,
    answers: [],
    opponentScores: [],
  });

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const startBattle = (config: BattleConfig) => {
    setBattleConfig(config);
    setBattleState({
      config,
      currentQuestion: 0,
      score: 0,
      answers: [],
      opponentScores: [],
    });
    setCurrentScreen('waiting');
  };

  const startQuestions = () => {
    setCurrentScreen('battle');
  };

  const updateBattleState = (newState: Partial<BattleState>) => {
    setBattleState(prev => ({ ...prev, ...newState }));
  };

  const finishBattle = () => {
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="mx-auto max-w-md min-h-screen bg-white shadow-xl">
        {currentScreen === 'hub' && (
          <BattleHub onNavigate={navigateTo} />
        )}
        {currentScreen === 'setup' && (
          <BattleSetup 
            onBack={() => navigateTo('hub')} 
            onStart={startBattle}
          />
        )}
        {currentScreen === 'waiting' && (
          <WaitingRoom 
            config={battleConfig}
            onCancel={() => navigateTo('hub')}
            onStart={startQuestions}
          />
        )}
        {currentScreen === 'battle' && (
          <BattleQuestion 
            battleState={battleState}
            onUpdateState={updateBattleState}
            onFinish={finishBattle}
          />
        )}
        {currentScreen === 'results' && (
          <BattleResults 
            battleState={battleState}
            onHome={() => navigateTo('hub')}
            onRematch={() => startBattle(battleConfig)}
            onLeaderboard={() => navigateTo('hub')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
