class Achievements extends GameState
{
    preload()
    {
        this.backgrounds = game.add.group();
        this.name = 'rendlesham';
        this.linkBackgrounds = game.add.group();
        this.texts = game.add.group();

        this.loadMainFiles();
    }

    init()
    {
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
        this.game.kineticScrolling.configure({
            kineticMovement: false,
            verticalScroll: true,
            verticalWheel: true
        });
    }

    create()
    {
        this.loadUser();

        let level;
        let userLevelHighScore;

        this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

        let y = 20;

        this.heading_highScores = game.add.bitmapText(
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

                this[level.name + '_highScore'] = game.add.bitmapText(
                    20,
                    y,
                    this.game.globals.bitmapFontName,
                    'Level ' + levelNumber + ' (' + level.title + '): ' + userLevelHighScore,
                    16
                );

                y += 20;
            }
        }
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