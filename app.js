document.addEventListener('DOMContentLoaded',()=>{
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom=0
  let timerId
  let score=0

  const colors= [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]


  //Tetrominos
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition=4
  let currentRotation=0

  //Random select a Tetromino
  let random=Math.floor(Math.random()*theTetrominoes.length)
  console.log(random)
  let current=theTetrominoes[random][currentRotation]


  //Draw function
  function draw() {
    current.forEach(index=>{
      squares[currentPosition+index].classList.add('tetromino')
      squares[currentPosition+index].style.backgroundColor=colors[random]
    })
  }

  //Undraw fucntion
  function undraw() {
    current.forEach(index=>{
      squares[currentPosition+index].classList.remove('tetromino')
        squares[currentPosition+index].style.backgroundColor=''
    })
  }

  //Assign listener to keys
  function control(e) {
    if(e.keyCode===37) {
      //left
      moveLeft();
    }
    else if (e.keyCode===38){
      //rotate
      rotate()
    }
    else if (e.keyCode===39){
      //right
      moveRight()
    }
    else if (e.keyCode===40){
      //moveDown
      moveDown()
    }

  }
  document.addEventListener('keyup', control)

  //Move down fucntion
  function moveDown() {
    undraw()
    currentPosition+=width
    draw()
    freeze()
  }

  //Freeze function, check if the tetromino has hit the bottom, if does, start a new tetromino from the top
  function freeze() {
    if(current.some(index=> squares[currentPosition+index+width].classList.contains('taken'))){
      current.forEach(index=>squares[currentPosition+index].classList.add('taken'))
      //start a new tetromino
      random=nextRandom
      nextRandom=Math.floor(Math.random()*theTetrominoes.length)
      current=theTetrominoes[random][currentRotation]
      currentPosition=4;
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //Move left, unless at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge=current.some(index=> (currentPosition+index)%width === 0)

    if(!isAtLeftEdge) currentPosition-=1

    if(current.some(index=> squares[currentPosition+index].classList.contains('taken'))){
      currentPosition+=1
    }
    draw()
  }

  //Move Right, unless at edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge=current.some(index=>(currentPosition+index)%width===width-1)

    if(!isAtRightEdge) currentPosition+=1

    if(current.some(index=> squares[currentPosition+index].classList.contains('taken'))){
      currentPosition-=1
    }
    draw();
  }

  //Rotate the Tetromino
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation===current.length){
      currentRotation=0
    }
    current=theTetrominoes[random][currentRotation]
    draw()
  }

  //Show next tetromino in mini grid
  const displaySquares=document.querySelectorAll('.mini-grid div')
  const displayWidth=4
  const displayIndex=0


  //The tetrominoes in the mini grid don't need rotations
  const upNextTetrominoes=[
    [1, displayWidth+1, displayWidth*2+1,2], //l
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
    [1, displayWidth, displayWidth+1, displayWidth+2], //t
    [0,1,displayWidth, displayWidth+1], //o
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
  ]

  //display the shape in the mini-grid
  function displayShape () {
    //clean the mini gird
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor=''
    })

    //draw on the minifgrid
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex+index].classList.add('tetromino')
      displaySquares[displayIndex+index].style.backgroundColor=colors[nextRandom]
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () =>{
    if(timerId){
      clearInterval(timerId)
      timerId=null
    }
    else {
      draw()
      timerId=setInterval(moveDown, 1000)
      nextRandom=Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })

  //Update score
  function addScore() {
    for (let i=0; i<199; i+=width){
      const row=[i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      if (row.every(index => squares[index].classList.contains('taken'))){
        score+=10
        scoreDisplay.innerHTML=score
        row.forEach(index=> {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor=''
        })
        const squaresRemoved=squares.splice(i, width)
        //console.log(squaresRemoved)
        squares=squaresRemoved.concat(squares)
        squares.forEach((cell => grid.appendChild(cell)))
      }
    }
  }

  //Game over
  function gameOver() {
    if(current.some(index=> squares[currentPosition+index].classList.contains('taken'))) {
      scoreDisplay.innerHTML='end'
      clearInterval(timerId)
    }
  }



















})
