

function gameLoop() {

    if (paused) {
        return;
    }

    updateToolbar();

    elapsedMillis =  new Date() - startTime;
    //console.log(elapsedMillis/frames);

    handlePressedKeys();

    //ctx.clearRect(0,0,width,height);
    drawWithinArea("world","clear",0,0,width,height)

    if (world.initialized == false) {
        world.initialize();
    }

    // Draw the world
    world.draw();

    // For each Object
    for (var i=0; i<objects.length; i++) {

        objects[i].update();
        objects[i].draw();

    }

    frames++;

    // call requestAnimationFrame again with parameters
    requestAnimationFrame(function() {
        runLoop();
    })


}


function runLoop() {
    if (canvasInitialized) {
        gameLoop();
    }
}

requestAnimationFrame(function() {
    runLoop();
})