import { Position, MazeCell, GameState } from '../types/game';

export class GameLogic {
  public static canMove(
    maze: MazeCell[][],
    from: Position,
    to: Position
  ): boolean {
    // Check bounds
    if (to.x < 0 || to.x >= maze[0].length || to.y < 0 || to.y >= maze.length) {
      return false;
    }

    const currentCell = maze[from.y][from.x];
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // Check if there's a wall blocking the movement
    if (dx === 1 && currentCell.walls.right) return false;
    if (dx === -1 && currentCell.walls.left) return false;
    if (dy === 1 && currentCell.walls.bottom) return false;
    if (dy === -1 && currentCell.walls.top) return false;

    return true;
  }

  public static movePlayer(
    gameState: GameState,
    direction: 'up' | 'down' | 'left' | 'right'
  ): GameState {
    if (!gameState.isPlaying || gameState.isPaused) {
      return gameState;
    }

    const { player, maze } = gameState;
    let newPosition: Position = { ...player };

    switch (direction) {
      case 'up':
        newPosition.y -= 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
    }

    if (this.canMove(maze, player, newPosition)) {
      const newGameState = {
        ...gameState,
        player: newPosition,
        moves: gameState.moves + 1
      };

      // Check if player reached the end
      if (newPosition.x === gameState.end.x && newPosition.y === gameState.end.y) {
        return {
          ...newGameState,
          isCompleted: true,
          isPlaying: false,
          score: this.calculateScore(newGameState)
        };
      }

      return newGameState;
    }

    return gameState;
  }

  public static calculateScore(gameState: GameState): number {
    const timeBonus = Math.max(0, 1000 - gameState.time);
    const moveBonus = Math.max(0, 500 - gameState.moves);
    const levelMultiplier = gameState.level;
    
    return Math.floor((timeBonus + moveBonus) * levelMultiplier);
  }

  public static getNextLevel(currentLevel: number): number {
    return Math.min(currentLevel + 1, 10); // Max 10 levels
  }

  public static playSound(type: 'move' | 'win' | 'start' | 'click'): void {
    // Create audio context for procedural sound generation
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioContext = new AudioContextClass();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'move':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        
        case 'win':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
          
        case 'start':
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'click':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
      }
    } catch (error) {
      // Silently fail if audio context is not available
      console.warn('Audio not available:', error);
    }
  }
}