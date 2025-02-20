import React, { useReducer, useEffect } from 'react';
import './App.css';

// Определяем тип карточки
interface Card {
  color: string;
  matched: boolean;
}

// Определяем тип состояния игры
interface GameState {
  deck: Card[];
  flipped: number[];
  matched: string[];
  turns: number;
  score: number;
  pendingReset: boolean;
  gameOver: boolean;
}

// Определяем типы действий
type Action =
  | { type: 'FLIP_CARD'; index: number }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET_FLIPPED' }
  | { type: 'INCREMENT_TURN' }
  | { type: 'RESET_GAME' };

// Генерация колоды
const generateDeck = (): Card[] => {
  const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2'];
  const deck: Card[] = [];
  for (let color of colors) {
    deck.push({ color, matched: false });
    deck.push({ color, matched: false });
  }
  return deck.sort(() => Math.random() - 0.5);
};

// Начальное состояние
const initialState: GameState = {
  deck: generateDeck(),
  flipped: [],
  matched: [],
  turns: 0,
  score: 0,
  pendingReset: false,
  gameOver: false,
};

// Редюсер для управления состоянием игры
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'FLIP_CARD':
      if (
        state.flipped.length < 2 &&
        !state.flipped.includes(action.index) &&
        !state.matched.includes(state.deck[action.index].color)
      ) {
        return { ...state, flipped: [...state.flipped, action.index] };
      }
      return state;
    case 'CHECK_MATCH':
      const [first, second] = state.flipped;
      if (state.deck[first].color === state.deck[second].color) {
        const newMatched = [...state.matched, state.deck[first].color];
        const isGameOver = newMatched.length === state.deck.length / 2;
        return {
          ...state,
          matched: newMatched,
          score: isGameOver ? state.score + 1 : state.score,
          flipped: [],
          pendingReset: false,
          gameOver: isGameOver,
        };
      } else {
        return { ...state, pendingReset: true };
      }
    case 'RESET_FLIPPED':
      return { ...state, flipped: [], pendingReset: false };
    case 'INCREMENT_TURN':
      return { ...state, turns: state.turns + 1 };
    case 'RESET_GAME':
      return {
        ...initialState,
        deck: generateDeck(),
      };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Проверка на совпадение перевернутых карточек
  useEffect(() => {
    if (state.flipped.length === 2) {
      dispatch({ type: 'CHECK_MATCH' });
      dispatch({ type: 'INCREMENT_TURN' });
    }
  }, [state.flipped]);

  // Таймер для сброса перевернутых карточек
  useEffect(() => {
    if (state.pendingReset) {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_FLIPPED' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.pendingReset]);

  // Обработка клика на карточку
  const handleCardClick = (index: number) => {
    if (!state.gameOver && state.flipped.length < 2 && !state.flipped.includes(index)) {
      dispatch({ type: 'FLIP_CARD', index });
    }
  };

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="App">
      <h1>Memory Game</h1>
      <div className="info">
        <p>Очки: {state.score}</p>
        <p>Попытки: {state.turns}/15</p>
      </div>
      <div className="deck">
        {state.deck.map((card, index) => (
          <div
            key={index}
            className={`card ${state.flipped.includes(index) || state.matched.includes(card.color) ? 'flipped show' : ''}`}
            style={{ '--card-color': card.color } as React.CSSProperties}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      {state.gameOver && (
        <>
          <div className="overlay" />
          <div className="game-over">
            <h2>Вы выиграли!</h2>
            <button onClick={handlePlayAgain}>Заново</button>
          </div>
        </>
      )}
      {!state.gameOver && state.turns >= 15 && (
        <>
          <div className="overlay" />
          <div className="game-over">
            <h2>Игра окончена!</h2>
            <button onClick={handlePlayAgain}>Заново</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
