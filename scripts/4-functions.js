

// Figure out a better way to do this
var world = new World();
var player = new Player();
world.initialize();



function drawWithinArea(areaName, drawType, xPos, yPos, xSize, ySize) {

    // Get the coordinates of the specified area
    var areaTop = drawAreas[areaName][0] * pixelRatio; // 96
    var areaRight = drawAreas[areaName][1] * pixelRatio; // 1260
    var areaBottom = drawAreas[areaName][2] * pixelRatio; // 600
    var areaLeft = drawAreas[areaName][3] * pixelRatio; // 20

    // Get the coordinates within which
    // drawing was requested
    var topDrawPos = yPos + areaTop;
    var rightDrawPos = xPos + xSize + areaLeft;
    var bottomDrawPos = yPos + ySize + areaTop;
    var leftDrawPos = xPos + areaLeft;

    // If item is completely off screen, don't draw it
    if (leftDrawPos > areaRight) {return;}
    if (rightDrawPos < areaLeft) {return;}
    if (topDrawPos > areaBottom) {return;}
    if (bottomDrawPos < areaTop) {return;}

    // Get the X and Y coordinates between which to draw, 
    // constrained within the area
    if (topDrawPos < areaTop) {
        topDrawPos = areaTop;
    }
    if (rightDrawPos > areaRight) {
        rightDrawPos = areaRight;
    }
    if (bottomDrawPos > areaBottom) {
        bottomDrawPos = areaBottom;
    }
    if (leftDrawPos < areaLeft) {
        leftDrawPos = areaLeft;
    }

    // Get the updated draw size
    xSize = rightDrawPos - leftDrawPos;
    ySize = bottomDrawPos - topDrawPos;

    switch(drawType) {
        case "clear":
            ctx.clearRect(leftDrawPos,topDrawPos,xSize,ySize);
            break;
        case "fillRect":
            ctx.fillRect(leftDrawPos,topDrawPos,xSize,ySize);
            break;
    }

}



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
    if (aBottomPosProj > bTopPosProj && aTopPosProj < bBottomPosProj) {

        // If Objects are also projected to align vertically next frame
        if (aRightPosProj > bLeftPosProj && aLeftPosProj < bRightPosProj) {

            // Skip collision testing if
            // the first object is anchored
            // (not sure if this is a good idea yet)
            if (objB.anchored) {
                return;
            }

            // The Objects are projected to collied.

            if (frames % 100 === 0) {
                if (this instanceof Player) {
                    console.log("updating object", this.xSpeed, this.ySpeed);
                }
            }

            console.log(objA.xPos,objA.yPos,objA.xPos+objA.width,objA.yPos+objA.height);
            console.log(objB.xPos,objB.yPos,objB.xPos+objB.width,objB.yPos+objB.height);
            console.log("");

            paused = true;

            // If the bottom of A is touching the top of B
            if (aBottomPosProj > bTopPosProj && aTopPosProj < bBottomPosProj) {
                objA.ySpeed = 0;
                objB.ySpeed = 0;
            }

            if (aRightPosProj > bLeftPosProj && aLeftPosProj < bRightPosProj) {
                objA.xSpeed = 0;
                objB.xSpeed = 0;
    
            }




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

            //objA.touchingObjects.push(b);
            //objB.touchingObjects.push(a);

            //objA.touchingObjects.push(b);
            //objB.touchingObjects.push(a);

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


