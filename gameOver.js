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

Rendlesham.gameOver.prototype.create = function()
{
    if (game.device.desktop == false) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = "#112c06";

    this.capturedText = game.add.bitmapText(500, 100, bitmapFontName, 'Captured', 80);
    this.capturedText.align = 'center';
    this.capturedText.x = (game.width / 2) - (this.capturedText.width / 2);

    this.detailsText = game.add.bitmapText(500, 200, bitmapFontName, 'You were captured by the humans', 20);
    this.detailsText.align = 'center';
    this.detailsText.x = (game.width / 2) - (this.detailsText.width / 2);


    // Begin try again link
    this.tryAgainLink = game.add.bitmapText(
        game.camera.width / 2,
        game.height * .72,
        bitmapFontName,
        'Try Again',
        48
    );
    this.tryAgainLink.x = (game.camera.width / 2) - (this.tryAgainLink.width / 2);
    this.tryAgainLink.fixedToCamera = true;

    this.tryAgainLinkButton = game.add.button(
        game.world.centerX - 80,
        this.tryAgainLink.y,
        'forestGreen',
        this.tryAgain,
        this
    );
    this.linkBackgrounds.add(this.tryAgainLinkButton);
    this.tryAgainLinkButton.x = (game.camera.width / 2) - (this.tryAgainLinkButton.width / 2);
    this.tryAgainLinkButton.y = this.tryAgainLink.y - 9;
    this.tryAgainLinkButton.fixedToCamera = true;
    // End try again link
};

Rendlesham.gameOver.prototype.tryAgain = function()
{
    game.state.start('main', true, true, this.levelId);
};