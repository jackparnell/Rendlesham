Rendlesham.gameOver = function()
{

};

Rendlesham.gameOver.prototype = $.extend(true, {}, Rendlesham.gameState.prototype);

Rendlesham.gameOver.prototype.preload = function()
{
    this.backgrounds = game.add.group();

    this.linkBackgrounds = game.add.group();
    this.texts = game.add.group();

    loadMainFiles();
};

Rendlesham.gameOver.prototype.init = function(levelNumber)
{
    this.levelId = levelNumber;
};

Rendlesham.gameOver.prototype.tryAgain = function()
{
    game.state.start('main', true, true, this.levelId);
};

Rendlesham.gameOver.prototype.create = function()
{
    if (game.device.desktop == false) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = "#112c06";

    this.capturedText = game.add.bitmapText(500, game.height * .125, bitmapFontName, 'Captured', 80);
    this.capturedText.align = 'center';
    this.capturedText.x = (game.width * .5) - (this.capturedText.width * .5);

    this.detailsText = game.add.bitmapText(500, game.height * .35, bitmapFontName, 'You were captured by the humans', 20);
    this.detailsText.align = 'center';
    this.detailsText.x = (game.width * .5) - (this.detailsText.width * .5);


    this.addButtonTextLink('retry', 'Try Again', 46, 'forestGreen', 0, game.height * .5, 'center', 'tryAgain');

    this.addButtonTextLink('exit', 'Exit', 46, 'forestGreen', 0, game.height * .725, 'center', 'goToTitleScreen');

};