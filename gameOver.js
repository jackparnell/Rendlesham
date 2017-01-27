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
            font: "100px Arial",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        text = game.add.text(0, 0, 'Game Over :-(', style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 105, game.width, 100);

        var goToTitleScreen = game.add.button(game.world.centerX - 95, 400, 'goToTitleScreen', this.goToTitleScreen, this);

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