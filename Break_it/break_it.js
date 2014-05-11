//  Constants are set with 'var' instead of 'const' to cut down on friction with the ever friendly IE
var WALL_THICKNESS = 20;
var PADDLE_WIDTH = 100;
var PADDLE_SPEED = 16;
var PUCK_SPEED = 5;
var PADDLE_HITS_FOR_NEXT_LEVEL = 5;
var SCORE_BOARD_HEIGHT = 50;
var ARROW_KEY_LEFT = 37;
var ARROW_KEY_RIGHT = 39;
var SPACE_BAR = 32;

//  Game variables -- I don't usually like to declare variables like this but with so many and they do it in the book...
var canvas, stage, paddle, puck, board, scoreTxt, livesTxt, messageTxt, messageInterval;
var leftWall, rightWall, ceiling, floor;

var leftKeyDown = false;
var rightKeyDown = false;

var bricks = [];
var paddleHits = 0;
var score = 0;
var lives = 5;
var combo = 0;
var level = 0;

var gameRunning = true;

var levels = [
   {color:'#705000', points:1},
   {color:'#743fab', points:2},
   {color:'#4f5e04', points:3},
   {color:'#1b5b97', points:4},
   {color:'#c6c43b', points:5},
   {color:'#1a6d68', points:6},
   {color:'#aa7223', points:7},
   {color:'#743fab', points:8},
   {color:'#4f5e04', points:9},
   {color:'#1b5b97', points:10},
   {color:'#c6c43b', points:11},
   {color:'#1a6d68', points:12}
    ];

function init(){
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);
    newGame();
    startGame();
}

function newGame(){
    buildWalls();
    buildMessageBoard();
    buildPaddle();
    buildPuck();
    setControls();
    newLevel();
    newLevel();
}

//  Set walls and ceiling for the game
function buildWalls(){
    //  Left wall
    var wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0,0, WALL_THICKNESS, canvas.height);
    stage.addChild(wall);

    //  Right wall
    wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0,0, WALL_THICKNESS, canvas.height);
    wall.x = canvas.width - WALL_THICKNESS;
    stage.addChild(wall);

    //  Ceiling
    wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0, 0, canvas.width, WALL_THICKNESS);
    stage.addChild(wall);

    //  Set actual boundaries
    leftWall = WALL_THICKNESS;
    rightWall = canvas.width - WALL_THICKNESS;
    ceiling = WALL_THICKNESS;
}

function buildMessageBoard(){
    //  Create the board body
    board = new createjs.Shape();
    board.graphics.beginFill('#333');
    board.graphics.drawRect(0, 0, canvas.width, SCORE_BOARD_HEIGHT);
    board.y = canvas.height -  SCORE_BOARD_HEIGHT;
    stage.addChild(board);

    //  Life display
    livesTxt = new createjs.Text('Lives: ' + lives, '20px Times', '#fff');
    livesTxt.y = board.y + 10;
    livesTxt.x = WALL_THICKNESS;
    stage.addChild(livesTxt);

    //  Score display
    scoreTxt = new createjs.Text('Score: ' + score, '20px Times', '#fff');
    scoreTxt.textAlign = 'right';
    scoreTxt.y = board.y + 10;
    scoreTxt.x = canvas.width - WALL_THICKNESS;
    stage.addChild(scoreTxt);

    //  Message display
    messageTxt = new createjs.Text('Press the space bar to pause', '18px Times', '#fff');   //  Dynamic would be better
    messageTxt.textAlign = 'center';
    messageTxt.y = board.y + 10;
    messageTxt.x = canvas.width / 2;
    stage.addChild(messageTxt);
}

function buildPaddle(){
    paddle = new createjs.Shape();
    paddle.width = PADDLE_WIDTH;
    paddle.height = 20;
    paddle.graphics.beginFill('#3e6dc0').drawRect(0, 0, paddle.width, paddle.height);
    paddle.nextX = 0;
    paddle.x = 20;
    paddle.y = canvas.height - paddle.height - SCORE_BOARD_HEIGHT;
    stage.addChild(paddle);
}

function buildPuck(){
    puck = new createjs.Shape();
    puck.graphics.beginFill('#ffffff').drawRect(0, 0, 10, 10);
    puck.width = 10;
    puck.height = 10;
    puck.x = canvas.width - 100;
    puck.y = 160;
    puck.velX = PUCK_SPEED;
    puck.velY = PUCK_SPEED;
    puck.isAlive = true;
    stage.addChildAt(puck, 0);
}

function setControls(){
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
}

//  Key down event listener
function handleKeyDown(e){
    switch (e.keyCode){
        case ARROW_KEY_LEFT:
            leftKeyDown = true;
            break;

        case ARROW_KEY_RIGHT:
            rightKeyDown = true;
            break;
    }
}

//  Key up event listener
function handleKeyUp(e){
    switch (e.keyCode){
        case ARROW_KEY_LEFT:
            leftKeyDown = false;
            break;

        case ARROW_KEY_RIGHT:
            rightKeyDown = false;
            break;

        case SPACE_BAR:
            if (gameRunning){
                createjs.Ticker.setPaused(!createjs.Ticker.getPaused())
            }else{
                resetGame();
            }
            break;
    }
}


function newLevel(){
    var i, brick, freeLifeTxt;
    var data = levels[level];
    var xPos = WALL_THICKNESS;
    var yPos = WALL_THICKNESS;
    var freeLife = Math.round(Math.random() * 20);

    paddleHits = 0;
    shiftBricksDown();

    for(i = 0; i < 20; i++){
        brick = new createjs.Shape();
        brick.graphics.beginFill(i == freeLife ? '#009900' : data.color);
        brick.graphics.drawRect(0, 0, 76, 20);
        brick.graphics.endFill();
        brick.width = 76;
        brick.height = 20;
        brick.x = xPos;
        brick.y = yPos;
        brick.points = data.points; //  Score awarded
        brick.freeLife = false;

        bricks.push(brick);
        stage.addChild(brick);

        if(i ==  freeLife){
            freeLifeTxt = new createjs.Text('1UP!', '12px Times', '#fff');
            freeLifeTxt.x = brick.x + (brick.width / 2);
            freeLifeTxt.y = brick.y + 4;
            freeLifeTxt.width = brick.width;
            freeLifeTxt.textAlign = 'center';
            brick.freeLife = freeLifeTxt;
            stage.addChild(freeLifeTxt);
        }

        xPos += 76;
        if(xPos > (brick.width * 10)){
            xPos = WALL_THICKNESS;
            yPos += brick.height;
        }
    }

    level++;
    if(level == levels.length){
        level--;
    }
}

function shiftBricksDown(){
    var i, brick;
    var shiftHeight = 80;
    var len = bricks.length;
    for(i = 0; i < len; i++){
        brick = bricks[i];
        brick.y += shiftHeight;
        if(brick.freeLife){
            brick.freeLife.y += shiftHeight;
        }
    }
}

function update(){
    updatePaddle();
    updatePuck();
    checkPaddle();
    checkBricks();
}

function updatePaddle(){
    var nextX = paddle.x;
    if(leftKeyDown){
        nextX = paddle.x - PADDLE_SPEED;
        if(nextX < leftWall){
            nextX = leftWall;
        }
    }else if(rightKeyDown){
        nextX = paddle.x + PADDLE_SPEED;
        if(nextX > rightWall - paddle.width){
            nextX = rightWall - paddle.width;
        }
    }

    paddle.nextX = nextX;
}

function updatePuck(){
    var nextX = puck.x + puck.velX;
    var nextY = puck.y + puck.velY;

    if(nextX < leftWall){
        nextX = leftWall;
        puck.velX *= -1;
    }else if(nextX > rightWall - puck.width){
        nextX = rightWall - puck.width;
        puck.velX *= -1;
    }

    if(nextY < ceiling){
        nextY = ceiling;
        puck.velY *= -1;
    }

    puck.nextX = nextX;
    puck.nextY = nextY;
}

function checkPaddle(){
    if(puck.velY > 0 && puck.isAlive &&puck.nextY > (paddle.y - paddle.height) &&
        puck.nextX >= paddle.x && puck.nextX <= (paddle.x + paddle.width)){
        puck.nextY = paddle.y - puck.height;
        combo = 0;
        paddleHits++;
        puck.velY *= -1;
    }
}

function checkBricks(){
    if(!puck.isAlive){
        return;
    }

    var i, brick;

    for(i = 0; i < bricks.length; i++){
        brick = bricks[i];

        if(puck.nextY >= brick.y && puck.nextY <= (brick.y + brick.height)&&
            puck.nextX >= brick.x && puck.nextX <= (brick.x + brick.width)){
                score += brick.points;
                combo++;
                if(brick.freeLife){
                    lives++;
                    createjs.Tween.get(brick.freeLife).to({alpha:0, y:brick.freeLife.y - 100}, 1000).call(function(){
                        stage.removeChild(this);
                    });
                }

            if(combo > 4){
                score += combo * 10;
                var comboTxt = new createjs.Text('COMBO X ' + (combo * 10), '14px Times', '#FF0000');
                comboTxt.x = brick.x;
                comboTxt.y = brick.y;
                comboTxt.regX = brick.width / 2;
                comboTxt.regY = brick.height / 2;
                comboTxt.alpha = 0;
                stage.addChild(comboTxt);
                createjs.Tween.get(comboTxt).to({alpha:1, scaleX:2, scaleY:2, y:comboTxt.y - 60}, 1000).call(function ()
                {
                      stage.removeChild(this);
               });
         }

         stage.removeChild(brick);
         bricks.splice(i, 1);
         puck.velY *= -1;
         break; //  Only one collision need be recorded per update
        }
    }
}

function render(){
    paddle.x = paddle.nextX;
    puck.x = puck.nextX;
    puck.y = puck.nextY;
    livesTxt.text = 'Lives: ' + lives;
    scoreTxt.text = 'Score: ' + score;
}

function evalPuck(){
    if(puck.y > paddle.y){
        puck.isAlive = false;
    }

    if(puck.y > canvas.height + 200){
        puck.y = bricks[0].y + bricks[0].height + 40;
        puck.x = canvas.width / 2;
        puck.velX *= -1;
        puck.isAlive = true;
        combo = 0;
        lives--;
    }
}

function evalGame(){
    if(lives < 0 || bricks[0].y > board.y){
        gameOver();
    }

    if(paddleHits == PADDLE_HITS_FOR_NEXT_LEVEL){
        newLevel();
    }
}

function gameOver(){
    createjs.Ticker.setPaused(true);
    gameRunning = false;
    messageTxt.text = 'Press Space to Play';
    puck.visible = false;
    paddle.visible = false;
    stage.update();
    messageInterval = setInterval(function(){
        messageTxt.visible = messageTxt.visible ? false : true;
        stage.update();
    }, 1000);
}

function resetGame() {
    clearInterval(messageInterval);
    level = 0;
    score = 0;
    lives = 5;
    paddleHits = 0;
    puck.y = 160;
    puck.vely = PUCK_SPEED;
    puck.visible = true;
    paddle.visible = true;
    messageTxt.visible = true;
    gameRunning = true;
    messageTxt.text = "press spacebar to pause";
    stage.update();
    removeBricks();
    newLevel();
    newLevel();
    createjs.Ticker.setPaused(false);
}

function removeBricks() {
    var i, brick;
    for (i = 0; i < bricks.length; i++) {
        brick = bricks[i];
        if (brick.freeLife) {
            stage.removeChild(brick.freeLife);
        }
        stage.removeChild(brick);
    }
    bricks = [];
}
function startGame(){
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', function(e){
        if(!e.paused){
            runGame();
            stage.update();
        }
    });
}

function runGame(){
    update();
    render();
    evalPuck();
    evalGame();
}