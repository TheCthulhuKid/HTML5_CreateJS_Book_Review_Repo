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
function preload() {
    queue = new createjs.LoadQueue();
    queue.addEventListener('complete', setupSpritesheet);
    queue.loadManifest([
        {id:"fakezeeSpritesheet", src:"img/fakezee.png"},
        {id:"sheetData", src:"js/fakezee.json"}
    ]);
}

function setupSpritesheet() {
    spritesheet = new createjs.SpriteSheet(queue.getResult('sheetData'));
    initGame();
}

function initGame(){
    buildTitle();
    buildDiceTray();
    buildScoreCard();
    buildScoreboard();
    revealGame();
}

function buildTitle(){
    title = new createjs.Sprite(spritesheet, 'logoSmall');
    title.regX = title.getBounds().width / 2;
    title.x = canvas.width / 2;
    title.y = TITLE_YPOS;
    title.alpha = 0;
    stage.addChild(title);
}

//  Here is where all the elements at the top of the screen are set and placed within the 'diceTray' container
function buildDiceTray(){
    var trayBG, rollMsg, rollBtn, rollBG, rollsTxt, die;
    var rollBtnOffset = -27;
    var hGap = 60;
    var xPos = 37;
    var yPos = 37;

    //  Dice Tray
    diceTray = new createjs.Container();
    diceTray.x = DICE_TRAY_POSITION.x;
    diceTray.y = DICE_TRAY_POSITION.y;
    diceTray.alpha = 0;

    trayBG = new createjs.Sprite(spritesheet, 'diceTray');
    diceTray.addChild(trayBG);
    rollMsg = new createjs.Sprite(spritesheet, 'rollMessage');
    rollMsg.x = trayBG.getBounds().width;
    rollMsg.y = rollBtnOffset;
    rollMsg.name = 'rollMsg';
    rollMsg.visible = false;
    diceTray.addChild(rollMsg);

    //  Dice
    for(var i = 0; i < NUM_DICE; i++){
        die = new createjs.Sprite(spritesheet, 'die');
        die.name = 'die' + i;
        die.paused = true;
        die.visible = false;
        die.mouseEnabled = false;
        die.regX = die.getBounds().width / 2;
        die.regY = die.getBounds().height / 2;
        die.x = xPos;
        die.y = yPos;
        die.hold = false;
        die.on('click', holdDie);   //  On method is used here a shortcut to addEventListener
        xPos += hGap;
        diceTray.addChild(die);
    }

    //  Roll Button
    rollBtn = new createjs.Container();
    rollBtn.name = 'rollBtn';
    rollBtn.visible = false;
    rollBtn.x = xPos;
    rollBtn.y = yPos;
    rollBG = new createjs.Sprite(spritesheet, 'rollButton');
    rollBtn.addChild(rollBG);

    //  Roll Text
    rollsTxt = new createjs.Text(rollsLeft, '27px Calibri', '#FFF');
    rollsTxt.name = 'rollsTxt';
    rollsTxt.textAlign = 'center';
    rollsTxt.textBaseline = 'middle';
    rollsTxt.x = rollBtn.getBounds().width / 2;
    rollsTxt.y = rollBtn.getBounds().height / 2;

    rollBtn.regX = rollBtn.getBounds().width / 2;
    rollBtn.regY = rollBtn.getBounds().height / 2;
    rollBtn.addChild(rollsTxt);
    rollBtn.on('click', rollDice);
    diceTray.addChild(rollBtn);
    stage.addChild(diceTray);
}

function buildScoreCard(){
    var btn, scoreMsg, scoreTxt;
    var xPos = 0;
    var yPos = 0;
    var row = 0;
    var hGap = 49;
    var vGap = 390;
    var btnsPerRow = 6;
    var fakezeeBtnYPos = 75;
    var scoreMsgYPos = 150;
    var section = 1;

    scoreCard = new createjs.Container();
    scoreCard.mouseEnabled = false;
    scoreCard.x = SCORE_CARD_POSITION.x;
    scoreCard.y = SCORE_CARD_POSITION.y;

    //  Score Buttons
    for(var i = 0; i < scorecardButtons.length; i++){
        btn = new createjs.Sprite(spritesheet, scorecardButtons[i]);
        btn.paused = false;
        btn.name = scorecardButtons[i];
        btn.key = scorecardButtonKeys[i];
        btn.section = section;
        btn.x = xPos;
        btn.y = yPos;
        btn.framerate = 30;
        btn.on('animationend', function(e){
            this.stop();
        });
        btn.on('click', onScoreCardBtnClick);
        scoreCard.addChild(btn);

        yPos += hGap;
        row++;
        //  If the row has been filled then we move on to the next
        if(row == btnsPerRow){
            section++;
            row = 0;
            yPos = 0;
            xPos += vGap;
        }
    }

    //  Fakezee Button
    btn = new createjs.Sprite(spritesheet, 'fakezee');
    btn.paused = true;
    btn.name = btn.key = 'fakezee';
    btn.section = 2;
    btn.regX = btn.getBounds().width / 2;
    btn.regY = btn.getBounds().height / 2;
    btn.x = scoreCard.getBounds().width / 2;
    btn.y = 75;
    btn.alpha = 0;
    btn.on('click', onScoreCardBtnClick);
    scoreCard.addChild(btn);

    //  Score Message
    scoreMsg = new createjs.Sprite(spritesheet, 'totalScoreLabel');
    scoreMsg.name = 'scoreMsg';
    scoreMsg.regX = scoreMsg.getBounds().width / 2;
    scoreMsg.x = scoreCard.getBounds().width / 2;
    scoreMsg.y = scoreMsgYPos;
    scoreMsg.alpha = 0;
    scoreCard.addChild(scoreMsg);

    //  Score
    scoreTxt = new createjs.Text('0', '50px Calbri', '#FFF');
    scoreTxt.name = 'scoreTxt';
    scoreTxt.textAlign = 'center';
    scoreTxt.x = scoreCard.getBounds().width / 2;
    scoreTxt.y = scoreMsg.y + 30;
    scoreTxt.a;pha = 0;
    scoreCard.addChild(scoreTxt);

    stage.addChild(scoreCard);
}

function buildScoreboard(){
    var scoreBar, txt, xPos;
    var padding = 5;
    var sec1XPos = 12;
    var sec2XPos = 145;
    var bonusXPos = 280;

    scoreboard = new createjs.Container();
    scoreboard.x = SCOREBOARD_POSITION.x;
    scoreboard.y = SCOREBOARD_POSITION.y;
    scoreboard.alpha = 0;

    scoreBar = new createjs.Sprite(spritesheet, 'scoreBar');
    scoreBar.name = 'scoreBar';
    scoreboard.addChild(scoreBar);

    //  Section 1
    txt = createScoreboardText('Section 1 Score:', sec1XPos, padding);
    scoreboard.addChild(txt);
    xPos = txt.getMeasuredWidth(txt) + txt.x + padding;
    txt = createScoreboardText(section1Score, xPos, padding, 'section1Txt');
    scoreboard.addChild(txt);

    //  Section 2
    txt = createScoreboardText('Section 2 Score:', sec2XPos, padding);
    scoreboard.addChild(txt);
    xPos = txt.getMeasuredWidth(txt) + txt.x + padding;
    txt = createScoreboardText(section2Score, xPos, padding, 'section2Txt');
    scoreboard.addChild(txt);

    //  Bonus
    txt = createScoreboardText('Bonus Score:', bonusXPos, padding);
    scoreboard.addChild(txt);
    xPos = txt.getMeasuredWidth(txt) + txt.x + padding;
    txt = createScoreboardText(bonusScore, xPos, padding, 'bonusTxt');
    scoreboard.addChild(txt);

    stage.addChild(scoreboard);
}

function createScoreboardText(label, x, y, name){
    var txt = new createjs.Text(label, '16px Calibri', '#FFF');
    txt.x = x;
    txt.y = y + 3;
    txt.name = name;
    return txt;
}

function revealGame(){
    createjs.Tween.get(this).wait(100).call(revealTitle)
                            .wait(400).call(revealDiceTray)
                            .wait(1400).call(revealScoreCard)
                            .wait(2000).call(revealScoreboard);
}

function revealTitle(){
    createjs.Tween.get(title).to({alpha:1}, 500);
}

function revealDiceTray(){
    var die, delay, btn, rollMessage;
    createjs.Tween.get(diceTray).to({alpha:1}, 500);
    for(var i = 0; i < NUM_DICE; i++){
        die = diceTray.getChildByName('die' + i);
        die.scaleX = die.scaleY = 0;
        delay = (i * 150) + 500;
        createjs.Tween.get(die).wait(delay).to({scaleX:1, scaleY:1}, 1000, createjs.Ease.elasticOut);
        rollMsg = diceTray.getChildByName('rollMsg');
        createjs.Tween.gwt(rollMsg).wait(delay).to({alpha:1}, 1000);
    }
}

function revealScoreCard(){
    var btn, timer;
    var len = scorecardButtons.length;
    var i = 0;
    timer = setInterval(function(){
        btn = scoreCard.getChildAt(i);
        btn.play();
        i++;
        if(i == len){
            clearInterval(timer);
            btn = scoreCard.getChildByName('fakezee');
            btn.y -= 10;
            createjs.Tween.get(btn).to({alpha:1, y:btn.y + 10}, 500);
        }
    }, 100);
}

function revealScoreboard(){
    var totalScoreMsg = scoreCard.getChildByName('scoreMsg');
    var totalScoreTxt = scoreCard.getChildByName('scoreTxt');

    createjs.Tween.get(totalScoreMsg).to({alpha:1}, 500);
    createjs.Tween.get(totalScoreTxt).to({alpha:1}, 500);
    createjs.Tween.get(scoreboard).to({alpha:1}, 500);
}

function rollDice(e){
    var die;

    var rollBtn = e.currentTarget;
    var rollsTxt = rollBtn.getChildByName('rollsTxt');

    enableDice(false);

    scoreCard.mouseEnabled = false;
    rollBtn.mouseEnabled = false;
    rollBtn.alpha = .7;
    rollsLeft -= 1;
    rollsTxt.text = rollsLeft;

    for(var i = 0; i < NUM_DICE; i++){
        die = diceTray.getChildByName('die' + i);
        if(die.hold){
            continue;
        }
        die.framerate = Math.floor(Math.random() * 10) + 20;
        die.play();
    }

    setTimeout(stopDice, 1000);

}

function stopDice(){
    var die;
    diceValues = [];
     for(var i = 0; i < NUM_DICE; i++){
         die = diceTray.getChildByName('die' + i);
         die.stop();
         diceValues[i] = Math.floor(die.currentAnimationFrame) + 1;
     }

    if(rollsLeft > 0){
        enableDice(true);
        var rollBtn = diceTray.getChildByName('rollBtn');
        rollBtn.alpha = 1;
        rollBtn.mouseEnabled = true;
    }
    scoreCard.mouseEnabled = true;
}

function enableDice(enable){
    var die;
    for(var i = 0; i < NUM_DICE; i++){
        die = diceTray.getChildByName('die' + i);
        die.mouseEnabled = enable;
    }
}

function holdDie(e){
    var die = e.target;
    if(!die.hold){
        die.hold = true;
        die.alpha = .7;
    }else{
        die.hold = false;
        die.alpha = 1;
    }
}