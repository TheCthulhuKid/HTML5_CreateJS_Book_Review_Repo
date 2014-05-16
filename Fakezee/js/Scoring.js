//  Scoring object
var Scoring = {
    dice: [],
    btnKey: null
};

Scoring.getScore = function(type, dice, key){
    dice.sort();
    this.dice = dice;
    this.btnKey = key;

    switch(type){
        case 'ones':
        case 'twos':
        case 'threes':
        case 'fours':
        case 'fives':
        case 'sixes':
            return this.getNumberScore();

        case 'threeKind':
        case 'fourKind':
            return this.getKinds();

        case 'small':
        case 'large':
            this.dice = this.uniqueArray(this.dice);
            return this.getStraights();

        case 'fullHouse':
            this.dice = this.uniqueArray(this.dice);
            return this.getFullHouse();

        case 'chance':
            return this.getChance();

        case 'fakezee':
            this.dice = this.uniqueArray(this.dice);
            return this.getFakezee();

        case 'bonus':
            this.dice = this.uniqueArray(this.dice);
            return this.getFakezee() * 2;
    }
}

Scoring.getNumberScore = function(){
    var score = 0;
    var len = this.dice.length;
    for (var i = 0; i < len; i++){
        if(this.dice[i] == this.btnKey){
            score += this.dice[i];
        }
    }

    return score;
}

Scoring.getKinds = function(){
    var match = 0;
    var score = 0;
    var pass = false;
    var matchesNeeded = this.btnKey;
    var len = this.dice.length;

    for(var i = 0; i < len; i++){
        score += this.dice[i];
        if(this.dice[i] == this.dice[i + 1]){
            if(i != len){
                match++;
                if(match >= matchesNeeded){
                    pass = true;
                }
            }
        }else{
            match = 0
        }
    }

    score = pass ? score : 0;

    return score;
}

Scoring.uniqueArray = function(a){
    var temp = {};
    for(var i = 0; i < a.length; i++){
        temp[a[i]] = true;
    }

    var r = [];
    for(var k in temp){
        r.push(k/1);
    }

    return r;
}

Scoring.getStraights = function(){
    var match = 0;
    var score = this.btnKey == 4 ? 30 : 40;
    var matchesNeeded = this.btnKey;
    var len = this.dice.length - 1;

    for(var i = 0; i < len; i++){
        if(this.dice[i] == (this.dice[i +1] -1)){
            match++;
            if(match >= matchesNeeded){
                return score;
            }
        }else{
            match = 0
        }
    }

    return 0;
}

//  This function is significantly different to that in the book which was extremely verbose
//  and included a large if statement. Instead I utilised the existing uniqueArray function
//  to come to the same logical answer. Ditto for getFakezee
Scoring.getFullHouse = function(){
    return this.dice.length == 2 ? 25 : 0;
}

Scoring.getChance = function(){
    var score = 0;
    for(var i = 0; i < this.dice.length; i++){
        score += this.dice[i];
    }

    return score;
}

Scoring.getFakezee = function(){
    return this.dice.length == 1 ? 50 : 0;
}


