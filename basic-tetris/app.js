document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let squares = Array.from(document.querySelectorAll('.grid div'));
	const scoreDisplay = document.querySelector('#score');
	const startButton = document.querySelector('#start-button');
  const pauseButton = document.querySelector('#pause-button');
  const resetButton = document.querySelector('#reset-button');

	const GRID_WIDTH = 10;

	const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
  ]

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
  ]

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
  ]

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;
  let nextRandom = 0;
  let timerId = null;
  let score = 0;
  let isGameOver = false;
  let initialTimerId = 0;

  let colors = ['Black', 'Orange', 'Blue', 'Red', 'Brown'];

  //Generating a random tetromino
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //Draw the tetromino
  function draw() {
  	current.forEach(index => {
  		squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
  	});
  }

  
  // Undrawing the tetromino
  function undraw() {
  	current.forEach(index => {
  		squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
  	});
  }
  

  // making move down the tetromino every second
  // timerId = setInterval(moveDown, 1000);

  //control function corresponding to the keyCodes
  function control(e) {
  	if(e.keyCode == 37)
  		moveLeft();
  	else if(e.keyCode == 38)
  		rotate();
  	else if(e.keyCode == 39)
  		moveRight();
  	else if(e.keyCode == 40)
  		moveDown();
  }

document.addEventListener('keyup', control);
  //move down function
  function moveDown() {
    freeze();
  	undraw();
  	currentPosition += GRID_WIDTH;
  	draw();
  	freeze();	
  }

  // freeze function
  	function freeze() {
  		if(current.some(index => squares[currentPosition+ GRID_WIDTH + index].classList.contains('taken'))) {
  			current.forEach(index => squares[currentPosition + index].classList.add('taken'));

  			//start a new tetromino falling
        random = nextRandom;
  			nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  			current = theTetrominoes[random][currentRotation];
  			currentPosition	= 4;
  			draw();
        displayShape();
        addScore();
        gameOver();
      }
  		
  	}

  	//move left function
  	function moveLeft() {
  		undraw();

  		const isLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH == 0);

  		if(!isLeftEdge)	 currentPosition -= 1;
  		if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
  			currentPosition += 1; 
  		draw();	
  	}

  	function moveRight() {
  		undraw();

  		const isLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH == GRID_WIDTH-1);

  		if(!isLeftEdge)	 currentPosition += 1;
  		if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
  			currentPosition -= 1; 
  		draw();	
  	}

  	function rotate() {
  		undraw();
  		currentRotation++;
  		if(currentRotation % current.length === 0)
  			currentRotation = 0;

  		current = theTetrominoes[random][currentRotation];
  		draw();
  	}

    // show up next tetrimino in the mini grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    // Tetriminos Array without rotation
    const upNextTetriminos = [
      [1, displayWidth + 1, displayWidth * 2 + 1, 2],
      [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
      [1, displayWidth, displayWidth + 1, displayWidth + 2],
      [0, 1, displayWidth, displayWidth + 1],
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],

    ];

    //displaying the shape in the mini-grid
    function displayShape() {
      //removing the trace of previous shape
      displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
      });

      upNextTetriminos[nextRandom].forEach(index => { 
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
      });
    
    }

    // startButton.addEventListener('click', () => {
    //   if(timerId) {
    //     clearInterval(timerId);
    //     timerId = null;
    //   }
    //   else {
    //     draw();
    //     timerId = setInterval(moveDown, 1000);
    //     nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    //     displayShape();
    //   }
    // });

    startButton.addEventListener('click', () => {

      if(timerId === null) {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theTetrominoes.legnth);
        displayShape();
      }
    });

    pauseButton.addEventListener('click', () => {
      if(timerId) {
        initialTimerId = 1;
        clearInterval(timerId);
        timerId = null;
        displayShape(); 
      }
    });

    resetButton.addEventListener('click', () => {
      location.reload();
    });


    //add score
    function addScore() {
      for(let i=0; i<199; i+=GRID_WIDTH) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        if(row.every(index => squares[index].classList.contains('taken'))){
          score += 10;
          scoreDisplay.innerHTML = score;
          row.forEach(index => {
            squares[index].classList.remove('taken');
            squares[index].classList.remove('tetromino');
            squares[index].style.backgroundColor = "";
          });
        
          const squaresRemoved = squares.splice(i, GRID_WIDTH);
          squares = squaresRemoved.concat(squares);
          squares.forEach(cell => grid.appendChild(cell));
        }
      }
    }

    //Game over 
    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = score;
        alert("Game Over!");
        clearInterval(timerId);
        isGameOver = true;
      }
      if(isGameOver == true)
        location.reload();
    }

})