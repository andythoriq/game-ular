// element
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const scoreEl = document.getElementById('score-span')
const gameOverEl = document.getElementById('game-over-section')
const playAgainEl = document.getElementById('play-again-btn')
const inputNameEl = document.getElementById('name-input')
const yourName = document.getElementById('player-name-span')
const yourScore = document.getElementById('player-score-span')

// input directions
const directions = {
    UP: 'w', DOWN: 's', LEFT: 'a', RIGHT: 'd'
}

// colors
const headColor = 'blue'
const bodyColor = 'aqua'
const boardColor = '#4B56D2'
const foodColor = 'orange'

// sizes
const TILE_COUNT = 25
const squareSize = canvas.height / TILE_COUNT
const horizontalSize = 39
const verticalSize = 24

// Players
const players = JSON.parse(localStorage.getItem('players')) || []

// Game
const Game = {
    over: function () {
        clearInterval(gameLoop)
        players.push({ name: inputNameEl.value, score: Snake.body.length })
        localStorage.setItem('players', JSON.stringify(players))
        gameOverEl.classList.remove('hide')
        yourName.innerText = inputNameEl.value
        yourScore.innerText = Snake.body.length
    },
    isStarted: false,
    FPS: 1000 / 10
}

// Snake
const Snake = {
    body: [ { x: 20, y: 12 }, { x: 19, y: 12 }, { x: 18, y: 12 }, { x: 17, y: 12 }, { x: 16, y: 12 }, { x: 15, y: 12 } ],
    hitWall: function () {
        const head = Snake.body[ 0 ]
        return head.x < 0 || head.x > horizontalSize || head.y < 0 || head.y > verticalSize
    },
    hitSelf: function () {
        const body = [ ...Snake.body ]
        const head = body.shift()
        return body.some(part => head.x === part.x && head.y === part.y)
    },
    currentDirection: directions.RIGHT,
    directionsQueue: [],
    eatFood: function () {
        return this.body[ 0 ].x === Food.x && this.body[ 0 ].y === Food.y
    }
}

// Food
const Food = {
    createPosition: function () {
        this.x = ~~(Math.random() * TILE_COUNT)
        this.y = ~~(Math.random() * TILE_COUNT)
        while (Snake.body.some(part => part.x === this.x && part.y === this.y)) {
            this.x = ~~(Math.random() * TILE_COUNT)
            this.y = ~~(Math.random() * TILE_COUNT)
        }
    },
    x: 0, y: 0
}

// create square template
const createSquare = (x, y, color) => {
    context.fillStyle = color
    context.fillRect(squareSize * x, squareSize * y, squareSize, squareSize)
    context.strokeStyle = 'black'
    context.strokeRect(squareSize * x, squareSize * y, squareSize, squareSize)
}

// click play button to start
document.getElementById('play-btn').addEventListener('click', _ => {
    if (!Game.isStarted) {
        Game.isStarted = true
        gameLoop = setInterval(frame, Game.FPS);
    }
});

// draw food //
Food.createPosition()
function _drawFood() {
    createSquare(Food.x, Food.y, foodColor)
}

// input snake direction
window.addEventListener('keyup', e => {
    const newDirection = e.key.toLowerCase()
    const oldDirection = Snake.currentDirection
    if ( // opposite movement check
        (newDirection === directions.UP && oldDirection !== directions.DOWN) ||
        (newDirection === directions.DOWN && oldDirection !== directions.UP) ||
        (newDirection === directions.LEFT && oldDirection !== directions.RIGHT) ||
        (newDirection === directions.RIGHT && oldDirection !== directions.LEFT)
    ) {
        // set new direction on the first index of queue
        Snake.directionsQueue.push(newDirection)
    }
})

// move snake //
function _moveSnake() {
    if (!Game.isStarted) return;
    const head = { ...Snake.body[ 0 ] }

    // consume the current direction every render
    if (Snake.directionsQueue.length) Snake.currentDirection = Snake.directionsQueue.shift()

    switch (Snake.currentDirection) {
        case directions.UP:
            head.y -= 1
            break;
        case directions.DOWN:
            head.y += 1
            break;
        case directions.LEFT:
            head.x -= 1
            break;
        case directions.RIGHT:
            head.x += 1
            break;
    }
    if (Snake.eatFood()) {
        Food.createPosition()
    } else {
        Snake.body.pop() // remove the last snake part
    }
    Snake.body.unshift(head) // add new head to start of snake body
}

// draw snake //
function _drawSnake() {
    Snake.body.forEach((part, i) => createSquare(part.x, part.y, i === 0 ? headColor : bodyColor))
}

// draw board //
function _drawBoard() {
    context.fillStyle = boardColor
    context.fillRect(0, 0, canvas.width, canvas.height)
}

// render score //
function _renderScore() {
    scoreEl.innerText = Snake.body.length
}

let gameLoop
function frame() {
    _drawBoard()
    _drawFood()
    _moveSnake()
    _drawSnake()
    _renderScore()
    if (Snake.hitSelf() || Snake.hitWall()) {
        clearInterval(gameLoop)
        Game.over()
    }
}
frame()

playAgainEl.addEventListener('click', () => {
    // Snake Reset
    Snake.body = [ { x: 20, y: 12 }, { x: 19, y: 12 }, { x: 18, y: 12 }, { x: 17, y: 12 }, { x: 16, y: 12 }, { x: 15, y: 12 } ]
    Snake.currentDirection = ''
    Snake.directionsQueue = []

    // Game Over Screen
    gameOverEl.classList.add('hide')

    // Game Reset
    Game.isStarted = false
    frame()
})