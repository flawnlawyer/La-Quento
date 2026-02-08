/**
 * La Quento – Roll the Ball | Main Game Controller
 * Orchestrates all game systems and manages the game loop
 */

import { Ball } from './physics.js';
import { Maze } from './maze.js';
import { CollisionSystem } from './collision.js';
import { Controls } from './controls.js';
import { UIManager } from './ui.js';
import { AudioManager } from './audio.js';

// Game states
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    DEATH: 'death',
    WIN: 'win',
    GAMEOVER: 'gameover',
    VICTORY: 'victory'
};

class Game {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Game dimensions
        this.width = 800;
        this.height = 600;

        // Initialize canvas
        this.initCanvas();

        // Core systems
        this.ball = null;
        this.maze = new Maze();
        this.collision = new CollisionSystem();
        this.controls = new Controls();
        this.ui = new UIManager();
        this.audio = new AudioManager();

        // Game state
        this.state = GameState.MENU;
        this.lives = 3;
        this.currentLevel = 0;
        this.levelStartTime = 0;
        this.totalGameTime = 0;

        // Animation
        this.lastTime = 0;
        this.animationId = null;

        // Death animation
        this.deathAnimation = {
            active: false,
            progress: 0,
            duration: 500
        };

        // Win animation
        this.winAnimation = {
            active: false,
            progress: 0,
            duration: 1000
        };

        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleResize = this.handleResize.bind(this);

        // Event listeners
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Initialize canvas size and scaling
     */
    initCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.handleResize();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scale to fit
        const scaleX = containerWidth / this.width;
        const scaleY = containerHeight / this.height;
        const scale = Math.min(scaleX, scaleY, 1);

        // Apply scale
        this.canvas.style.width = `${this.width * scale}px`;
        this.canvas.style.height = `${this.height * scale}px`;
    }

    /**
     * Start the game
     */
    start() {
        this.ui.showScreen('start');
        this.gameLoop(0);
    }

    /**
     * Start a new game
     */
    startNewGame() {
        this.audio.init();
        this.audio.resume();
        this.audio.playSelect();

        this.lives = 3;
        this.currentLevel = 0;
        this.totalGameTime = 0;

        this.loadLevel(0);
        this.state = GameState.PLAYING;

        this.ui.hideAllScreens();
        this.ui.showHUD();
        this.ui.updateLives(this.lives);
        this.ui.startTimer();
    }

    /**
     * Load a level
     * @param {number} index - Level index
     */
    loadLevel(index) {
        this.currentLevel = index;

        // Load maze
        this.maze.loadLevel(index, this.width, this.height);
        this.collision.setCellSize(this.maze.getCellSize());

        // Create ball at start position
        const startPos = this.maze.getStartPosition();
        this.ball = new Ball(startPos.x, startPos.y);

        // Update UI
        this.ui.updateLevel(index + 1, this.maze.getLevelName());
        this.levelStartTime = Date.now();
    }

    /**
     * Reset current level (after death)
     */
    resetLevel() {
        this.audio.playSelect();

        const startPos = this.maze.getStartPosition();
        this.ball.setStartPosition(startPos.x, startPos.y);

        this.state = GameState.PLAYING;
        this.ui.hideAllScreens();
        this.ui.showHUD();
        this.ui.startTimer();

        // Reset animations
        this.deathAnimation.active = false;
        this.winAnimation.active = false;
    }

    /**
     * Handle ball falling into hole
     */
    handleDeath() {
        this.lives--;
        this.ui.updateLives(this.lives);
        this.ui.stopTimer();
        this.audio.playHoleFall();

        // Start death animation
        this.deathAnimation.active = true;
        this.deathAnimation.progress = 0;

        if (this.lives <= 0) {
            this.state = GameState.GAMEOVER;
            setTimeout(() => {
                this.audio.playGameOver();
                this.ui.showGameOver();
            }, this.deathAnimation.duration);
        } else {
            this.state = GameState.DEATH;
            setTimeout(() => {
                this.ui.showDeath();
            }, this.deathAnimation.duration);
        }
    }

    /**
     * Handle reaching the goal
     */
    handleWin() {
        this.ui.stopTimer();
        this.audio.playGoalReached();

        // Start win animation
        this.winAnimation.active = true;
        this.winAnimation.progress = 0;

        const levelTime = Date.now() - this.levelStartTime;
        this.totalGameTime += levelTime;

        this.state = GameState.WIN;

        setTimeout(() => {
            // Check if all levels complete
            if (this.currentLevel >= this.maze.getTotalLevels() - 1) {
                this.state = GameState.VICTORY;
                this.audio.playVictory();
                this.ui.showVictory(this.totalGameTime);
            } else {
                this.ui.showWin(levelTime, this.lives);
            }
        }, this.winAnimation.duration);
    }

    /**
     * Proceed to next level
     */
    nextLevel() {
        this.audio.playSelect();
        this.currentLevel++;
        this.loadLevel(this.currentLevel);

        this.state = GameState.PLAYING;
        this.ui.hideAllScreens();
        this.ui.showHUD();
        this.ui.startTimer();

        // Reset animations
        this.winAnimation.active = false;
    }

    /**
     * Handle input based on current state
     */
    handleInput() {
        switch (this.state) {
            case GameState.MENU:
                if (this.controls.wasJustPressed('enter')) {
                    this.startNewGame();
                }
                break;

            case GameState.PLAYING:
                this.controls.applyToBall(this.ball);
                break;

            case GameState.DEATH:
                if (this.controls.wasJustPressed('r')) {
                    this.resetLevel();
                }
                break;

            case GameState.WIN:
                if (this.controls.wasJustPressed('enter')) {
                    this.nextLevel();
                }
                break;

            case GameState.GAMEOVER:
            case GameState.VICTORY:
                if (this.controls.wasJustPressed('enter')) {
                    this.state = GameState.MENU;
                    this.ui.showScreen('start');
                }
                break;
        }
    }

    /**
     * Update game logic
     * @param {number} deltaTime - Time since last frame in ms
     */
    update(deltaTime) {
        const dt = deltaTime / 1000;

        // Update UI timer
        this.ui.update();

        // Update animations
        this.updateAnimations(deltaTime);

        if (this.state !== GameState.PLAYING) return;

        // Update ball physics
        this.ball.update(dt);

        // Update maze animations
        this.maze.update(dt);

        // Check wall collisions
        const offsets = this.maze.getOffsets();
        const wallResult = this.collision.checkWallCollision(
            this.ball,
            this.maze.getGrid(),
            offsets.x,
            offsets.y
        );

        if (wallResult.collided) {
            this.audio.playWallHit();
        }

        // Check hole collision
        if (this.collision.checkHoleCollision(
            this.ball,
            this.maze.getGrid(),
            offsets.x,
            offsets.y
        )) {
            this.handleDeath();
        }

        // Check goal collision
        if (this.collision.checkGoalCollision(
            this.ball,
            this.maze.getGrid(),
            offsets.x,
            offsets.y
        )) {
            this.handleWin();
        }
    }

    /**
     * Update death/win animations
     */
    updateAnimations(deltaTime) {
        if (this.deathAnimation.active) {
            this.deathAnimation.progress += deltaTime / this.deathAnimation.duration;
            if (this.deathAnimation.progress >= 1) {
                this.deathAnimation.progress = 1;
            }
        }

        if (this.winAnimation.active) {
            this.winAnimation.progress += deltaTime / this.winAnimation.duration;
            if (this.winAnimation.progress >= 1) {
                this.winAnimation.progress = 1;
            }
        }
    }

    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Only render maze and ball during gameplay states
        if (this.state === GameState.PLAYING ||
            this.state === GameState.DEATH ||
            this.state === GameState.WIN) {

            // Render maze
            this.maze.render(this.ctx);

            // Render ball with animation effects
            if (this.ball) {
                this.ctx.save();

                // Death animation: shrink and fade
                if (this.deathAnimation.active) {
                    const scale = 1 - this.deathAnimation.progress;
                    const alpha = 1 - this.deathAnimation.progress;
                    this.ctx.globalAlpha = alpha;

                    const cx = this.ball.x;
                    const cy = this.ball.y;
                    this.ctx.translate(cx, cy);
                    this.ctx.scale(scale, scale);
                    this.ctx.translate(-cx, -cy);
                }

                // Win animation: glow and pulse
                if (this.winAnimation.active) {
                    const pulse = 1 + Math.sin(this.winAnimation.progress * Math.PI * 4) * 0.2;
                    this.ball.glowIntensity = 1 + this.winAnimation.progress * 2;

                    const cx = this.ball.x;
                    const cy = this.ball.y;
                    this.ctx.translate(cx, cy);
                    this.ctx.scale(pulse, pulse);
                    this.ctx.translate(-cx, -cy);
                }

                this.ball.render(this.ctx);
                this.ctx.restore();
            }
        }
    }

    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp
     */
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Cap delta time to avoid large jumps
        const dt = Math.min(deltaTime, 32);

        this.handleInput();
        this.update(dt);
        this.render();

        this.animationId = requestAnimationFrame(this.gameLoop);
    }

    /**
     * Stop the game
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.controls.destroy();
    }
}

// Initialize and start the game
const game = new Game();
game.start();

// Export for debugging
window.game = game;
