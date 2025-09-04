import React, { useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { MazeBoard } from './MazeBoard';
import { GameUI } from './GameUI';
import { Button } from './ui/button';
import { Card } from './ui/card';

export const MazeGame: React.FC = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  const {
    gameState,
    startNewGame,
    nextLevel,
    pauseGame,
    resetGame
  } = useGameLogic();

  const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    startNewGame(difficulty);
    setShowMenu(false);
  };

  const handleNewGame = () => {
    setShowMenu(true);
  };

  const getDifficultyInfo = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return { size: '10×10', description: 'Perfect for beginners' };
      case 'medium':
        return { size: '15×15', description: 'A good challenge' };
      case 'hard':
        return { size: '20×20', description: 'For maze masters' };
    }
  };

  // Calculate responsive cell size
  const getCellSize = () => {
    if (!gameState.maze.length) return 20;
    
    const mazeWidth = gameState.maze[0].length;
    const mazeHeight = gameState.maze.length;
    const screenWidth = Math.min(window.innerWidth - 40, 800);
    const screenHeight = Math.min(window.innerHeight - 200, 600);
    
    const cellSizeByWidth = Math.floor(screenWidth / mazeWidth);
    const cellSizeByHeight = Math.floor(screenHeight / mazeHeight);
    
    return Math.max(Math.min(cellSizeByWidth, cellSizeByHeight, 30), 12);
  };

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 bg-card/80 backdrop-blur-sm border-primary/30 animate-fade-in">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Maze Runner
              </h1>
              <p className="text-muted-foreground">
                Navigate through neon mazes in this cyberpunk adventure
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Choose Difficulty</h2>
              
              <div className="space-y-3">
                {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
                  const info = getDifficultyInfo(difficulty);
                  return (
                    <Button
                      key={difficulty}
                      onClick={() => handleStartGame(difficulty)}
                      variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                      className="w-full justify-between h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-semibold capitalize">{difficulty}</div>
                        <div className="text-sm opacity-80">{info.description}</div>
                      </div>
                      <div className="text-sm opacity-60">{info.size}</div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <div className="text-secondary font-medium">🎮 Controls</div>
                  <div>Arrow Keys or WASD</div>
                </div>
                <div className="space-y-1">
                  <div className="text-accent font-medium">🏆 Goal</div>
                  <div>Reach the pink exit</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="container mx-auto py-4 space-y-6">
        <GameUI
          gameState={gameState}
          onPause={pauseGame}
          onReset={resetGame}
          onNextLevel={nextLevel}
          onNewGame={handleNewGame}
        />
        
        <div className="flex justify-center">
          <MazeBoard
            maze={gameState.maze}
            player={gameState.player}
            start={gameState.start}
            end={gameState.end}
            cellSize={getCellSize()}
          />
        </div>
        
        {/* Mobile Controls */}
        <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-primary/20">
            <div className="grid grid-cols-3 gap-2 w-32">
              <div></div>
              <Button
                variant="outline"
                size="sm"
                onTouchStart={() => gameState.isPlaying && !gameState.isPaused && 
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
                className="aspect-square p-2"
              >
                ↑
              </Button>
              <div></div>
              
              <Button
                variant="outline"
                size="sm"
                onTouchStart={() => gameState.isPlaying && !gameState.isPaused && 
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
                className="aspect-square p-2"
              >
                ←
              </Button>
              <div></div>
              <Button
                variant="outline"
                size="sm"
                onTouchStart={() => gameState.isPlaying && !gameState.isPaused && 
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
                className="aspect-square p-2"
              >
                →
              </Button>
              
              <div></div>
              <Button
                variant="outline"
                size="sm"
                onTouchStart={() => gameState.isPlaying && !gameState.isPaused && 
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))}
                className="aspect-square p-2"
              >
                ↓
              </Button>
              <div></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};