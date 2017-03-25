var tips = [
    "Stop the humans from collecting evidence of your existence."
];

var Rendlesham = Rendlesham || {};

Rendlesham.titleScreen = function(){

};

Rendlesham.titleScreen.prototype = {
    preload: function() {

        this.backgrounds = game.add.group();

        loadMainFiles();

    },
    create: function(){

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        var button = game.add.button((game.width/2) - 80, game.height * .8, 'button', this.playTheGame, this);

        // Press SPACE to play the game.
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.playTheGame, this);

        this.showTipText();

    },

    playTheGame: function()
    {
        changeGameState('eastAnglia');
    },

    showTipText: function()
    {

        this.titleText = game.add.bitmapText(500, game.height * .15, 'gem', 'Rendlesham Forest', 64);
        this.titleText.x = (game.width / 2) - (this.titleText.width / 2);

        this.captionText = game.add.bitmapText(500, game.height * .375, 'gem', 'An extra-terrestrial tower defense game', 32);
        this.captionText.x = (game.width / 2) - (this.captionText.width / 2);
        this.captionText.tint = 0xFFCCCC;

        var tipStyle = {
            font: "20px Ubuntu",
            fill: "#CCFFCC",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var tipTextContent = tips[Math.floor(Math.random() * tips.length)];

        this.tipText = game.add.bitmapText(500, game.height * .55, 'gem', tipTextContent, 20);
        this.tipText.x = (game.width / 2) - (this.tipText.width / 2);
        this.tipText.tint = 0xCCFFCC;


    }
}