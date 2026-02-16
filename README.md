# La Quento - Roll the Ball

A minimalist, neon-tinged maze puzzle where you roll a glowing ball through walls, holes, and a pulsing goal. Built with HTML5 canvas, modular JavaScript, and a custom UI overlay.

## How to Run

- Open `index.html` in a modern browser.
- Press Enter on the title screen to start.

No build step or server is required.

## Controls

- Arrow keys or WASD: Move the ball
- Enter: Start, continue, or restart
- R: Retry after falling
- Escape: Reserved (mapped, not used yet)

## Gameplay

- Navigate each maze to reach the green goal.
- Avoid the magenta holes or you lose a life.
- Clear all levels to reach the victory screen.

## Project Structure

- `index.html` - Canvas and UI overlay markup
- `css/style.css` - Visual design system and UI styling
- `js/main.js` - Game loop and state management
- `js/physics.js` - Ball movement and rendering
- `js/maze.js` - Level data and maze rendering
- `js/collision.js` - Wall, hole, and goal collisions
- `js/controls.js` - Keyboard input handling
- `js/ui.js` - HUD and screen transitions
- `js/audio.js` - Web Audio API sound synthesis

## Notes

- Audio initializes on first user interaction due to browser policies.
- Levels are embedded in `js/maze.js` for easy editing.
