

// Figure out a better way to do this
var world = new World();
var player = new Player();
world.initialize();



function updateToolbar() {

    var tbTopPos = drawAreas.toolbar[0] * pixelRatio;
    var tbRightPos = drawAreas.toolbar[1] * pixelRatio;
    var tbBottomPos = drawAreas.toolbar[2] * pixelRatio;
    var tbLeftPos = drawAreas.toolbar[3] * pixelRatio;

    ctx.fillStyle = "#000000";
    drawWithinArea("toolbar", "fillRect", tbTopPos, tbRightPos, tbBottomPos, tbLeftPos)
}


function drawWithinArea(areaName, drawType, xPos, yPos, xSize, ySize) {

    // Get the coordinates of the specified area
    var areaTop = drawAreas[areaName][0] * pixelRatio; // 96
    var areaRight = drawAreas[areaName][1] * pixelRatio; // 1260
    var areaBottom = drawAreas[areaName][2] * pixelRatio; // 600
    var areaLeft = drawAreas[areaName][3] * pixelRatio; // 20

    // Get the coordinates within which
    // drawing was requested
    var topDrawPos = (yPos * pixelRatio) + areaTop;
    var rightDrawPos = (xPos * pixelRatio) + (xSize * pixelRatio) + areaLeft;
    var bottomDrawPos = (yPos * pixelRatio) + (ySize * pixelRatio) + areaTop;
    var leftDrawPos = (xPos * pixelRatio) + areaLeft;

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
            // both object are anchored
            if (objA.anchored && objB.anchored) {
                return;
            }

            // The Objects are projected to collide

            // Store the objects the current object is touching
            // this is currently only storing one object at a time
            objA.touchingObjects.push(b);
            objB.touchingObjects.push(a);

            //paused = true;

            var objectsOverlapOnY = aBottomPos - 1 > bTopPos && aTopPos + 1 < bBottomPos;
            var objectsOverlapOnX = aRightPosProj - 1 > bLeftPosProj && aLeftPosProj + 1 < bRightPosProj;

            var objA_Bottom_Touching_objB_Top = objectsOverlapOnX && aBottomPosProj > bTopPosProj && aBottomPosProj < bBottomPosProj;
            var objA_Top_Touching_objB_Bottom =  objectsOverlapOnX && aTopPosProj < bBottomPosProj && aTopPosProj > bTopPosProj;
            var objA_Right_Touching_objB_Left = objectsOverlapOnY && aRightPosProj > bLeftPosProj && aRightPosProj < bRightPosProj;
            var objA_Left_Touching_objB_Right = objectsOverlapOnY && aLeftPosProj < bRightPosProj && aLeftPosProj > bLeftPosProj;

            /*
            if (objA instanceof Player) {
                console.log("objA is player");
            }
            if (objB instanceof Player) {
                console.log("objB is player");
            }
            */

            //console.log("objA_Bottom_Touching_objB_Top",objA_Bottom_Touching_objB_Top);
            //console.log("objA_Top_Touching_objB_Bottom",objA_Top_Touching_objB_Bottom);
            //console.log("objA_Right_Touching_objB_Left",objA_Right_Touching_objB_Left);
            //console.log("objA_Left_Touching_objB_Right",objA_Left_Touching_objB_Right);
            //console.log("");
           
            //console.log(objB.touchingObjects);
            //console.log("player", "L:", objB.xPos.toFixed(4),"T:",objB.yPos.toFixed(4),"R:",(objB.xPos+objB.width).toFixed(4),"B:",(objB.yPos+objB.height).toFixed(4));
            //console.log("objA  ", "L:", objA.xPos.toFixed(4),"T:",objA.yPos.toFixed(4),"R:",(objA.xPos+objA.width).toFixed(4),"B:",(objA.yPos+objA.height).toFixed(4));
            //console.log("");


            // Maybe a better way to do this
            // is to track the direction in which the
            // obstace blocks additional motion
            // by simulating movement in each direction
            // and seeing if the overlap increases

            // Maybe also track real or projected object
            // intrusion and adjust position by that #

            if (objA_Bottom_Touching_objB_Top) {
                objA.ySpeed = 0;
                objB.ySpeed = 0;
            }
            if (objA_Top_Touching_objB_Bottom) {
                objA.ySpeed = 0;
                objB.ySpeed = 0;
            }
            if (objA_Right_Touching_objB_Left) {
                objA.xSpeed = 0;
                objB.xSpeed = 0;
            }
            if (objA_Left_Touching_objB_Right) {
                objA.xSpeed = 0;
                objB.xSpeed = 0;    
            }


            // If the player is colliding with something
            // and has let go of the up arrow
            if (!pressedKeys.includes("ArrowUp")) {
                if (objA instanceof Player) {
                    if (objA_Bottom_Touching_objB_Top) {
                        objA.yPushingFrames = 0;
                    }
                }

                if (objB instanceof Player) {
                    if (objA_Top_Touching_objB_Bottom) {
                        objB.yPushingFrames = 0;
                    }
                }
            }

        }
    
    }

}



function placeObject() {

    currentLevelDataCell = levelData[hoveredRow][hoveredCol];

    currentLevelDataCell.objects.push("block");

    world.initialized = false;

}


function saveLevel() {
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