

function calcCollision(a, b) {

    var objA = objects[a];
    var objB = objects[b];

    var aTopPos = objA.yPos;
    var bTopPos = objB.yPos;
    var aBottomPos = aTopPos + objA.height;
    var bBottomPos = bTopPos + objB.height;
    var aLeftPos = objA.xPos;
    var bLeftPos = objB.xPos;
    var aRightPos = aLeftPos + objA.width;
    var bRightPos = bLeftPos + objB.width;

    var aTopPosProj = aTopPos - objA.ySpeed;
    var bTopPosProj = bTopPos - objB.ySpeed;
    var aBottomPosProj = aBottomPos - objA.ySpeed;
    var bBottomPosProj = bBottomPos - objB.ySpeed;
    var aLeftPosProj = aLeftPos + objA.xSpeed;
    var bLeftPosProj = bLeftPos + objB.xSpeed;
    var aRightPosProj = aRightPos + objA.xSpeed;
    var bRightPosProj = bRightPos + objB.xSpeed;

    // If Objects are projected to align horizontally next frame
    if (aBottomPosProj  > bTopPosProj && aTopPosProj < bBottomPosProj) {

        // If Objects are also projected to align vertically next frame
        if (aRightPosProj > bLeftPosProj && aLeftPosProj < bRightPosProj) {

            // Skip collision testing if
            // the first object is anchored
            // (not sure if this is a good idea yet)
            if (objA.anchored) {
                return;
            }

            // The Objects are projected to collied.
            // Only stop their x-axis motion if they 
            // already overlap on the x-axis by more than 1px.
            // Otherwise, they may just be trying to slide along
            // each other on the Y axis.
            if (aBottomPos -1 > bTopPos && aTopPos +1 < bBottomPos) {
                objA.xPos -= objA.xSpeed;
                objB.xPos -= objB.xSpeed;

                objA.xSpeed = 0;
                objB.xSpeed = 0;

                objA.touchingObjects.push(b);
                objB.touchingObjects.push(a);
            }

            // Do the same for the Y-axis
            if (aRightPos -1 > bLeftPos && aLeftPos +1 < bRightPos) {
                objA.yPos += objA.ySpeed;
                objB.yPos += objB.ySpeed;
    
                objA.ySpeed = 0;
                objB.ySpeed = 0;

                // If the player has hit their pushingFrames limit
                // and has let go of the up arrow
                if (!pressedKeys.includes("ArrowUp")) {
                    if (objA instanceof Player) {
                        objA.yPushingFrames = 0;
                    }
    
                    if (objB instanceof Player) {
                        objB.yPushingFrames = 0;
                    }
                }

                objA.touchingObjects.push(b);
                objB.touchingObjects.push(a);
            }

        }
    
    }

}


function placeObject() {

    currentLevelDataCell = levelData[hoveredRow][hoveredCol];

    currentLevelDataCell.objects.push("block");

    world.initialized = false;


    // Compress the level data
    var levelDataString = JSON.stringify(levelData);
    var compressedLevel = LZString.compress(levelDataString);

    // Store the level data
    localStorage.storedLevel = compressedLevel;

    // Output the stored level data in the console
    if (logging.localStorage == true) {
        console.log(JSON.parse(LZString.decompress(localStorage.storedLevel)));
    }
}

function gameLoop() {

    handlePressedKeys();

    ctx.clearRect(0,0,width*pixelRatio,height*pixelRatio);

    if (world.initialized == false) {
        world.initialize();
    }

    // Draw the world
    world.draw();

    // Track which objects are already fully collided
    var fullyCheckedIndex = 0;

    // For each possible Object 'A', loop
    for (var a=0; a<objects.length; a++) {

        // For each possible Object 'B' that isn't
        // already tested against all objects, loop
        for (var b=fullyCheckedIndex; b<objects.length; b++) {

            // Don't test an Object against itself
            if (a === b) {
                continue;
            }

            calcCollision(a,b);

        }

        // Track which objects have already been
        // tested against all other objects
        fullyCheckedIndex = a;
                
        // Update and draw the Object
        objects[a].update();
        objects[a].draw();

    }

    // call requestAnimationFrame again with parameters
    requestAnimationFrame(function() {
        runLoop();
    })

    loops++;

    if (loops %2 == 0) {
        //console.clear();
    }
}