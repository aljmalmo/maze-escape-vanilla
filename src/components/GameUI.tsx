import React from 'react';
import { GameState } from '../types/game';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameUIProps {
  gameState: GameState;
  onPause: () => void;
  onReset: () => void;
  onNextLevel: () => void;
  onNewGame: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  onPause,
  onReset,
  onNextLevel,
  onNewGame
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="text-2xl font-bold text-primary">{gameState.level}</div>
          <div className="text-sm text-muted-foreground">Level</div>
        </Card>
        
        <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="text-2xl font-bold text-secondary">{gameState.score}</div>
          <div className="text-sm text-muted-foreground">Score</div>
        </Card>
        
        <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="text-2xl font-bold text-accent">{formatTime(gameState.time)}</div>
          <div className="text-sm text-muted-foreground">Time</div>
        </Card>
        
        <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="text-2xl font-bold text-foreground">{gameState.moves}</div>
          <div className="text-sm text-muted-foreground">Moves</div>
        </Card>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {gameState.isPlaying && !gameState.isCompleted && (
          <Button
            onClick={onPause}
            variant="secondary"
            className="min-w-[100px]"
          >
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
        
        <Button
          onClick={onReset}
          variant="outline"
          className="min-w-[100px]"
          disabled={!gameState.isPlaying && !gameState.isCompleted}
        >
          Reset
        </Button>
        
        <Button
          onClick={onNewGame}
          variant="default"
          className="min-w-[100px]"
        >
          New Game
        </Button>
      </div>

      {/* Game Over / Level Complete */}
      {gameState.isCompleted && (
        <Card className="p-6 text-center bg-card/80 backdrop-blur-sm border-primary/40 animate-fade-in">
          <div className="space-y-4">
            <div className="text-3xl font-bold text-primary animate-victory-celebration">
              🎉 Level Complete! 🎉
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-secondary">{gameState.score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent">{formatTime(gameState.time)}</div>
                <div className="text-sm text-muted-foreground">Completion Time</div>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{gameState.moves}</div>
                <div className="text-sm text-muted-foreground">Total Moves</div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button
                onClick={onNextLevel}
                variant="default"
                className="min-w-[120px]"
              >
                Next Level
              </Button>
              <Button
                onClick={onNewGame}
                variant="outline"
                className="min-w-[120px]"
              >
                New Game
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      {!gameState.isPlaying && !gameState.isCompleted && (
        <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-primary">How to Play</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p><strong className="text-secondary">🎯 Goal:</strong> Navigate from green start to pink goal</p>
                <p><strong className="text-secondary">🎮 Controls:</strong> Arrow Keys or WASD</p>
              </div>
              <div className="space-y-2">
                <p><strong className="text-secondary">⚡ Score:</strong> Based on time and moves</p>
                <p><strong className="text-secondary">🏆 Levels:</strong> Progressively harder mazes</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Pause Overlay */}
      {gameState.isPaused && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-8 text-center bg-card/90 backdrop-blur-sm border-primary/40">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">Game Paused</h2>
              <p className="text-muted-foreground">Press Resume to continue playing</p>
              <Button onClick={onPause} variant="default" size="lg">
                Resume Game
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};