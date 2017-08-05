class LevelOptions extends GameState
{
    preload()
    {
        this.backgrounds = this.game.add.group();
        this.linkBackgrounds = this.game.add.group();
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
        super.create();

        this.loadUser();
        this.checkUser();

        this.handleScaling();

        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

        this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToZone');

        this.titleText = this.game.add.bitmapText(
            500,
            this.game.height * .07,
            this.game.globals.bitmapFontName,
            this.level.title,
            64
        );
        this.titleText.x = (this.game.width * .5) - (this.titleText.width * .5);

        this.addButtonTextLink('playClassicLink', 'Play Classic Mode', 36, 'forestGreen', 0, this.game.height * .27, 'center', 'playClassic');

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

            this[modes[i] + 'HighScoreText'] = this.game.add.bitmapText(
                500,
                this.game.height * y,
                this.game.globals.bitmapFontName,
                highScoreInfo,
                16
            );
            this[modes[i] + 'HighScoreText'].x = (this.game.width * .5) - (this[modes[i] + 'HighScoreText'].width * .5);
            this[modes[i] + 'HighScoreText'].tint = textTint;
        }

        if (this.isLevelUnlocked(this.levelNumber, 'epic'))
        {
            this.addButtonTextLink('playEpicLink', 'Play Epic Mode', 36, 'forestGreen', 0, this.game.height * .515, 'center', 'playEpic');
        }
        else
        {
            this.addButtonTextLink('playEpicLink', 'Play Epic Mode', 36, 'locked', 0, this.game.height * .515, 'center', 'notPossible', 0x666666);
        }

        if (this.isLevelUnlocked(this.levelNumber, 'endless'))
        {
            this.addButtonTextLink('playEndlessLink', 'Play Endless Mode', 36, 'forestGreen', 0, this.game.height * .76, 'center', 'playEndless');
        }
        else
        {
            this.addButtonTextLink('playEndlessLink', 'Play Endless Mode', 36, 'locked', 0, this.game.height * .76, 'center', 'notPossible', 0x666666);
        }

        this.flashIntoState();
    }

    goToZone()
    {
        this.game.state.start('zone', true, true, this.zoneName);
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

        this.game.state.start(goToState, true, true, obj);
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

        this.game.state.start(goToState, true, true, obj);
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

        this.game.state.start(goToState, true, true, obj);
    }
}