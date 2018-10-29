"use strict";

//https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Global variables
// these are evil, get rid of them
var width = 640;
var height = 360;

var scaledWidth, scaledHeight;
var canvasInitialized = false;
var canvas, blurredCanvas;
var ctx, blurredCtx;
var gameMode = "edit";
var pressedKeys = [];
var objects = [];
var gravity = 0.3;
var airResistance = .9;
var xMousePos = 0;
var yMousePos = 0;
var pixelRatio = 1;
var highPpiEnabled = true;
var hoveredRow;
var hoveredCol;
var mouseDown = false;
var selectedObjectType = 0;
var storedLevel = [[]];
var levelData = [];
var paused = false;

var logging = {
    canvas: false,
    localStorage: false
}


var frames = 1;
var startTime = new Date();
var elapsedMillis;
var averageFramerate;


var drawAreas = {
    toolbar: [0, width, 48, 0],
    world: [48,630,300,10],
};






//http://bl.ocks.org/devgru/a9428ebd6e11353785f2
function getRetinaRatio() {
    var devicePixelRatio = window.devicePixelRatio || 1;
    var c = document.createElement('canvas').getContext('2d');
    var backingStoreRatio = [
        c.webkitBackingStorePixelRatio,
        c.mozBackingStorePixelRatio,
        c.msBackingStorePixelRatio,
        c.oBackingStorePixelRatio,
        c.backingStorePixelRatio,
        1
    ].reduce(function(a, b) { return a || b });

    return devicePixelRatio / backingStoreRatio;
}


// Initialize the canvas after DOM ready
$(function(){
    initializeCanvas();
});

function initializeCanvas() {

    if (highPpiEnabled === true) {
        pixelRatio = getRetinaRatio();
    }
    else {
        pixelRatio = getRetinaRatio() / 2;
    }

    var scaledWidth = width * pixelRatio;
    var scaledHeight = height * pixelRatio;

    $('canvas').remove();
        
    canvas = 
        $('<canvas/>',{
            'class':'canvas',
        })
        .css('width', width + 'px')
        .css('height', height + 'px')
        .appendTo("body");

    canvas[0].width = scaledWidth;
    canvas[0].height = scaledHeight;

    ctx = canvas[0].getContext('2d');

    //ctx.scale(pixelRatio,pixelRatio);

    canvasInitialized = true;

    if (logging.canvas === true) {
        console.log("canvas initialized at pixel ratio " + pixelRatio);
    }

}


if (typeof(Storage) !== "undefined") {
    
    if (localStorage.storedLevel !== undefined) {

        var decompressedLevelData = LZString.decompress(localStorage.storedLevel);

        if (logging.localData == true) {
            console.log(decompressedLevelData);
        }

        levelData = JSON.parse(decompressedLevelData);
    }

} else {
    // Sorry! No Web Storage support.
}
