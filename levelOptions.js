Rendlesham.levelOptions = function() {};

Rendlesham.levelOptions.prototype = $.extend(true, {}, Rendlesham.gameState.prototype);

Rendlesham.levelOptions.prototype.preload = function()
{

    this.backgrounds = game.add.group();
    this.linkBackgrounds = game.add.group();
    this.name = 'rendlesham';
    loadMainFiles();

};

Rendlesham.levelOptions.prototype.init = function(levelNumber, zoneName)
{
    this.levelNumber = levelNumber;
    this.level = window[zones[zoneName].levelOrdering[levelNumber]];
    this.zoneName = zoneName;
};

Rendlesham.levelOptions.prototype.create = function()
{

    this.loadUser();
    this.checkUser();

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    if (game.device.desktop === false) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

    game.stage.backgroundColor = "#112c06";

    this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToZone');

    this.titleText = game.add.bitmapText(500, game.height * .07, bitmapFontName, this.level.title, 64);
    this.titleText.x = (game.width * .5) - (this.titleText.width * .5);

    this.addButtonTextLink('playClassicLink', 'Play Classic Mode', 36, 'forestGreen', 0, game.height * .27, 'center', 'playClassic');

    let modes = ['classic', 'epic', 'endless'];
    let highScoreInfo;
    let y;
    let modeName;
    let noValueTerm;
    let textTint;
    for (let i = 0; i < modes.length; i++)
    {

        modeName = ucfirst(modes[i]);

        if (this.user.levelHighScores[modes[i]][this.level.name])
        {
            highScoreInfo = 'Your ' + modeName + ' High Score: ' + this.user.levelHighScores[modes[i]][this.level.name];
            textTint = 0xFFFFFF;
        }
        else
        {
            textTint = 0x888888;
            if (modes[i] === 'endless')
            {
                noValueTerm = 'Unplayed';
            }
            else
            {
                noValueTerm = 'Unbeaten';
            }
            highScoreInfo = modeName + ' Mode ' + noValueTerm;
        }

        y = (44 + (i * 24.5)) / 100;

        this[modes[i] + 'HighScoreText'] = game.add.bitmapText(500, game.height * y, bitmapFontName, highScoreInfo, 16);
        this[modes[i] + 'HighScoreText'].x = (game.width * .5) - (this[modes[i] + 'HighScoreText'].width * .5);
        this[modes[i] + 'HighScoreText'].tint = textTint;

    }


    /*
    var classicHighScoreInfo;
    if (this.user.levelHighScores['classic'][this.level.name]) {
        classicHighScoreInfo = 'Your Classic High Score: ' + this.user.levelHighScores['classic'][this.level.name];
    } else {
        classicHighScoreInfo = 'Classic Mode Unbeaten';
    }
    this.classicHighScoreText = game.add.bitmapText(500, game.height * .45, bitmapFontName, classicHighScoreInfo, 20);
    this.classicHighScoreText.x = (game.width * .5) - (this.classicHighScoreText.width * .5);
    */


    this.addButtonTextLink('playEpicLink', 'Play Epic Mode', 36, 'forestGreen', 0, game.height * .515, 'center', 'playEpic');

    this.addButtonTextLink('playEndlessLink', 'Play Endless Mode', 36, 'forestGreen', 0, game.height * .76, 'center', 'playEndless');

};

Rendlesham.levelOptions.prototype.goToZone = function(button)
{
    game.state.start('zone', true, true, this.zoneName);
};

Rendlesham.levelOptions.prototype.playClassic = function(button)
{
    let obj = {
        zoneName: this.zoneName,
        levelNumber: this.levelNumber,
        mode: 'classic'
    };

    let goToState = 'main';
    if (this.level.story) {
        goToState = 'story';
    }

    game.state.start(goToState, true, true, obj);
};

Rendlesham.levelOptions.prototype.playEpic = function(button)
{
    let obj = {
        zoneName: this.zoneName,
        levelNumber: this.levelNumber,
        mode: 'epic'
    };

    let goToState = 'main';
    if (this.level.story) {
        goToState = 'story';
    }

    game.state.start(goToState, true, true, obj);
};

Rendlesham.levelOptions.prototype.playEndless = function(button)
{
    let obj = {
        zoneName: this.zoneName,
        levelNumber: this.levelNumber,
        mode: 'endless'
    };

    let goToState = 'main';
    if (this.level.story) {
        goToState = 'story';
    }

    game.state.start(goToState, true, true, obj);
};