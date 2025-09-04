import { MazeCell, Position } from '../types/game';

export class MazeGenerator {
  private maze: MazeCell[][];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maze = this.initializeMaze();
  }

  private initializeMaze(): MazeCell[][] {
    const maze: MazeCell[][] = [];
    for (let y = 0; y < this.height; y++) {
      maze[y] = [];
      for (let x = 0; x < this.width; x++) {
        maze[y][x] = {
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
          isPath: false
        };
      }
    }
    return maze;
  }

  public generateMaze(): MazeCell[][] {
    // Use recursive backtracking algorithm
    const stack: Position[] = [];
    const startPos: Position = { x: 0, y: 0 };
    
    this.maze[startPos.y][startPos.x].visited = true;
    stack.push(startPos);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this.getUnvisitedNeighbors(current);

      if (neighbors.length > 0) {
        // Choose random neighbor
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // Remove wall between current and next
        this.removeWall(current, next);
        
        // Mark next as visited and add to stack
        this.maze[next.y][next.x].visited = true;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    // Mark all cells as paths for rendering
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.maze[y][x].isPath = true;
      }
    }

    return this.maze;
  }

  private getUnvisitedNeighbors(pos: Position): Position[] {
    const neighbors: Position[] = [];
    const { x, y } = pos;

    // Check all four directions
    const directions = [
      { x: 0, y: -1 }, // top
      { x: 1, y: 0 },  // right
      { x: 0, y: 1 },  // bottom
      { x: -1, y: 0 }  // left
    ];

    for (const dir of directions) {
      const newX = x + dir.x;
      const newY = y + dir.y;

      if (
        newX >= 0 && newX < this.width &&
        newY >= 0 && newY < this.height &&
        !this.maze[newY][newX].visited
      ) {
        neighbors.push({ x: newX, y: newY });
      }
    }

    return neighbors;
  }

  private removeWall(current: Position, next: Position): void {
    const dx = current.x - next.x;
    const dy = current.y - next.y;

    if (dx === 1) { // Current is right of next
      this.maze[current.y][current.x].walls.left = false;
      this.maze[next.y][next.x].walls.right = false;
    } else if (dx === -1) { // Current is left of next
      this.maze[current.y][current.x].walls.right = false;
      this.maze[next.y][next.x].walls.left = false;
    } else if (dy === 1) { // Current is below next
      this.maze[current.y][current.x].walls.top = false;
      this.maze[next.y][next.x].walls.bottom = false;
    } else if (dy === -1) { // Current is above next
      this.maze[current.y][current.x].walls.bottom = false;
      this.maze[next.y][next.x].walls.top = false;
    }
  }

  public static getDifficultySize(difficulty: 'easy' | 'medium' | 'hard'): { width: number; height: number } {
    switch (difficulty) {
      case 'easy':
        return { width: 10, height: 10 };
      case 'medium':
        return { width: 15, height: 15 };
      case 'hard':
        return { width: 20, height: 20 };
      default:
        return { width: 10, height: 10 };
    }
  }
}