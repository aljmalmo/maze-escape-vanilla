import React from 'react';
import { MazeCell, Position } from '../types/game';

interface MazeBoardProps {
  maze: MazeCell[][];
  player: Position;
  start: Position;
  end: Position;
  cellSize?: number;
}

export const MazeBoard: React.FC<MazeBoardProps> = ({
  maze,
  player,
  start,
  end,
  cellSize = 20
}) => {
  if (!maze.length) return null;

  const width = maze[0].length;
  const height = maze.length;

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className="relative border-2 border-primary animate-glow-pulse"
        style={{
          width: width * cellSize,
          height: height * cellSize,
          background: 'hsl(var(--maze-path))'
        }}
      >
        {/* Render maze walls */}
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="absolute"
              style={{
                left: x * cellSize,
                top: y * cellSize,
                width: cellSize,
                height: cellSize
              }}
            >
              {/* Top wall */}
              {cell.walls.top && (
                <div
                  className="absolute bg-maze-wall"
                  style={{
                    top: 0,
                    left: 0,
                    width: cellSize,
                    height: 2,
                    boxShadow: '0 0 4px hsl(var(--maze-wall))'
                  }}
                />
              )}
              {/* Right wall */}
              {cell.walls.right && (
                <div
                  className="absolute bg-maze-wall"
                  style={{
                    top: 0,
                    right: 0,
                    width: 2,
                    height: cellSize,
                    boxShadow: '0 0 4px hsl(var(--maze-wall))'
                  }}
                />
              )}
              {/* Bottom wall */}
              {cell.walls.bottom && (
                <div
                  className="absolute bg-maze-wall"
                  style={{
                    bottom: 0,
                    left: 0,
                    width: cellSize,
                    height: 2,
                    boxShadow: '0 0 4px hsl(var(--maze-wall))'
                  }}
                />
              )}
              {/* Left wall */}
              {cell.walls.left && (
                <div
                  className="absolute bg-maze-wall"
                  style={{
                    top: 0,
                    left: 0,
                    width: 2,
                    height: cellSize,
                    boxShadow: '0 0 4px hsl(var(--maze-wall))'
                  }}
                />
              )}
            </div>
          ))
        )}

        {/* Start point */}
        <div
          className="absolute rounded-full bg-maze-start animate-glow-pulse z-10"
          style={{
            left: start.x * cellSize + 2,
            top: start.y * cellSize + 2,
            width: cellSize - 4,
            height: cellSize - 4,
            boxShadow: '0 0 8px hsl(var(--start-point))'
          }}
        />

        {/* End point */}
        <div
          className="absolute rounded-full bg-maze-end animate-glow-pulse z-10"
          style={{
            left: end.x * cellSize + 2,
            top: end.y * cellSize + 2,
            width: cellSize - 4,
            height: cellSize - 4,
            boxShadow: '0 0 8px hsl(var(--end-point))'
          }}
        />

        {/* Player */}
        <div
          className="absolute rounded-full bg-maze-player animate-player-bounce z-20 transition-all duration-200 ease-out"
          style={{
            left: player.x * cellSize + 3,
            top: player.y * cellSize + 3,
            width: cellSize - 6,
            height: cellSize - 6,
            boxShadow: '0 0 12px hsl(var(--player-glow))'
          }}
        />
      </div>
    </div>
  );
};