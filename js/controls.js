/**
 * La Quento – Roll the Ball | Controls Module
 * Handles keyboard input with smooth response
 */

export class Controls {
    constructor() {
        // Key states
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            enter: false,
            escape: false,
            r: false
        };

        // Key mappings
        this.keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'KeyW': 'up',
            'KeyS': 'down',
            'KeyA': 'left',
            'KeyD': 'right',
            'Enter': 'enter',
            'Escape': 'escape',
            'KeyR': 'r'
        };

        // One-shot keys (trigger once per press)
        this.oneShotKeys = new Set(['enter', 'escape', 'r']);
        this.keyJustPressed = {};

        // Bind event listeners
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.init();
    }

    /**
     * Initialize event listeners
     */
    init() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    /**
     * Handle key down event
     * @param {KeyboardEvent} event 
     */
    handleKeyDown(event) {
        const key = this.keyMap[event.code];
        if (key) {
            event.preventDefault();

            // Track if key was just pressed (for one-shot keys)
            if (!this.keys[key] && this.oneShotKeys.has(key)) {
                this.keyJustPressed[key] = true;
            }

            this.keys[key] = true;
        }
    }

    /**
     * Handle key up event
     * @param {KeyboardEvent} event 
     */
    handleKeyUp(event) {
        const key = this.keyMap[event.code];
        if (key) {
            event.preventDefault();
            this.keys[key] = false;
        }
    }

    /**
     * Check if a key is currently pressed
     * @param {string} key - Key name
     * @returns {boolean}
     */
    isPressed(key) {
        return this.keys[key] || false;
    }

    /**
     * Check if a key was just pressed (one-shot)
     * @param {string} key - Key name
     * @returns {boolean}
     */
    wasJustPressed(key) {
        if (this.keyJustPressed[key]) {
            this.keyJustPressed[key] = false;
            return true;
        }
        return false;
    }

    /**
     * Get movement direction based on pressed keys
     * @returns {Object} { x: -1|0|1, y: -1|0|1 }
     */
    getMovementDirection() {
        return {
            x: (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0),
            y: (this.keys.down ? 1 : 0) - (this.keys.up ? 1 : 0)
        };
    }

    /**
     * Apply movement to ball based on input
     * @param {Ball} ball - The ball object
     */
    applyToBall(ball) {
        if (this.keys.up) ball.accelerate('up');
        if (this.keys.down) ball.accelerate('down');
        if (this.keys.left) ball.accelerate('left');
        if (this.keys.right) ball.accelerate('right');
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
}
