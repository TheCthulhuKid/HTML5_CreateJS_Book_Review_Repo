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

//  Game variables -- I don't usually like to declare variables like this but with so many...
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