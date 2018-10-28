
function runLoop() {
    if (canvasInitialized) {
        gameLoop();
    }
}

requestAnimationFrame(function() {
    runLoop();
})