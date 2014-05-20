(function(){
    window.ui = window.ui || {};

    var SimpleButton = function(label){
        this.label = label;
        this.initialize();
    }

    var p = SimpleButton.prototype = new createjs.Container();

    //  Button properties
    p.label;
    p.width;
    p.height;
    p.background;
    p.labelTxt;
    p.fontSize = 24;
    p.borderColor = '#000';
    p.buttonColor = '#ccc';
    p.upColor = '#ccc';
    p.overColor = '#aaa';

    p.Container_initialize = p.initialize;

    p.initialize = function(){
        this.Container_initialize();
    }

    p.drawButton = function(){
        this.removeAllChildren();
        this.labelTxt = new createjs.Text(this.label, this.fontSize + 'px Arial', this.color);

    }

    window.ui.SimpleButton = SimpleButton;
}());