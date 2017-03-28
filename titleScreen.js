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
    this.titleText.x = (game.width / 2) - (this.titleText.width / 2);

    this.captionText = game.add.bitmapText(500, game.height * .36, bitmapFontName, 'An extra-terrestrial tower defense game', 32);
    this.captionText.x = (game.width / 2) - (this.captionText.width / 2);
    this.captionText.tint = 0xFFCCCC;

    var tips = [
        "Stop the humans from collecting evidence of your existence."
    ];

    var tipTextContent = tips[Math.floor(Math.random() * tips.length)];

    this.tipText = game.add.bitmapText(500, game.height * .53, bitmapFontName, tipTextContent, 20);
    this.tipText.x = (game.width / 2) - (this.tipText.width / 2);
    this.tipText.tint = 0xCCFFCC;

    this.addButtonTextLink('achievementsLink', 'View Achievements', 20, 'smallWideDark', 15, game.camera.height - 35, 'right', 'showAchievements');


};

Rendlesham.titleScreen.prototype.showAchievements = function()
{
    this.changeGameState('achievements');
};

Rendlesham.titleScreen.prototype.playTheGame = function()
{
    this.changeGameState('eastAnglia');
};
