Rendlesham.achievements = function() {};

Rendlesham.achievements.prototype = jQuery.extend(true, {}, Rendlesham.gameState.prototype);

Rendlesham.achievements.prototype.preload = function()
{
    this.backgrounds = game.add.group();
    this.pathways = game.add.group();
    this.name = 'rendlesham';
    this.linkBackgrounds = game.add.group();
    this.texts = game.add.group();

    loadMainFiles();
};

Rendlesham.achievements.prototype.init = function()
{
    this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

    this.game.kineticScrolling.configure({
        kineticMovement: false,
        verticalScroll: true,
        verticalWheel: true
    });
};

Rendlesham.achievements.prototype.create = function()
{
    this.loadUser();

    let level;
    let userLevelHighScore;

    this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

    let y = 20;

    this.heading_highScores = game.add.bitmapText(
        20,
        y,
        bitmapFontName,
        'Your High Scores',
        32
    );

    y += 45;

    for (let levelNumber in zones.eastAnglia.levelOrdering) {
        if (zones.eastAnglia.levelOrdering.hasOwnProperty(levelNumber)) {

            level = getLevelByName(zones.eastAnglia.levelOrdering[levelNumber]);

            if (this.user.hasOwnProperty('levelHighScores') && this.user.levelHighScores.hasOwnProperty(level.name)) {
                userLevelHighScore = this.user.levelHighScores[level.name];
            } else {
                userLevelHighScore = '';
            }

            this[level.name + '_highScore'] = game.add.bitmapText(
                20,
                y,
                bitmapFontName,
                'Level ' + levelNumber + ' (' + level.title + '): ' + userLevelHighScore,
                16
            );

            y += 20;

        }
    }
};