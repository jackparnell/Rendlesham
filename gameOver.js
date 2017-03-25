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

        this.capturedText = game.add.bitmapText(500, 100, bitmapFontName, 'Captured', 80);
        this.capturedText.align = 'center';
        this.capturedText.x = (game.width / 2) - (this.capturedText.width / 2);

        this.detailsText = game.add.bitmapText(500, 200, bitmapFontName, 'You were captured by the humans', 20);
        this.detailsText.align = 'center';
        this.detailsText.x = (game.width / 2) - (this.detailsText.width / 2);

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