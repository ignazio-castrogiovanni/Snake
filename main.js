// Size of the world
var worldHeight = 15;
var worldWidth = 15;

var snakeWorld = [];
var snakeMessage = ['P','l','e','a','s','e','-','h','i','r','e','-','m','e','!',':',')'];
var finalMessageWin = "Good job! You completed the level with X points. You're shortlisted to hire me. Find information on how to reach me at ignazio.castrogiovanni.com";
var finalMessageLoose = "We genuinely appreciate your skills. Unfortunately we require someone with a higher level of expertise in typing and a faster reaction to unpredictable event so I regret to inform you we won't proceed with your hiring application :(";

var initialSnakePosition = {
  x : Math.floor(worldHeight/2),
  y : Math.floor(worldWidth/2)
};
// Snake Object
var snake = {
  body: [initialSnakePosition],
  currDirection: null,
  isGrowing: false
};

var directions = ['L','U','R','D'];


var startGame, stopGame;

// Set initial timeout
var timeout = 700;
var gameGoingOn = false;

(function() {
 // alert(currSnakePosition);
  // 1.  Create the grid (cells with coordinates?). And render it.
  // 2.  Create a snake object(object {array of cells (initially just one), position (changing on every key pressed) ).
  // 3.  Position the snake on the grid.
  // 4.  Create the food for the snake, randomly placed.
  // 5.  Create logic for the snake (key pressed change direction).
  // 6.  Create movement.
  //      6a.  Every timeout move the head of the snake towards the direction pressed
  //      6b.  Every timeout move every element of the tail in the position it is the previous element in the tail snake array.
  //      6c.  Add element to the tail when found an object.
  //      6d.  Game over when the snake touch the board.
  //      6e.  Game over when the snake touch himself.

  // Let's do that
  createGrid();
  renderWorld();

  // Listen to keyboard events
  document.onkeyup = keyCheck;
  function keyCheck() {
    //37, 38, 39, 40
    switch(event.keyCode) {
      case 37:
        snake.currDirection = directions[0];
        break;
      case 38:
        snake.currDirection = directions[1];
        break;
      case 39:
        snake.currDirection = directions[2];
        break;
      case 40:
        snake.currDirection = directions[3];
        break;
      default:
    }
   // alert(event.keyCode);
  }

  startGame = function() {
    gameGoingOn = true;
    console.log("Game started");
    console.log("Snake: " + snake.body[0]);

    // First direction... Random
    snake.currDirection = directions[Math.floor(Math.random() * 4)];
    //interval = setInterval(moveSnake, 1000);
    moveSnake();
};
   stopGame = function() {
    gameGoingOn = false;
};

 function createGrid() {
   // That's all we know :)
   // O = empty space
   // S = snake
   // F = food


   for(var rowIterator = 0; rowIterator < worldHeight; ++rowIterator) {
     snakeWorld[rowIterator] = [];
     for(var colIterator = 0; colIterator < worldWidth; ++colIterator) {
       if(colIterator === 0 ||
          colIterator === worldWidth - 1 ||
          rowIterator === 0 ||
          rowIterator === worldHeight - 1) {
         snakeWorld[rowIterator][colIterator] = 'X';
       } else {
         snakeWorld[rowIterator][colIterator] = 'O';
       }
     }
   }

   // Put the snake in the center-ish;
   var snakeHead = snake.body[0];
   snakeWorld[snakeHead.x][snakeHead.y] = 'S';

   createNewFood();
 }
  function createNewFood() {
    // Put the food in a random position;
    var foodPos, droppingFoodArea;
    do {
      foodPos = getRandomPosition();
      droppingFoodArea = snakeWorld[foodPos.x][foodPos.y];
    }
   // We're not than mean to put the food on the wall... Or put it in his body
   while ((droppingFoodArea === 'X') || isSnake(foodPos));

   snakeWorld[foodPos.x][foodPos.y] = 'F';
   console.log(snakeWorld);
  }

function isSnake(foodPos) {
  return snake.body.some(function(item) {
    return ((foodPos.x === item.x) && (foodPos.y === item.y));
  });
}
  function clearBoard() {
    var gameBoard = document.getElementById("gameBoard");
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild);
    }
  }


  function getRandomPosition() {
    var posObj = {};
    posObj.x  = Math.floor(Math.random() * worldWidth);
    posObj.y = Math.floor(Math.random() * worldHeight);
    return posObj;
  }

  function renderWorld(){
    var board = document.getElementById('gameBoard');

    // Create Row
    for (var rowIter = 0; rowIter < worldHeight; ++rowIter) {

      // Create single row inline-block.
      var currentRow = document.createElement('div');
      currentRow.setAttribute('class','row');

      for (var colIter = 0; colIter < worldWidth; ++colIter) {
        // Set the row.
        var currentElem = document.createElement('div');

        var cellClass = null;
        // Whatever is not a wall or food or empty space is a snake
        switch (snakeWorld[rowIter][colIter]) {
          case 'O':
          case 'X':
          case 'F':
          cellClass = snakeWorld[rowIter][colIter];
          break;
          default:
          cellClass = 'S';
        }
        currentElem.setAttribute('class', cellClass + ' cell ');
        currentElem.innerHTML = snakeWorld[rowIter][colIter];
        currentRow.appendChild(currentElem);
      }
      // Add the row to the board.
      board.appendChild(currentRow);
    }
  }

function moveSnake() {

// Clear snake space
  snake.body.forEach(function (item) {
    snakeWorld[item.x][item.y] = 'O';
  });

// Store the posistion of the last element in the tail.
var lastTailElementX = snake.body[snake.body.length - 1].x;
var lastTailElementY = snake.body[snake.body.length - 1].y;
var newTailElem = {
  x: lastTailElementX,
  y: lastTailElementY
};

console.log("Last Tail x:" + newTailElem.x + " y:" + newTailElem.y);
// Move every element of the tail where its closest left - array speaking - element is.
snake.body = snake.body.map(function(item, index, array) {
  if(index === 0) {
    return array[index];
  } else {
    var newX = array[index - 1].x;
    var newY = array[index - 1].y;

    return {
      x: newX,
      y: newY
    };
  }
});

// Move the head of the snake according to the current direction.
var snakeHeadPos = getNewSnakeHeadPosition(snake.body[0]);
console.log("Snake Head Position  x:" + snakeHeadPos.x + " y:" + snakeHeadPos.y);
snake.body[0] = snakeHeadPos;

// Check whether the snake is growing
// If the snake is growing, add the stored last tail element to the snake body.
if(snake.isGrowing) {
  console.log("Snake Is Growing. Add  " + newTailElem);
  snake.body.push(newTailElem);
  snake.body.forEach(function(item, index) {
    console.log("Item " + index + " x:" + item.x + "y:" + item.y );
  });
  snake.isGrowing = false;
}

  //Place the snake back to the board
  snake.body.forEach(function (item, index, array) {
    console.log("Snake element x:" + item.x + " y" + item.y);
    snakeWorld[item.x][item.y] = snakeMessage[index];
  });

  // Clear and re-ender map
  clearBoard();
  renderWorld();
  if(gameGoingOn) {
    setTimeout(moveSnake, timeout);
  }
}
  function getNewSnakeHeadPosition(snakeHead) {

    console.log("Snake Current Direction " + snake.currDirection);
    switch(snake.currDirection) {
      case 'U':
        snakeHead.y = snakeHead.y - 1;
        break;
      case 'R':
        snakeHead.x = snakeHead.x + 1;
        break;
      case 'D':
        snakeHead.y = snakeHead.y + 1;
        break;
      case 'L':
        snakeHead.x = snakeHead.x - 1;
        break;
      default:
    }

     // Check snake next move.
    if(checkSnakeHeadPosition(snakeHead)) {
      return snakeHead;
    } else {
      return null;
    }
  }

  function checkSnakeHeadPosition(snakeHead) {
    console.log("shh" + snakeHead);

    var inFrontOfTheSnake = snakeWorld[snakeHead.x][snakeHead.y];
    // Three possibilities
    // (1) Snake is going to crash against the wall :(
    // (2) Snake is going to crash against himself :(
    if ((inFrontOfTheSnake === 'X') || (inFrontOfTheSnake === 'S')) {
    gameOverLose();
    return false;
    }

    // (3) Snake has found food :)
     if(inFrontOfTheSnake === 'F') {
       // It's time to grow up
       growSnake();
       // Create new food
       createNewFood();
     }
    return true;
  }

  function gameOverLose() {
    alert(finalMessageLoose);
    stopGame();
  }

  function gameOverWin() {
    alert(finalMessageWin);
    stopGame();
    window.location="http://ignazio-castrogiovanni.com";
  }

  function growSnake() {
    // Check whether we won
    if(snake.body.length === snakeMessage.length) {
      gameOverWin();
    }

    timeout = timeout - 35;
    // Add an element to the end of the tail.
    // Set isGrowing property of the snake to 'true' so that the growing can be handled along with the moving.
    snake.isGrowing = true;
  }
})();
