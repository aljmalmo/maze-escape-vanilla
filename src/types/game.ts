export interface Position {
  x: number;
  y: number;
}

export interface MazeCell {
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isPath: boolean;
}

export interface GameState {
  maze: MazeCell[][];
  player: Position;
  start: Position;
  end: Position;
  level: number;
  score: number;
  moves: number;
  time: number;
  isPlaying: boolean;
  isCompleted: boolean;
  isPaused: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PowerUp {
  position: Position;
  type: 'hint' | 'speed' | 'teleport';
  active: boolean;
}

export interface GameSettings {
  mazeSize: { width: number; height: number };
  powerUpsEnabled: boolean;
  soundEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}