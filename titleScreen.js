var Rendlesham = Rendlesham || {};

Rendlesham.titleScreen = function()
{

};

Rendlesham.titleScreen.prototype = $.extend(true, {}, Rendlesham.gameState.prototype);


Rendlesham.titleScreen.prototype.preload = function()
{

    this.backgrounds = game.add.group();

    this.linkBackgrounds = game.add.group();
    this.texts = game.add.group();

    loadMainFiles();

};


Rendlesham.titleScreen.prototype.create = function()
{

    this.loadUser();
    this.checkUser();

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    if (game.device.desktop == false) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

    game.stage.backgroundColor = "#112c06";

    this.addButtonTextLink('playGameLink', 'Play the Game', 46, 'forestGreen', 0, game.height * .68, 'center', 'playTheGame');

    this.titleText = game.add.bitmapText(500, game.height * .12, bitmapFontName, 'Rendlesham Forest', 64);
    this.titleText.x = (game.width * .5) - (this.titleText.width * .5);

    this.captionText = game.add.bitmapText(500, game.height * .36, bitmapFontName, 'An extra-terrestrial tower defence game', 32);
    this.captionText.x = (game.width * .5) - (this.captionText.width * .5);
    this.captionText.tint = 0xFFCCCC;

    var tips = [
        "Save Nathan the alien from being captured by the humans."
    ];

    var tipTextContent = tips[Math.floor(Math.random() * tips.length)];

    this.tipText = game.add.bitmapText(500, game.height * .53, bitmapFontName, tipTextContent, 20);
    this.tipText.x = (game.width * .5) - (this.tipText.width * .5);
    this.tipText.tint = 0xCCFFCC;

    this.addButtonTextLink('achievementsLink', 'View Achievements', 20, 'smallWideDark', 10, game.camera.height - 40, 'right', 'showAchievements');

    // this.addButtonTextLink('creditsLink', 'Credits', 20, 'smallWideDark', 10, game.camera.height - 40, 'left', 'showCredits');


};

Rendlesham.titleScreen.prototype.showAchievements = function()
{
    this.changeGameState('achievements');
};

Rendlesham.titleScreen.prototype.playTheGame = function()
{
    this.changeGameState('eastAnglia');
};
