/**
 * La Quento – Roll the Ball | Maze System
 * Handles level data, maze rendering, and level management
 */

// Built-in levels
const LEVELS = [
    {
        name: "First Steps",
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        start: { x: 1, y: 1 },
        cellSize: 50
    },
    {
        name: "Mind the Gap",
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        start: { x: 1, y: 1 },
        cellSize: 50
    },
    {
        name: "The Spiral",
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 2, 0, 0, 2, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 3, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        start: { x: 1, y: 1 },
        cellSize: 45
    },
    {
        name: "Crossroads",
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
            [1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        start: { x: 1, y: 1 },
        cellSize: 45
    },
    {
        name: "The Gauntlet",
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        start: { x: 1, y: 1 },
        cellSize: 45
    }
];

export class Maze {
    constructor() {
        this.currentLevelIndex = 0;
        this.level = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.animTime = 0;
    }

    /**
     * Get total number of levels
     */
    getTotalLevels() {
        return LEVELS.length;
    }

    /**
     * Load a level by index
     * @param {number} index - Level index
     * @param {number} canvasWidth - Canvas width for centering
     * @param {number} canvasHeight - Canvas height for centering
     */
    loadLevel(index, canvasWidth, canvasHeight) {
        if (index >= 0 && index < LEVELS.length) {
            this.currentLevelIndex = index;
            this.level = { ...LEVELS[index] };
            this.calculateOffset(canvasWidth, canvasHeight);
            return true;
        }
        return false;
    }

    /**
     * Get current level data
     */
    getCurrentLevel() {
        return this.level;
    }

    /**
     * Get current level name
     */
    getLevelName() {
        return this.level ? this.level.name : '';
    }

    /**
     * Get current level index
     */
    getLevelIndex() {
        return this.currentLevelIndex;
    }

    /**
     * Calculate offset to center maze
     */
    calculateOffset(canvasWidth, canvasHeight) {
        if (!this.level) return;

        const mazeWidth = this.level.grid[0].length * this.level.cellSize;
        const mazeHeight = this.level.grid.length * this.level.cellSize;

        this.offsetX = (canvasWidth - mazeWidth) / 2;
        this.offsetY = (canvasHeight - mazeHeight) / 2;
    }

    /**
     * Get ball start position in world coordinates
     */
    getStartPosition() {
        if (!this.level) return { x: 0, y: 0 };

        return {
            x: this.offsetX + this.level.start.x * this.level.cellSize + this.level.cellSize / 2,
            y: this.offsetY + this.level.start.y * this.level.cellSize + this.level.cellSize / 2
        };
    }

    /**
     * Get the grid
     */
    getGrid() {
        return this.level ? this.level.grid : [];
    }

    /**
     * Get cell size
     */
    getCellSize() {
        return this.level ? this.level.cellSize : 50;
    }

    /**
     * Get offsets
     */
    getOffsets() {
        return { x: this.offsetX, y: this.offsetY };
    }

    /**
     * Update animation time
     */
    update(deltaTime) {
        this.animTime += deltaTime;
    }

    /**
     * Render the maze
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        if (!this.level) return;

        const { grid, cellSize } = this.level;

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const x = this.offsetX + col * cellSize;
                const y = this.offsetY + row * cellSize;
                const cell = grid[row][col];

                switch (cell) {
                    case 0: // Path
                        this.renderPath(ctx, x, y, cellSize);
                        break;
                    case 1: // Wall
                        this.renderWall(ctx, x, y, cellSize);
                        break;
                    case 2: // Hole
                        this.renderPath(ctx, x, y, cellSize);
                        this.renderHole(ctx, x, y, cellSize);
                        break;
                    case 3: // Goal
                        this.renderPath(ctx, x, y, cellSize);
                        this.renderGoal(ctx, x, y, cellSize);
                        break;
                }
            }
        }
    }

    /**
     * Render a path cell
     */
    renderPath(ctx, x, y, size) {
        ctx.fillStyle = '#0d0d14';
        ctx.fillRect(x, y, size, size);

        // Subtle grid lines
        ctx.strokeStyle = 'rgba(0, 255, 204, 0.05)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    }

    /**
     * Render a wall cell
     */
    renderWall(ctx, x, y, size) {
        // Wall gradient
        const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
        gradient.addColorStop(0, '#1a1a26');
        gradient.addColorStop(1, '#15151f');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, size, size);

        // Border glow
        ctx.strokeStyle = 'rgba(0, 255, 204, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);

        // Inner highlight
        ctx.fillStyle = 'rgba(0, 255, 204, 0.03)';
        ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    }

    /**
     * Render a hole
     */
    renderHole(ctx, x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size * 0.35;

        // Pulsing glow
        const pulse = 0.5 + Math.sin(this.animTime * 3) * 0.3;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius * 2
        );
        glowGradient.addColorStop(0, `rgba(255, 51, 102, ${0.3 * pulse})`);
        glowGradient.addColorStop(0.5, `rgba(255, 51, 102, ${0.1 * pulse})`);
        glowGradient.addColorStop(1, 'rgba(255, 51, 102, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Hole itself
        const holeGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        holeGradient.addColorStop(0, '#000000');
        holeGradient.addColorStop(0.7, '#1a0010');
        holeGradient.addColorStop(1, '#330022');

        ctx.fillStyle = holeGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        ctx.strokeStyle = `rgba(255, 51, 102, ${0.5 + pulse * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    /**
     * Render the goal
     */
    renderGoal(ctx, x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size * 0.4;

        // Pulsing glow
        const pulse = 0.7 + Math.sin(this.animTime * 2) * 0.3;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius * 3
        );
        glowGradient.addColorStop(0, `rgba(0, 255, 136, ${0.4 * pulse})`);
        glowGradient.addColorStop(0.5, `rgba(0, 255, 136, ${0.15 * pulse})`);
        glowGradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Goal circle
        const goalGradient = ctx.createRadialGradient(
            centerX - radius * 0.2, centerY - radius * 0.2, 0,
            centerX, centerY, radius
        );
        goalGradient.addColorStop(0, '#66ffaa');
        goalGradient.addColorStop(0.5, '#00ff88');
        goalGradient.addColorStop(1, '#00b35c');

        ctx.fillStyle = goalGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
}
