//  Constants declared with 'var' so as not to piss of IE

var TITLE_YPOS = 15;
var DICE_TRAY_POSITION = {x:78, y:78};
var SCORE_CARD_POSITION = {x:20, y:155};
var SCOREBOARD_POSITION = {x:75, y:460};
var NUM_DICE = 5;
var NUM_SCORES = 13;
var NUM_ROLLS = 3;

//  createjs variables
var canvas, stage, queue, spritesheet;

//  display objects
var title, diceTray, scoreboard, scoreCard;

//  scorecard buttons
var scorecardButtons = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'threeKind', 'fourKind',
                        'small', 'large', 'fullHouse', 'chance'];
var scorecardButtonKeys = [1, 2, 3, 4, 5, 6, 2, 3, 3, 4, 0, 0];

//  game values to reset
var section1Score = 0;
var section2Score = 0;
var bonusScore = 0;
var totalScore = 0;
var rollsLeft = 3;
var numScored = 0;
var diceValues = [];
var scoredFakezee = false;


function init(){
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on('tick', stage);
    preload();
}

//  Will load SpriteSheet when all files are loaded
function preload(){
    queue = new createjs.LoadQueue();
    queue.addEventListener('complete', setupSpritesheet);
    queue.loadManifest([{id:'fakezeeSpritesheet', src:'img/fakezee.png'},
                        {id:'fakezeeSpritesheetData', src:'js/fakezee.json'}]);
}

function setupSpriteSheet(){
    spritesheet = new createjs.SpriteSheet(queue.getResult('fakezeeSpritesheetData'));
    initGame();
}

function initGame(){
    buildTitle();
    buildDiceTray();
    buildScoreCard();
    buildScoreboard();
}

function buildTitle(){
    title = new creatjs.Sprite(spritesheet, 'logoSmall');
    title.regX = title.getBounds().width / 2;
    title.x = canvas.width / 2;
    title.y = TITLE_YPOS;
    //title.alpha = 0; TODO: This is only for testing purposes and must be removed before I'm finished
    stage.addChild(title);
}

//  Here is where all the elements at the top of the screen are set and placed within the 'diceTray' container
function buildDiceTray(){

}

function buildScoreCard(){

}

function buildScoreboard(){

}


