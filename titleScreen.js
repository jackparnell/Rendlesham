var tips = [
    "Jump over rocks and other obstacles by pressing SPACE."
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

        this.backgroundMountainsImage = this.game.add.tileSprite(0, 0, game.width, game.height, 'mountains');
        this.backgrounds.add(this.backgroundMountainsImage);
        this.backgroundMountainsImage.autoScroll(-10, 0);

        this.backgroundSlopeImage = this.game.add.tileSprite(0, 0, game.width, game.height, 'slope');
        this.backgrounds.add(this.backgroundSlopeImage);

        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        var button = game.add.button(game.world.centerX - 80, 370, 'button', this.playTheGame, this);

        // Press SPACE to play the game.
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.playTheGame, this);


    },

    playTheGame: function(){
        changeGameState('main');
    }
}