class GridCell {
    constructor() {
        this.isHovered = false;
        this.contains = [];
    }
}

class Grid {
    constructor() {
        this.size = 16;
        this.width = 256;
        this.height = 128;
        this.levelData = [[[]]];
        this.xScrollPos = 0;
        this.yScrollPos = 0;
        this.initialize = function() {

            // For each grid row
            for (var row = 0; row < this.height; row++) {

                if (this.levelData[row] == undefined) {
                    this.levelData.push([]);
                }

                // For each grid column
                for (var col = 0; col < this.width; col++) {

                    if (this.levelData[row][col] == undefined) {
                        this.levelData[row].push([]);
                    }

                    this.levelData[row][col].push(new GridCell());
                }
            }

        }
        this.draw = function () {

            var size = this.size * pixelRatio;

            // For each grid row
            for (var row = 0; row < this.height; row++) {
                // For each grid column
                for (var col = 0; col < this.width; col++) {
                    var xGridCellPos = (size * col) - Math.floor(this.xScrollPos);
                    var yGridCellPos = (size * row) - Math.floor(this.yScrollPos);

                    // Adjust values based on PPI setting
                    xGridCellPos = pixelRatio * Math.floor(xGridCellPos / pixelRatio);
                    yGridCellPos = pixelRatio * Math.floor(yGridCellPos / pixelRatio);


                    var mouseAlignsOnX = false;
                    var mouseAlignsOnY = false;

                    if (xMousePos > xGridCellPos) {
                        if (xMousePos < xGridCellPos + size) {
                            mouseAlignsOnX = true;
                        }
                    }

                    if (yMousePos > yGridCellPos) {
                        if (yMousePos < yGridCellPos + size) {
                            mouseAlignsOnY = true;
                        }
                    }

                    var currentGridCell = this.levelData[row][col][0];

                    if (mouseAlignsOnX && mouseAlignsOnY) {
                        currentGridCell.isHovered = true;
                        hoveredRow = row;
                        hoveredCol = col;
                    }

                    ctx.fillStyle = "#ddd";

                    // If we're a hovered grid cell
                    // fill in top and left edges
                    if (currentGridCell.isHovered == true) {
                        ctx.fillStyle = "#000";
                    }

                    ctx.lineWidth = 2;


                    // Left edge
                    ctx.fillRect(xGridCellPos, yGridCellPos, 1, size);

                    // Right edge
                    ctx.fillRect(xGridCellPos + size-2, yGridCellPos, 1, size);

                    // Top edge
                    ctx.fillRect(xGridCellPos, yGridCellPos, size, 1);

                    // Bottom edge
                    ctx.fillRect(xGridCellPos, yGridCellPos + size-2, size, 1);

                    currentGridCell.isHovered = false;

                }
            }
        };
    }
}

class Object {
    constructor() {
        this.width = grid.size;
        this.height = grid.size;
        this.color = "skyblue";
        this.anchored = false;
        this.xPos = 0;
        this.yPos = 0;
        this.xForce = 0;
        this.yForce = 0;
        this.xPushing = 0;
        this.yPushing = 0;
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
        this.yForce += this.yPushing;
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
    };
    draw() {
        var xObjectPos = this.xPos - grid.xScrollPos * pixelRatio;
        var yObjectPos = this.yPos - grid.yScrollPos * pixelRatio;

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

class Player extends Object {
    constructor() {
        super();
        this.lives = 3;
        this.xScreenPos = 0;
        this.yScreenPos = 0;
    }
    update() {
        super.update();

        this.xScreenPos = this.xPos - grid.xScrollPos;


        var leftSoftScrollPos = 250;
        var leftHardScrollPos = 200;

        var rightSoftScrollPos = 350;
        var rightHardScrollPos = 400;


        var globalScrollSpeedMultipler = 1;

        var levelEdgeSoftScrollDistance = 50;

        // Set a global scroll speed multipler based on how much
        // the player intrudes into the levelEdgeSoftScrollDistance
        if (grid.xScrollPos < levelEdgeSoftScrollDistance) {
            var softScrollPixels = levelEdgeSoftScrollDistance - grid.xScrollPos;
            globalScrollSpeedMultipler = softScrollPixels.map(0, levelEdgeSoftScrollDistance, 1, 0.5);
        }
        else if (grid.width - grid.xScrollPos < levelEdgeSoftScrollDistance) {
            var softScrollPixels = levelEdgeSoftScrollDistance - (grid.width - grid.xScrollPos);
            globalScrollSpeedMultipler = softScrollPixels.map(0, levelEdgeSoftScrollDistance, 1, 0.5);
        }

        // Don't scroll the screen if at the level's edge
        if (grid.xScrollPos >= 0) {

            // If the player is on the left of the screen
            if (this.xScreenPos < leftSoftScrollPos ) {

                // If player is only slightly towards the left
                if (this.xScreenPos > leftHardScrollPos) {

                    // Scroll the screen at a rate proportional
                    // to how far they are over to the edge
                    var howFarLeft = this.xScreenPos - leftSoftScrollPos;
                    var scrollRate = howFarLeft * 0.1 * globalScrollSpeedMultipler;

                    grid.xScrollPos += Math.abs(scrollRate) * -1;

                }
                // If the player is very far towards the left
                else {

                    var scrollRate = player.xSpeed * globalScrollSpeedMultipler;

                    // scroll the screen as fast as they're moving
                    grid.xScrollPos += Math.abs(scrollRate) * -1;
                }

            }

        }

        // Don't scroll the screen if at the level's edge
        if (grid.xScrollPos <= grid.width) {

            // If the player is on the right of the screen
            if (this.xScreenPos > rightSoftScrollPos) {

                // If player is only slightly towards the right
                if (this.xScreenPos < rightHardScrollPos) {

                    // Scroll the screen at a rate proportional
                    // to how far they are over to the edge
                    var howFarRight = this.xScreenPos - rightSoftScrollPos;
                    var scrollRate = howFarRight * 0.1 * globalScrollSpeedMultipler;

                    grid.xScrollPos += scrollRate;
                }
                // If the player is very far towards the right
                else {
                    var scrollRate = player.xSpeed * globalScrollSpeedMultipler;

                    // scroll the screen as fast as they're moving
                    grid.xScrollPos += scrollRate;
                }

            }
        }
    }
}
