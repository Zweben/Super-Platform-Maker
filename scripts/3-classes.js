class World {
    constructor() {
        this.cellSize = 16;
        this.width = 256;
        this.height = 128;
        this.xScrollPos = 0;
        this.yScrollPos = 0;
        this.initialized = false;
        this.initialize = function() {

            // Clear out the objects from the previous state of the level
            // Probably safer than updating the array in case anything changed
            objects = [];

            // Create default objects that aren't in the level data
            objects.push(player);
            
            ground.color = "green";
            ground.mass = 10;
            ground.width = 1000;
            ground.height = 50;
            ground.xPos = 0;
            ground.yPos = 300;
            ground.anchored = true;
            objects.push(ground);

            

            var levelDataIsValid = false;

            // Check if the stored level data is valid
            // to-do: put real level data validation here
            if (levelData != undefined && levelData.length > 0) {
                levelDataIsValid = true;
            }

            if (levelDataIsValid) {
                // Create the level from the data
                // or let other code handle that and do nothing?
                for (var row = 0; row < this.height; row++) {
                    for (var col = 0; col < this.width; col++) {
                        
                        if(levelData[row][col].objects.includes("block")) {

                            var block = new Block;
                            var xPos = col * world.cellSize;
                            var yPos = row * world.cellSize;

                            block.xPos = xPos;
                            block.yPos = yPos;

                            objects.push(block);

                            this.initialized = false;

                        }

                    }
                }

            }

            else {
                // For each world row
                for (var row = 0; row < this.height; row++) {

                    // Create the levelData row if it doesn't exist
                    if (levelData[row] == undefined) {
                        levelData.push([]);
                    }

                    // For each world column
                    for (var col = 0; col < this.width; col++) {

                        // Create the levelData column if it doesn't exist
                        if (levelData[row][col] == undefined) {
                            levelData[row].push([]);
                        }

                        levelData[row][col] = {
                            isHovered: false,
                            objects: []
                        }
                    }
                }
            }

            this.initialized = true;
        }
        this.draw = function () {

            var cellSize = this.cellSize * pixelRatio;

            // For each world row
            for (var row = 0; row < this.height; row++) {
                // For each world column
                for (var col = 0; col < this.width; col++) {
                    var xWorldCellPos = (cellSize * col) - Math.floor(this.xScrollPos) * pixelRatio;
                    var yworldCellPos = (cellSize * row) - Math.floor(this.yScrollPos) * pixelRatio;

                    // Adjust values based on PPI setting
                    xWorldCellPos = pixelRatio * Math.floor(xWorldCellPos / pixelRatio);
                    yworldCellPos = pixelRatio * Math.floor(yworldCellPos / pixelRatio);

                    // Track if the mouse aligns with the current row/col
                    var mouseAlignsOnX = false;
                    var mouseAlignsOnY = false;

                    // Check if the mouse aligns on x with the curernt cell
                    if (xMousePos > xWorldCellPos) {
                        if (xMousePos < xWorldCellPos + cellSize) {
                            mouseAlignsOnX = true;
                        }
                    }

                    // Check if the mouse aligns on y with the curernt cell
                    if (yMousePos > yworldCellPos) {
                        if (yMousePos < yworldCellPos + cellSize) {
                            mouseAlignsOnY = true;
                        }
                    }

                    if (world.initialized == false) {
                        world.initialize();
                    }

                    // Store the current level cell data to the world
                    var currentWorldCell = levelData[row][col];

                    // If the mouse is over the current cell
                    if (mouseAlignsOnX && mouseAlignsOnY) {
                        currentWorldCell.isHovered = true;
                        hoveredRow = row;
                        hoveredCol = col;

                        ctx.fillStyle = "#000";
                    }
                    else {
                        ctx.fillStyle = "#ddd";
                    }

                    ctx.lineWidth = 2;


                    // Left edge
                    ctx.fillRect(xWorldCellPos, yworldCellPos, 1, cellSize);

                    // Right edge
                    ctx.fillRect(xWorldCellPos + cellSize-2, yworldCellPos, 1, cellSize);

                    // Top edge
                    ctx.fillRect(xWorldCellPos, yworldCellPos, cellSize, 1);

                    // Bottom edge
                    ctx.fillRect(xWorldCellPos, yworldCellPos + cellSize-2, cellSize, 1);

                    //currentWorldCell.isHovered = false;

                }
            }
        };
    }
}

class Object {
    constructor() {
        this.width = world.cellSize;
        this.height = world.cellSize;
        this.color = "skyblue";
        this.anchored = false;
        this.xPos = 0;
        this.yPos = 0;
        this.xForce = 0;
        this.yForce = 0;
        this.xPushing = 0;
        this.yPushing = 0;
        this.yPushingFrames = 0;
        this.mass = 5;
        this.xAccel = 0;
        this.yAccel = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.xMomentum = 0;
        this.yMomentum = 0;
        this.touchingObjects = [];
    }
    update() {
        // Forces are re-calculated every frame
        this.xForce = 0;
        this.yForce = 0;
        // Add any pushing (walking) forces to total forces
        this.xForce += this.xPushing;
        if (this.yPushingFrames < 8) {
            this.yForce += this.yPushing;
        }
        // Reset any pushing values every frame
        this.xPushing = 0;
        this.yPushing = 0;
        // Create fake simplified 'air resistance' forces for now
        this.xAirResist = (this.xSpeed * this.height / 100);
        this.yAirResist = (this.ySpeed * this.width / 100);
        // Add 'air resistance' to the total forces
        this.xForce -= this.xAirResist;
        this.yForce -= this.yAirResist;
        // Add gravity (if not pinned)
        if (this.anchored == false) {
            this.yForce -= this.mass * gravity;
        }
        // Calculate accel from net force and mass
        this.xAccel = this.xForce / this.mass;
        this.yAccel = this.yForce / this.mass;
        // Calculate speed from prev speed and accel
        this.xSpeed += this.xAccel;
        this.ySpeed += this.yAccel;
        // Calculate pos from prev pos and speed
        this.xPos += this.xSpeed;
        this.yPos -= this.ySpeed;
        // Calculate momentum from mass and speed
        this.xMomentum = this.xSpeed * this.mass;
        this.yMomentum = this.ySpeed * this.mass;

        this.touchingObjects = [];

        if (this instanceof Player) {
            if (!pressedKeys.includes("ArrowUp")) {

            }
        }

        this.yPushingFrames++;
    };
    draw() {
        var xObjectPos = this.xPos - world.xScrollPos ;
        var yObjectPos = this.yPos - world.yScrollPos ;

        ctx.fillStyle = this.color;
        ctx.fillRect(xObjectPos * pixelRatio, yObjectPos * pixelRatio, this.width * pixelRatio, this.height * pixelRatio);
    };
}

class Block extends Object {
    constructor() {
        super();
        this.color = "green";
        this.anchored = true;
    }
    update() {
        super.update();
    }

}

class Goal extends Object {
    constructor() {
        super();
        this.color = "purple";
        this.anchored = true;
    }
    update() {
        super.update();
    }

}

class Player extends Object {
    constructor() {
        super();
        this.lives = 3;
        this.xScreenPos = 0;
        this.yScreenPos = 0;
    }
    update() {
        super.update();

        this.xScreenPos = this.xPos - world.xScrollPos;


        var leftSoftScrollPos = 250;
        var leftHardScrollPos = 200;

        var rightSoftScrollPos = 350;
        var rightHardScrollPos = 400;


        var globalScrollSpeedMultipler = 1;

        var levelEdgeSoftScrollDistance = 50;

        // Set a global scroll speed multipler based on how much
        // the player intrudes into the levelEdgeSoftScrollDistance
        if (world.xScrollPos < levelEdgeSoftScrollDistance) {
            var softScrollPixels = levelEdgeSoftScrollDistance - world.xScrollPos;
            globalScrollSpeedMultipler = softScrollPixels.map(0, levelEdgeSoftScrollDistance, 1, 0.5);
        }
        else if (world.width - world.xScrollPos < levelEdgeSoftScrollDistance) {
            var softScrollPixels = levelEdgeSoftScrollDistance - (world.width - world.xScrollPos);
            globalScrollSpeedMultipler = softScrollPixels.map(0, levelEdgeSoftScrollDistance, 1, 0.5);
        }

        // Don't scroll the screen if at the level's edge
        if (world.xScrollPos >= 0) {

            // If the player is on the left of the screen
            if (this.xScreenPos < leftSoftScrollPos ) {

                // If player is only slightly towards the left
                if (this.xScreenPos > leftHardScrollPos) {

                    // Scroll the screen at a rate proportional
                    // to how far they are over to the edge
                    var howFarLeft = this.xScreenPos - leftSoftScrollPos;
                    var scrollRate = howFarLeft * 0.1 * globalScrollSpeedMultipler;

                    world.xScrollPos += Math.abs(scrollRate) * -1;

                }
                // If the player is very far towards the left
                else {

                    var scrollRate = player.xSpeed * globalScrollSpeedMultipler;

                    // scroll the screen as fast as they're moving
                    world.xScrollPos += Math.abs(scrollRate) * -1;
                }

            }

        }

        // Don't scroll the screen if at the level's edge
        if (world.xScrollPos <= world.width) {

            // If the player is on the right of the screen
            if (this.xScreenPos > rightSoftScrollPos) {

                // If player is only slightly towards the right
                if (this.xScreenPos < rightHardScrollPos) {

                    // Scroll the screen at a rate proportional
                    // to how far they are over to the edge
                    var howFarRight = this.xScreenPos - rightSoftScrollPos;
                    var scrollRate = howFarRight * 0.1 * globalScrollSpeedMultipler;

                    world.xScrollPos += scrollRate;
                }
                // If the player is very far towards the right
                else {
                    var scrollRate = player.xSpeed * globalScrollSpeedMultipler;

                    // scroll the screen as fast as they're moving
                    world.xScrollPos += scrollRate;
                }

            }
        }
    }
}


var levelObjectTypes = [Block,Goal];
