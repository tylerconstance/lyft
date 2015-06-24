var Block = function(side, count){
  this.xVal = count%side;
  this.yVal = Math.abs(Math.floor(count/side) - (side - 1));
  // yVal computation sets the y value, then subtracts side-1 and takes the absolute value to put the origin at the bottom left of the grid.
  this.color;
  this.point;
}

var side = 8; // How many sides in the grid. In this case, it'll be 8x8
var A; // Driver 1, initial location
var B; // Driver 1, destination
var C; // Driver 2, initial location
var D; // Driver 2, Destination

// var color; // Color of each block
var scenario; // Scenario 0 is Driver 1 as the driver. Scenario 1 is Driver 2

generateGrid = function(side){
  // Generates each grid block's index and coordinate values
  var area = side*side;
  console.log("The area is "+ area);
  var grid = {};
  for (i = 0; i < area; i++){

    // "lazy initialization"
    if (!grid[i]) grid[i] = []
    grid[i] = new Block(side, i);
  }

  return grid;
};
