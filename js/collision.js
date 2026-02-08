/**
 * La Quento – Roll the Ball | Collision Detection System
 * Handles wall, hole, and goal collision detection and response
 */

export class CollisionSystem {
    constructor() {
        this.cellSize = 50;
    }

    /**
     * Set the cell size for collision calculations
     * @param {number} size - Cell size in pixels
     */
    setCellSize(size) {
        this.cellSize = size;
    }

    /**
     * Check and resolve wall collisions
     * @param {Ball} ball - The ball object
     * @param {Array} grid - The maze grid
     * @param {number} offsetX - Maze X offset
     * @param {number} offsetY - Maze Y offset
     * @returns {Object} Collision result { collided: boolean, axis: 'x'|'y'|null }
     */
    checkWallCollision(ball, grid, offsetX, offsetY) {
        const result = { collided: false, axis: null };

        // Get ball bounds
        const left = ball.x - ball.radius;
        const right = ball.x + ball.radius;
        const top = ball.y - ball.radius;
        const bottom = ball.y + ball.radius;

        // Check cells that the ball might be touching
        const startCol = Math.floor((left - offsetX) / this.cellSize);
        const endCol = Math.floor((right - offsetX) / this.cellSize);
        const startRow = Math.floor((top - offsetY) / this.cellSize);
        const endRow = Math.floor((bottom - offsetY) / this.cellSize);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (this.isWall(grid, row, col)) {
                    const wallX = offsetX + col * this.cellSize;
                    const wallY = offsetY + row * this.cellSize;

                    const collision = this.circleRectCollision(
                        ball.x, ball.y, ball.radius,
                        wallX, wallY, this.cellSize, this.cellSize
                    );

                    if (collision.collided) {
                        result.collided = true;

                        // Resolve collision
                        if (Math.abs(collision.overlapX) < Math.abs(collision.overlapY)) {
                            ball.x += collision.overlapX;
                            ball.bounce('x');
                            result.axis = 'x';
                        } else {
                            ball.y += collision.overlapY;
                            ball.bounce('y');
                            result.axis = 'y';
                        }
                    }
                }
            }
        }

        return result;
    }

    /**
     * Check if ball fell into a hole
     * @param {Ball} ball - The ball object
     * @param {Array} grid - The maze grid
     * @param {number} offsetX - Maze X offset
     * @param {number} offsetY - Maze Y offset
     * @returns {boolean} True if ball is in a hole
     */
    checkHoleCollision(ball, grid, offsetX, offsetY) {
        const col = Math.floor((ball.x - offsetX) / this.cellSize);
        const row = Math.floor((ball.y - offsetY) / this.cellSize);

        if (this.isHole(grid, row, col)) {
            // Check if ball center is within the hole
            const holeX = offsetX + col * this.cellSize + this.cellSize / 2;
            const holeY = offsetY + row * this.cellSize + this.cellSize / 2;
            const holeRadius = this.cellSize * 0.35;

            const dx = ball.x - holeX;
            const dy = ball.y - holeY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            return distance < holeRadius;
        }

        return false;
    }

    /**
     * Check if ball reached the goal
     * @param {Ball} ball - The ball object
     * @param {Array} grid - The maze grid
     * @param {number} offsetX - Maze X offset
     * @param {number} offsetY - Maze Y offset
     * @returns {boolean} True if ball is at the goal
     */
    checkGoalCollision(ball, grid, offsetX, offsetY) {
        const col = Math.floor((ball.x - offsetX) / this.cellSize);
        const row = Math.floor((ball.y - offsetY) / this.cellSize);

        if (this.isGoal(grid, row, col)) {
            const goalX = offsetX + col * this.cellSize + this.cellSize / 2;
            const goalY = offsetY + row * this.cellSize + this.cellSize / 2;
            const goalRadius = this.cellSize * 0.4;

            const dx = ball.x - goalX;
            const dy = ball.y - goalY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            return distance < goalRadius;
        }

        return false;
    }

    /**
     * Circle-rectangle collision detection
     * @returns {Object} { collided: boolean, overlapX: number, overlapY: number }
     */
    circleRectCollision(cx, cy, radius, rx, ry, rw, rh) {
        // Find closest point on rectangle to circle center
        const closestX = Math.max(rx, Math.min(cx, rx + rw));
        const closestY = Math.max(ry, Math.min(cy, ry + rh));

        // Calculate distance
        const dx = cx - closestX;
        const dy = cy - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
            // Calculate overlap
            const overlap = radius - distance;
            const angle = Math.atan2(dy, dx);

            return {
                collided: true,
                overlapX: Math.cos(angle) * overlap,
                overlapY: Math.sin(angle) * overlap
            };
        }

        return { collided: false, overlapX: 0, overlapY: 0 };
    }

    /**
     * Check if a cell is a wall
     */
    isWall(grid, row, col) {
        if (row < 0 || row >= grid.length) return true; // Out of bounds = wall
        if (col < 0 || col >= grid[0].length) return true;
        return grid[row][col] === 1;
    }

    /**
     * Check if a cell is a hole
     */
    isHole(grid, row, col) {
        if (row < 0 || row >= grid.length) return false;
        if (col < 0 || col >= grid[0].length) return false;
        return grid[row][col] === 2;
    }

    /**
     * Check if a cell is the goal
     */
    isGoal(grid, row, col) {
        if (row < 0 || row >= grid.length) return false;
        if (col < 0 || col >= grid[0].length) return false;
        return grid[row][col] === 3;
    }
}
