app.controller('MainController', ['$scope', '$timeout', function($scope, $timeout){
  //set attributes
  $scope.title = "Lyft Code Challenge";
  $scope.grid = generateGrid(side); // Generates an 8x8 grid using the variable side, declared in grid.js
  $scope.printout; // The route efficiency calculation, to be displayed under the grid

  $scope.setPoints = function(index){
    // This function is called when the user clicks a grid block.
    // The function dynamically assigns coordinate pairs A-D
    // If all four coordinates are set, clicks to grid blocks will
    // show the grid coordinates and index in the console, using the console.log statement below
    console.log("The value of index " + index + " is (" + this.grid[index].xVal + "," + this.grid[index].yVal + ").");

    // Initialize clearer variable names for A-D once the route has been determined
    var driver;
    var location;
    var nextStop;
    var finalDest;

    // A-D are global variables declared in grid.js
    if (A == null){
      A = index;
      this.grid[index].point="A";
      this.grid[index].color="lightskyblue";
    } else if (B == null){
      B = index;
      this.grid[index].color="lightskyblue";
      this.grid[index].point="B";
    } else if (C == null){
      C = index;
      this.grid[index].color="aquamarine";
      this.grid[index].point="C";
    } else if (D == null){
      D = index;
      this.grid[index].color="aquamarine";
      this.grid[index].point="D";
      // Now let's run some math to determine the driver, passengerLocation, and destination.
      driver = determineDriver(A, B, C, D);

      if (driver === $scope.grid[A]){
        // Driver A is the driver, we're picking up C and going to B
        location = A;
        nextStop = C;
        finalDest = B;
        scenario = 0;
        // $timeout(function(){ navigate(A, C, B, "#FFB4B2"); }, 1000);
        $timeout(function(){ navigate(location, nextStop, finalDest); }, 500);
      } else {
        // Driver C is the driver, we're picking up A and going to D
        location = C;
        nextStop = A;
        scenario = 1;
        finalDest = D;
        $timeout(function(){ navigate(location, nextStop, finalDest); }, 500);
      }

    }
  }


  // It makes more sense for these functions to be declared in the model, or grid.js,
  // but I need $scope to access the grid blocks

  var navHelper = function(location, nextStop, finalDest, correction, color){
    var colorSwap = $scope.grid[location].color;
    $scope.grid[location].color=color;
    location += correction;
    $scope.grid[location].color=colorSwap;
    // Call this function again recursively so it will delay properly in Angular
    $timeout(function(){ navigate(location, nextStop, finalDest); }, 500);
  }

  navigate = function(location, nextStop, finalDest){

    if ((location === finalDest)&&(nextStop === null)){
      console.log("You made it!");
    } else if (location !== nextStop) {

      // X Values 1
      if (((nextStop === null)&&($scope.grid[location].xVal > $scope.grid[finalDest].xVal))||(($scope.grid[location].xVal > $scope.grid[nextStop].xVal)&&($scope.grid[location].xVal > $scope.grid[finalDest].xVal))){
        // The driver is on the way to his final destination; display as green
        navHelper(location, nextStop, finalDest, -1, "#DFFFEA");
      } else if ($scope.grid[location].xVal > $scope.grid[nextStop].xVal) {
        // The driver is diverging from his final destination; display as red
        navHelper(location, nextStop, finalDest, -1, "#FFB4B2");
      }
      // X Values 2
      else if (((nextStop === null)&&($scope.grid[location].xVal < $scope.grid[finalDest].xVal))||(($scope.grid[location].xVal < $scope.grid[nextStop].xVal)&&($scope.grid[location].xVal < $scope.grid[finalDest].xVal))) {
        // on the way
        navHelper(location, nextStop, finalDest, 1, "#DFFFEA");
      } else if ($scope.grid[location].xVal < $scope.grid[nextStop].xVal) {
        // diverging
        navHelper(location, nextStop, finalDest, 1, "#FFB4B2");
      }
      // Y Values 1
      else if (((nextStop === null)&&($scope.grid[location].yVal > $scope.grid[finalDest].yVal))||($scope.grid[location].yVal > $scope.grid[nextStop].yVal)&&(($scope.grid[location].yVal > $scope.grid[finalDest].yVal))) {
        // on the way
        navHelper(location, nextStop, finalDest, side, "#DFFFEA");
      } else if ($scope.grid[location].yVal > $scope.grid[nextStop].yVal) {
        // diverging
        navHelper(location, nextStop, finalDest, side, "#FFB4B2");
      }
      // Y Values 2
      else if (((nextStop === null)&&($scope.grid[location].yVal < $scope.grid[finalDest].yVal))||($scope.grid[location].yVal < $scope.grid[nextStop].yVal)&&(($scope.grid[location].yVal < $scope.grid[finalDest].yVal))) {
        // on the way
        navHelper(location, nextStop, finalDest, side*-1, "#DFFFEA");
      } else if ($scope.grid[location].yVal < $scope.grid[nextStop].yVal) {
        // diverging
        navHelper(location, nextStop, finalDest, side*-1, "#FFB4B2");
      } else {
      console.log("You shouldn't be here.")
      }
    }

    if (location === nextStop) {
      console.log("One leg down.");
      if ((scenario === 0)&&(nextStop === C)){
        nextStop = D;
      } else if ((scenario === 0)&&(nextStop === D)){
        nextStop = B;
      } else if ((scenario === 0)&&(nextStop === B)){
        nextStop = null;
      }

      else if ((scenario === 1)&&(nextStop == A)){
        nextStop = B;
      } else if ((scenario === 1)&&(nextStop === B)){
        nextStop = D;
      } else if ((scenario === 1)&&(nextStop === D)){
        nextStop = null;
      }

      navigate(location, nextStop, finalDest, scenario);

    }
    }

  determineDriver = function(A, B, C, D){
    // initialize some nicer-looking variables to make this more readable
    var Ax = $scope.grid[A].xVal;
    var Ay = $scope.grid[A].yVal;
    var Bx = $scope.grid[B].xVal;
    var By = $scope.grid[B].yVal;
    var Cx = $scope.grid[C].xVal;
    var Cy = $scope.grid[C].yVal;
    var Dx = $scope.grid[D].xVal;
    var Dy = $scope.grid[D].yVal;

    // Drive length is the full potential drive, including the detour, for each driver.
    // Driver 1: A -> C -> D -> B
    // Driver 1: C -> A -> B -> D

    var driverOneDriveLength = (Math.abs(Ax - Cx) + Math.abs(Ay - Cy) + Math.abs(Cx - Dx) + Math.abs(Cy - Dy)+ Math.abs(Dx - Bx) + Math.abs(Dy - By));
    var driverTwoDriveLength = (Math.abs(Cx - Ax) + Math.abs(Cy - Ay) + Math.abs(Ax - Bx) + Math.abs(Ay - By)+ Math.abs(Bx - Dx) + Math.abs(By - Dy));

    // Drive Detour is the difference of each driver's initial route and above potential drive length

    var driverOneDetour = Math.abs(
        (Math.abs(Ax - Bx) + Math.abs(Ay - By)) - driverOneDriveLength);

    var driverTwoDetour = Math.abs(
        (Math.abs(Cx - Dx) + Math.abs(Cy - Dy)) - driverTwoDriveLength);


    // This next block could later be determined with a helper function to make the code simpler and more readable

    if (driverOneDetour > driverTwoDetour){
      // Driver 2 has the shorter detour
      console.log("Driver C has the shorter detour ( " + driverTwoDetour + " vs " + driverOneDetour + " ). This driver will take Driver A to B before going to D.");
      $scope.printout = "Driver C has the shorter detour ( " + driverTwoDetour + " vs " + driverOneDetour + " ). This driver will take Driver A to B before going to D.";
      return $scope.grid[C];
    } else if (driverOneDetour < driverTwoDetour) {
      // Driver 1 has the shorter detour
      console.log("Driver A has the shorter detour.( " + driverOneDetour + " vs " + driverTwoDetour + " ) He's picking up Driver C and going to B");
      $scope.printout = "Driver A has the shorter detour ( " + driverOneDetour + " vs " + driverTwoDetour + " ). This driver will take Driver C to D before going to B";
      return $scope.grid[A];
    } else {
      // Drivers have the same detour
      // The driver should be whomever would have the shorter overall route
      // If these are the same, the drivers flip a coin

      // In a later version of this code, I'd likely make this a separate function to keep the code clean.
      if (driverOneDriveLength < driverTwoDriveLength){
        console.log("Drivers have the same detour distance (" + driverOneDetour + " spaces), but driver A has a shorter drive (" + driverOneDriveLength + " spaces vs " + driverTwoDriveLength +").");
        $scope.printout = "Drivers have the same detour distance (" + driverOneDetour + " spaces), but driver A has a shorter drive (" + driverTwoDriveLength + " spaces vs " + driverOneDriveLength + " spaces)";
        return $scope.grid[A];
      } else if (driverOneDriveLength > driverTwoDriveLength) {
        console.log("Drivers have the same detour distance (" + driverOneDetour + " spaces), but driver A has a shorter drive (" + driverOneDriveLength + " spaces).");
        $scope.printout = "Drivers have the same detour distance (" + driverOneDetour + " spaces), but driver C has a shorter drive (" + driverOneDriveLength + " spaces vs " + driverTwoDriveLength + " spaces).";
        return $scope.grid[C];
      } else {
        console.log("Drivers have the same detour distance (" + driverOneDetour + " spaces) and equally lengthy drives (" + driverOneDriveLength + " spaces). Driver is assigned randomly.");
        $scope.printout = "Drivers have the same detour distance (" + driverOneDetour + " spaces) and equally lengthy drives (" + driverOneDriveLength + " spaces). Driver is assigned randomly.";
        var random = Math.floor(Math.random() * 10 + 1);
        if (random < 6){
          console.log("Driver A wins the coin toss.");
          $scope.printout += " Driver A wins the coin toss.";
          return $scope.grid[A];
        } else {
          console.log("Driver C wins the coin toss.");
          $scope.printout += " Driver C wins the coin toss.";
          return $scope.grid[C];
        }
      }
    }
  }

  $scope.resetGrid = function(){
    // This function clears the grid and resets the coordinate variables for another calculation.
    console.log("Entered function");
    $scope.grid = generateGrid(side);
    $scope.printout = "";
    A = null;
    B = null;
    C = null;
    D = null;
  }

}]);
