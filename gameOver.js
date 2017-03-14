Rendlesham.gameOver = function(){

};

Rendlesham.gameOver.prototype = {
    preload: function() {

        game.load.image('goToTitleScreen', 'assets/buttons/goToTitleScreen.png');

    },
    create: function(){

        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#000000';

        var style = {
            font: "80px Ubuntu",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        text = game.add.text(0, 0, 'Captured', style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 105, game.width, 100);

        var detailsStyle = {
            font: "24px Ubuntu",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var details = game.add.text(0, 0, 'You were captured by the humans.', detailsStyle);
        details.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        details.setTextBounds(0, 105, game.width, game.height * .6);

        var goToTitleScreen = game.add.button((game.width/2) - 95, game.height * .75, 'goToTitleScreen', this.goToTitleScreen, this);

        // Press SPACE to restart the game.
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.playTheGame);

    },

    goToTitleScreen: function(){
        game.state.start('titleScreen',true,false);
    },

    playTheGame: function(){
        game.state.start('main');
    }
}