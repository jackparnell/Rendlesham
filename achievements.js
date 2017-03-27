var Rendlesham = Rendlesham || {};

Rendlesham.achievements = function(){

};

Rendlesham.achievements.prototype = {
    preload: function()
    {

        this.backgrounds = game.add.group();
        this.pathways = game.add.group();
        this.name = 'rendlesham';

        loadMainFiles();

    },

    init: function ()
    {
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        this.game.kineticScrolling.configure({
            kineticMovement: false,
            verticalScroll: true,
            verticalWheel: true
        });
    },

    create: function()
    {
        this.loadUser();


        var level;
        var userLevelHighScore;


        // Begin back link
        this.backLink = game.add.bitmapText(
            0,
            0,
            bitmapFontName,
            'Back',
            20
        );
        this.backLink.x = game.camera.width - this.backLink.width - 15;
        this.backLink.y = 15;
        this.backLink.fixedToCamera = true;

        this.backLink.inputEnabled = true;
        this.backLink.input.useHandCursor = true;
        this.backLink.events.onInputDown.add(this.goToTitleScreen, this);
        // End back link


        var y = 20;

        this.heading_highScores = game.add.bitmapText(
            20,
            y,
            bitmapFontName,
            'Your High Scores',
            32
        );

        y += 45;

        for (var levelNumber in levelOrdering.eastAnglia) {
            if (levelOrdering.eastAnglia.hasOwnProperty(levelNumber)) {

                level = getLevelByName(levelOrdering.eastAnglia[levelNumber]);

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

    },

    goToTitleScreen: function()
    {
        changeGameState('titleScreen');
    },

    loadUser: function()
    {

        if (localStorage.getItem(this.name)) {
            this.user = JSON.parse(localStorage.getItem(this.name));
        } else {
            this.user = newUser;
            this.save();
        }

    },


};