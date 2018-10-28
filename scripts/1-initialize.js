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
var initialized = false;
var canvas, blurredCanvas;
var ctx, blurredCtx;
var gameMode = "play";
var pressedKeys = [];
var objects = [];
var gravity = 0.3;
var airResistance = .9;
var loops = 1;
var xMousePos = 0;
var yMousePos = 0;
var pixelRatio = 1;
var highPpiEnabled = true;
var hoveredRow;
var hoveredCol;
var mouseDown = false;

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


// Initialize the canvas
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

    initialized = true;   
    console.log("canvas initialized at pixel ratio " + pixelRatio);

}