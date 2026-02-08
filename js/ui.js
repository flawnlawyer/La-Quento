/**
 * La Quento – Roll the Ball | UI Manager
 * Handles all user interface screens and HUD updates
 */

export class UIManager {
    constructor() {
        // Screen elements
        this.screens = {
            start: document.getElementById('start-screen'),
            hud: document.getElementById('hud'),
            death: document.getElementById('death-screen'),
            gameover: document.getElementById('gameover-screen'),
            win: document.getElementById('win-screen'),
            victory: document.getElementById('victory-screen')
        };

        // HUD elements
        this.livesDisplay = document.getElementById('lives-display');
        this.timerDisplay = document.getElementById('timer-display');
        this.levelDisplay = document.getElementById('level-display');

        // Win screen stats
        this.winTime = document.getElementById('win-time');
        this.winLives = document.getElementById('win-lives');

        // Victory screen stats
        this.totalTime = document.getElementById('total-time');

        // Timer state
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerRunning = false;
    }

    /**
     * Show a specific screen
     * @param {string} screenName - Name of the screen to show
     */
    showScreen(screenName) {
        // Hide all screens first
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
                screen.classList.add('hidden');
            }
        });

        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            this.screens[screenName].classList.add('active');
        }

        // Show HUD during gameplay
        if (screenName === 'hud' || screenName === 'playing') {
            this.screens.hud.classList.remove('hidden');
        }
    }

    /**
     * Hide all screens (for gameplay)
     */
    hideAllScreens() {
        Object.entries(this.screens).forEach(([name, screen]) => {
            if (screen && name !== 'hud') {
                screen.classList.remove('active');
                screen.classList.add('hidden');
            }
        });
    }

    /**
     * Show HUD
     */
    showHUD() {
        this.screens.hud.classList.remove('hidden');
    }

    /**
     * Hide HUD
     */
    hideHUD() {
        this.screens.hud.classList.add('hidden');
    }

    /**
     * Update lives display
     * @param {number} lives - Current lives count
     */
    updateLives(lives) {
        const lifeElements = this.livesDisplay.querySelectorAll('.life');
        lifeElements.forEach((el, i) => {
            if (i < lives) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    /**
     * Update level display
     * @param {number} level - Current level number
     * @param {string} name - Level name
     */
    updateLevel(level, name = '') {
        this.levelDisplay.textContent = `LEVEL ${level}${name ? ': ' + name : ''}`;
    }

    /**
     * Start the timer
     */
    startTimer() {
        this.startTime = Date.now();
        this.timerRunning = true;
    }

    /**
     * Stop the timer
     */
    stopTimer() {
        this.timerRunning = false;
    }

    /**
     * Reset the timer
     */
    resetTimer() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.updateTimerDisplay();
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        if (this.timerRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }

        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        this.timerDisplay.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get formatted time string
     * @param {number} ms - Time in milliseconds
     */
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Show death screen
     */
    showDeath() {
        this.showScreen('death');
    }

    /**
     * Show game over screen
     */
    showGameOver() {
        this.hideHUD();
        this.showScreen('gameover');
    }

    /**
     * Show win screen with stats
     * @param {number} time - Level completion time
     * @param {number} lives - Remaining lives
     */
    showWin(time, lives) {
        this.winTime.textContent = this.formatTime(time);
        this.winLives.textContent = lives.toString();
        this.showScreen('win');
    }

    /**
     * Show victory screen
     * @param {number} totalTime - Total game time
     */
    showVictory(totalTime) {
        this.hideHUD();
        this.totalTime.textContent = this.formatTime(totalTime);
        this.showScreen('victory');
    }

    /**
     * Update UI each frame
     */
    update() {
        if (this.timerRunning) {
            this.updateTimerDisplay();
        }
    }
}
