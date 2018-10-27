var grid = new Grid();
grid.initialize();

var player = new Player();
objects.push(player);

var ground = new Object();
ground.color = "green";
ground.mass = 10;
ground.width = 1000;
ground.height = 50;
ground.xPos = 0;
ground.yPos = 300;
ground.anchored = true;
objects.push(ground);
