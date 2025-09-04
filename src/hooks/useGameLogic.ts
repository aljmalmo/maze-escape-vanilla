import { useState, useEffect, useCallback } from 'react';
import { GameState, Position } from '../types/game';
import { MazeGenerator } from '../utils/mazeGenerator';
import { GameLogic } from '../utils/gameLogic';

const initialGameState: GameState = {
  maze: [],
  player: { x: 0, y: 0 },
  start: { x: 0, y: 0 },
  end: { x: 9, y: 9 },
  level: 1,
  score: 0,
  moves: 0,
  time: 0,
  isPlaying: false,
  isCompleted: false,
  isPaused: false,
  difficulty: 'easy'
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [startTime, setStartTime] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isCompleted) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          time: Math.floor((Date.now() - startTime) / 1000)
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isCompleted, startTime]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) return;

      const key = event.key.toLowerCase();
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;

      switch (key) {
        case 'arrowup':
        case 'w':
          direction = 'up';
          break;
        case 'arrowdown':
        case 's':
          direction = 'down';
          break;
        case 'arrowleft':
        case 'a':
          direction = 'left';
          break;
        case 'arrowright':
        case 'd':
          direction = 'right';
          break;
      }

      if (direction) {
        event.preventDefault();
        movePlayer(direction);
        GameLogic.playSound('move');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const generateNewMaze = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    const size = MazeGenerator.getDifficultySize(difficulty);
    const generator = new MazeGenerator(size.width, size.height);
    const maze = generator.generateMaze();
    
    const start: Position = { x: 0, y: 0 };
    const end: Position = { x: size.width - 1, y: size.height - 1 };

    return { maze, start, end, size };
  }, []);

  const startNewGame = useCallback((difficulty: 'easy' | 'medium' | 'hard' = 'easy') => {
    const { maze, start, end } = generateNewMaze(difficulty);
    
    setGameState({
      ...initialGameState,
      maze,
      player: start,
      start,
      end,
      difficulty,
      isPlaying: true,
      time: 0,
      moves: 0
    });
    
    setStartTime(Date.now());
    GameLogic.playSound('start');
  }, [generateNewMaze]);

  const nextLevel = useCallback(() => {
    const newLevel = GameLogic.getNextLevel(gameState.level);
    const { maze, start, end } = generateNewMaze(gameState.difficulty);
    
    setGameState(prev => ({
      ...prev,
      maze,
      player: start,
      start,
      end,
      level: newLevel,
      isPlaying: true,
      isCompleted: false,
      time: 0,
      moves: 0
    }));
    
    setStartTime(Date.now());
    GameLogic.playSound('start');
  }, [gameState.level, gameState.difficulty, generateNewMaze]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => {
      const newState = GameLogic.movePlayer(prev, direction);
      
      // Check if game is completed
      if (newState.isCompleted && !prev.isCompleted) {
        GameLogic.playSound('win');
      }
      
      return newState;
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      player: prev.start,
      moves: 0,
      time: 0,
      isCompleted: false,
      isPlaying: true,
      isPaused: false
    }));
    setStartTime(Date.now());
  }, []);

  return {
    gameState,
    startNewGame,
    nextLevel,
    movePlayer,
    pauseGame,
    resetGame
  };
};