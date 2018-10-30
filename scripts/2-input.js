
$(document).keydown(function(e) {
    // If key is not already pressed
    if (!pressedKeys.includes(e.key)) {
        // Add it to the array
        pressedKeys.push(e.key);
    }
});

$(document).keyup(function(e) { 
    // Get the index of the released key
    var index = pressedKeys.indexOf(e.key);
    // Remove this key from the array
    pressedKeys.splice(index, 1);

    switch(e.key) {
        case "ArrowUp":
            player.yPushingFrames = NaN;
            break;
    }

});

function handlePressedKeys() {
    for (var i=0; i<pressedKeys.length; i++) {

        switch(pressedKeys[i]) {
            case "ArrowUp":
                player.yPushing = 10;
                break;
            case "ArrowRight":
                player.xPushing = 1;
                break;
            case "ArrowDown":
                //player.yPushing = -1;
                break;
            case "ArrowLeft":
                player.xPushing = -1;
                break;
            case "e":
                gameMode = "edit";
                break;
                case "p":
                gameMode = "play";
                break;
            case "1":
                highPpiEnabled = false;
                initializeCanvas();
                break;
            case "2":
                highPpiEnabled = true;
                initializeCanvas();
                break;

            case "s":
                saveLevel();
                break;
                
        }
    }
}

$(window).mousemove(function (e) {

    if (mouseDown === true && gameMode === "edit") {
        placeObject();
    }

    xMousePos = (e.clientX) - (drawAreas.world[3]) - ($('canvas')[0].offsetLeft);
    yMousePos = (e.clientY) - (drawAreas.world[0]) - ($('canvas')[0].offsetTop);

});

$(window).mousedown(function (e) {

    mouseDown = true;

    if (gameMode === "edit") {
        placeObject();
    }

});
$(window).mouseup(function (e) {

    mouseDown = false;

});