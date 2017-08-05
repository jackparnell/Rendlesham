class Achievements extends GameState
{
    preload()
    {
        this.backgrounds = this.game.add.group();
        this.linkBackgrounds = this.game.add.group();
        this.texts = this.game.add.group();

        this.loadMainFiles();
    }

    init()
    {
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
        this.game.kineticScrolling.configure({
            kineticMovement: false,
            verticalScroll: true,
            verticalWheel: true,
            horizontalWheel: false
        });
    }

    create()
    {
        this.loadUser();

        this.handleScaling();

        let level;
        let userLevelHighScore;

        this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

        this.addButtonTextLink('downloadSaveLink', 'Download Save File', 20, 'smallWideDark', 10, this.game.camera.height - 40, 'right', 'downloadSave');

        let y = 20;

        this.heading_highScores = this.game.add.bitmapText(
            20,
            y,
            this.game.globals.bitmapFontName,
            'Your High Scores',
            32
        );

        y += 45;

        for (let levelNumber in ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING)
        {
            if (ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING.hasOwnProperty(levelNumber))
            {
                level = this.getLevelByName(ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING[levelNumber]);

                if (this.user.hasOwnProperty('levelHighScores') && this.user.levelHighScores.hasOwnProperty(level.name))
                {
                    userLevelHighScore = this.user.levelHighScores[level.name];
                }
                else
                {
                    userLevelHighScore = '';
                }

                this[level.name + '_highScore'] = this.game.add.bitmapText(
                    20,
                    y,
                    this.game.globals.bitmapFontName,
                    'Level ' + levelNumber + ' (' + level.title + '): ' + userLevelHighScore,
                    16
                );

                y += 20;
            }
        }

        this.flashIntoState();
    }

    getLevelByName(levelName)
    {
        let item;
        let level;
        for (let property in ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING)
        {
            if (ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING.hasOwnProperty(property))
            {
                item = window[ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING[property]];
                if (item.name && item.name === levelName)
                {
                    level = item;
                }
            }
        }
        return level;
    }
}