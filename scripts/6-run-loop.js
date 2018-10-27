
function runLoop() {
    if (initialized) {
        gameLoop();
    }
}

requestAnimationFrame(function() {
    runLoop();
})