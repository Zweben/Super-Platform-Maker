

function gameLoop() {

    if (paused) {
        return;
    }

    elapsedMillis =  new Date() - startTime;
    //console.log(elapsedMillis/frames);

    handlePressedKeys();

    //ctx.clearRect(0,0,width*pixelRatio,height*pixelRatio);
    drawWithinArea("world","clear",0,0,width*pixelRatio,height*pixelRatio)

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