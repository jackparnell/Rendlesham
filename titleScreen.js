var tips = [
    "Stop the humans from collecting evidence of your existance."
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

        var button = game.add.button(game.world.centerX - 80, game.height * .8, 'button', this.playTheGame, this);

        // Press SPACE to play the game.
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.playTheGame, this);

        this.showTipText();

    },

    playTheGame: function(){
        changeGameState('main');
    },

    showTipText: function()
    {

        var style = {
            font: "48px Chewy",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.titleText = game.add.text(game.world.centerX, game.height * .2, "Rendlesham Forest", style);
        this.titleText.anchor.set(0.5);


        var captionStyle = {
            font: "36px Chewy",
            fill: "#FFCCCC",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.captionText = game.add.text(game.world.centerX, game.height * .35, "An extra-terrestrial tower defense game.", captionStyle);
        this.captionText.anchor.set(0.5);

        var tipStyle = {
            font: "20px Chewy",
            fill: "#CCFFCC",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var tipTextContent = tips[Math.floor(Math.random() * tips.length)];

        this.captionText = game.add.text(game.world.centerX, game.height * .5, tipTextContent, tipStyle);
        this.captionText.anchor.set(0.5);

    }
}