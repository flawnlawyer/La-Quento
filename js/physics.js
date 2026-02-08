/**
 * La Quento – Roll the Ball | Physics Engine
 * Handles ball movement, acceleration, friction, and physics simulation
 */

export class Ball {
    constructor(x, y, radius = 12) {
        // Position
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
        
        // Properties
        this.radius = radius;
        this.friction = 0.985;
        this.acceleration = 0.4;
        this.maxSpeed = 8;
        this.bounceDamping = 0.5;
        
        // Visual properties
        this.glowIntensity = 1;
        this.trail = [];
        this.maxTrailLength = 15;
    }
    
    /**
     * Apply acceleration in a direction
     * @param {string} direction - 'up', 'down', 'left', 'right'
     */
    accelerate(direction) {
        switch(direction) {
            case 'up':
                this.vy -= this.acceleration;
                break;
            case 'down':
                this.vy += this.acceleration;
                break;
            case 'left':
                this.vx -= this.acceleration;
                break;
            case 'right':
                this.vx += this.acceleration;
                break;
        }
        
        // Clamp to max speed
        this.clampSpeed();
    }
    
    /**
     * Clamp velocity to maximum speed
     */
    clampSpeed() {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            const ratio = this.maxSpeed / speed;
            this.vx *= ratio;
            this.vy *= ratio;
        }
    }
    
    /**
     * Update physics state
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        // Store position for trail
        if (this.getSpeed() > 0.5) {
            this.trail.unshift({ x: this.x, y: this.y, alpha: 1 });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.pop();
            }
        }
        
        // Update trail alphas
        this.trail.forEach((point, i) => {
            point.alpha = 1 - (i / this.maxTrailLength);
        });
        
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Stop if very slow
        if (Math.abs(this.vx) < 0.01) this.vx = 0;
        if (Math.abs(this.vy) < 0.01) this.vy = 0;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Update glow based on speed
        const speed = this.getSpeed();
        this.glowIntensity = 1 + (speed / this.maxSpeed) * 0.5;
    }
    
    /**
     * Get current speed
     * @returns {number} Current speed
     */
    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
    
    /**
     * Bounce off a wall
     * @param {string} axis - 'x' or 'y'
     */
    bounce(axis) {
        if (axis === 'x') {
            this.vx = -this.vx * this.bounceDamping;
        } else {
            this.vy = -this.vy * this.bounceDamping;
        }
    }
    
    /**
     * Reset ball to start position
     */
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.vx = 0;
        this.vy = 0;
        this.trail = [];
    }
    
    /**
     * Set new start position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    setStartPosition(x, y) {
        this.startX = x;
        this.startY = y;
        this.reset();
    }
    
    /**
     * Render the ball
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        // Render trail
        this.renderTrail(ctx);
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `rgba(0, 255, 204, ${0.3 * this.glowIntensity})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 204, ${0.1 * this.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Main ball body
        const ballGradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, 
            this.y - this.radius * 0.3, 
            0,
            this.x, this.y, this.radius
        );
        ballGradient.addColorStop(0, '#66ffee');
        ballGradient.addColorStop(0.7, '#00ffcc');
        ballGradient.addColorStop(1, '#00b894');
        
        ctx.fillStyle = ballGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(
            this.x - this.radius * 0.3, 
            this.y - this.radius * 0.3, 
            this.radius * 0.3, 
            0, Math.PI * 2
        );
        ctx.fill();
    }
    
    /**
     * Render motion trail
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    renderTrail(ctx) {
        this.trail.forEach((point, i) => {
            const size = this.radius * (1 - i / this.maxTrailLength) * 0.6;
            ctx.fillStyle = `rgba(0, 255, 204, ${point.alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
