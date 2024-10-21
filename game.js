const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.6;
const jumpPower = -12;
const boostJumpPower = -20; // Higher jump when boosted
const maxChargeTime = 1000; // Max charge time for boost (in milliseconds)
const groundLevel = canvas.height - 40;
const speed = 5;

let redSquare = {
    x: 180,
    y: groundLevel,
    width: 40,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    isCharging: false, // Tracks if a jump is being charged
    chargeStartTime: 0 // Time when charge started
};

// Key control states
let keys = {
    right: false,
    left: false,
    up: false,
    down: false // Added for jump boost
};

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'ArrowLeft') keys.left = true;

    if (e.code === 'ArrowUp' && !redSquare.isJumping && !redSquare.isCharging) {
        redSquare.velocityY = jumpPower;
        redSquare.isJumping = true;
    }

    if (e.code === 'ArrowDown' && !redSquare.isJumping && !redSquare.isCharging) {
        redSquare.isCharging = true;
        redSquare.chargeStartTime = Date.now(); // Record when the charge starts
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'ArrowLeft') keys.left = false;

    if (e.code === 'ArrowDown' && redSquare.isCharging) {
        // Calculate how long the down key was held (charge duration)
        const chargeDuration = Date.now() - redSquare.chargeStartTime;
        const chargeRatio = Math.min(chargeDuration / maxChargeTime, 1); // Ensure it doesn't exceed max

        // Boosted jump based on chargeRatio
        redSquare.velocityY = boostJumpPower * chargeRatio;
        redSquare.isJumping = true;
        redSquare.isCharging = false;
    }
});

// Game loop
function update() {
    // Apply gravity
    redSquare.velocityY += gravity;
    redSquare.y += redSquare.velocityY;

    // Handle horizontal movement
    if (keys.right) {
        redSquare.x += speed;
    }
    if (keys.left) {
        redSquare.x -= speed;
    }

    // Prevent the square from going off the left or right edges
    if (redSquare.x < 0) {
        redSquare.x = 0;
    }
    if (redSquare.x + redSquare.width > canvas.width) {
        redSquare.x = canvas.width - redSquare.width;
    }

    // Ensure the square doesn't fall through the ground
    if (redSquare.y + redSquare.height >= canvas.height) {
        redSquare.y = groundLevel;
        redSquare.velocityY = 0;
        redSquare.isJumping = false;
    }

    draw();
    requestAnimationFrame(update);
}

// Drawing the red square and the game area
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only apply the shrink animation if the square is charging and on the ground
    let heightFactor = 1;
    if (redSquare.isCharging && !redSquare.isJumping) {
        const chargeDuration = Date.now() - redSquare.chargeStartTime;
        heightFactor = 1 - Math.min(chargeDuration / maxChargeTime, 0.3); // Shrink height up to 30%
    }

    const squareHeight = redSquare.height * heightFactor;
    const yOffset = redSquare.height - squareHeight; // Adjust vertical position based on shrink

    // Draw the red square
    ctx.fillStyle = 'red';
    ctx.fillRect(redSquare.x, redSquare.y + yOffset, redSquare.width, squareHeight);
}

// Start the game loop
update();

// Fade-in and fade-out text animation
document.addEventListener("DOMContentLoaded", () => {
    const texts = document.querySelectorAll('.fade-text');
    let delay = 1000; // Initial delay before the first text appears

    texts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('fade-in'); // Add class to trigger fade-in

            // Set timeout to fade out after a few seconds
            setTimeout(() => {
                text.classList.remove('fade-in'); // Remove fade-in class
                text.classList.add('fade-out'); // Add class to trigger fade-out

                // Remove the text completely after fade-out
                setTimeout(() => {
                    text.style.display = 'none'; // Remove from the display
                }, 1000); // Wait for fade-out duration before removing from display
            }, 3000); // Wait 3 seconds before starting to fade out
        }, delay);
        delay += 4000; // Increase delay for the next text
    });
});
