class LevelOptions extends GameState
{
    preload()
    {
        this.backgrounds = game.add.group();
        this.linkBackgrounds = game.add.group();
        this.loadMainFiles();
    }

    init(levelNumber, zoneName)
    {
        this.levelNumber = levelNumber;
        this.level = window[ZONE_INFO[zoneName].LEVEL_ORDERING[levelNumber]];
        this.zoneName = zoneName;
    }

    create()
    {
        this.loadUser();
        this.checkUser();

        console.log(this.user);

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop === false)
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

        game.stage.backgroundColor = "#112c06";

        this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToZone');

        this.titleText = game.add.bitmapText(500, game.height * .07, this.game.globals.bitmapFontName, this.level.title, 64);
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
            else if (!this.isLevelUnlocked(this.levelNumber, modes[i]))
            {
                textTint = 0x888888;
                highScoreInfo = 'Complete ' + ucfirst(getPreviousMode(modes[i])) + ' mode to unlock.';
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

            this[modes[i] + 'HighScoreText'] = game.add.bitmapText(500, game.height * y, this.game.globals.bitmapFontName, highScoreInfo, 16);
            this[modes[i] + 'HighScoreText'].x = (game.width * .5) - (this[modes[i] + 'HighScoreText'].width * .5);
            this[modes[i] + 'HighScoreText'].tint = textTint;
        }

        if (this.isLevelUnlocked(this.levelNumber, 'epic'))
        {
            this.addButtonTextLink('playEpicLink', 'Play Epic Mode', 36, 'forestGreen', 0, game.height * .515, 'center', 'playEpic');
        }
        else
        {
            this.addButtonTextLink('playEpicLink', 'Play Epic Mode', 36, 'locked', 0, game.height * .515, 'center', 'notPossible', 0x666666);
        }

        if (this.isLevelUnlocked(this.levelNumber, 'endless'))
        {
            this.addButtonTextLink('playEndlessLink', 'Play Endless Mode', 36, 'forestGreen', 0, game.height * .76, 'center', 'playEndless');
        }
        else
        {
            this.addButtonTextLink('playEndlessLink', 'Play Endless Mode', 36, 'locked', 0, game.height * .76, 'center', 'notPossible', 0x666666);
        }

    }

    goToZone()
    {
        game.state.start('zone', true, true, this.zoneName);
    }

    playClassic(button)
    {
        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelNumber,
            mode: 'classic'
        };

        let goToState = 'play';
        if (this.level.story) {
            goToState = 'story';
        }

        game.state.start(goToState, true, true, obj);
    }

    playEpic(button)
    {
        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelNumber,
            mode: 'epic'
        };

        let goToState = 'play';
        if (this.level.story) {
            goToState = 'story';
        }

        game.state.start(goToState, true, true, obj);
    }

    playEndless(button)
    {
        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelNumber,
            mode: 'endless'
        };

        let goToState = 'play';
        if (this.level.story) {
            goToState = 'story';
        }

        game.state.start(goToState, true, true, obj);
    }
}