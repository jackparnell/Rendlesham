class LevelOptions extends CanvasGameState
{
    init(obj)
    {
        if (ZONE_INFO.hasOwnProperty(obj.zoneName))
        {
            this.zone = ZONE_INFO[obj.zoneName];
        }
        else
        {
            throw {
                'code': 85701,
                'description': 'Zone ' + obj.zoneName + ' invalid. '
            };
        }

        this.levelNumber = obj.levelNumber;
        this.level = window[ZONE_INFO[this.zone.NAME].LEVEL_ORDERING[this.levelNumber]];
    }

    create()
    {
        super.create();

        this.loadUser();
        this.checkUser();

        this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'clickBack');

        this.titleText = this.game.add.bitmapText(
            500,
            this.game.height * .07,
            this.game.globals.bitmapFontName,
            this.level.title,
            64
        );
        this.titleText.x = (this.game.width * .5) - (this.titleText.width * .5);

        this.addButtonTextLink('playClassicLink', 'Play Classic Mode', 36, 'forestGreen', 0, this.game.height * .27, 'center', 'clickMode');
        this.buttonTextLinkAddProperty('playClassicLink', 'modeName', 'classic');

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
            this.addButtonTextLink('playEpicLink', 'Play Epic Mode', 36, 'forestGreen', 0, this.game.height * .515, 'center', 'clickMode');
            this.buttonTextLinkAddProperty('playEpicLink', 'modeName', 'epic');
        }
        else
        {
            this.addButtonTextLink('playEpicLink', 'Play Epic Mode', 36, 'locked', 0, this.game.height * .515, 'center', 'notPossible', 0x666666);
        }

        if (this.isLevelUnlocked(this.levelNumber, 'endless'))
        {
            this.addButtonTextLink('playEndlessLink', 'Play Endless Mode', 36, 'forestGreen', 0, this.game.height * .76, 'center', 'clickMode');
            this.buttonTextLinkAddProperty('playEndlessLink', 'modeName', 'endless');
        }
        else
        {
            this.addButtonTextLink('playEndlessLink', 'Play Endless Mode', 36, 'locked', 0, this.game.height * .76, 'center', 'notPossible', 0x666666);
        }

        this.flashIntoState();
    }

    clickBack()
    {
        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(this.game.globals.interStateBackgroundColor, this.game.globals.fadeOutOfStateMs, true);
        this.game.camera.onFadeComplete.add(
            this.goToZone,
            this,
            0
        );
    }

    goToZone()
    {
        this.game.state.start('zone', true, true, this.zone.NAME);
    }

    play(mode)
    {
        let obj = {
            zoneName: this.zone.NAME,
            levelNumber: this.levelNumber,
            mode: mode
        };

        let goToState = 'play';
        if (this.level.story) {
            goToState = 'story';
        }

        this.game.state.start(goToState, true, true, obj);
    }

    clickMode(button)
    {
        let modeName = button.modeName || 'classic';

        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(this.game.globals.interStateBackgroundColor, this.game.globals.fadeOutOfStateMs, true);
        this.game.camera.onFadeComplete.add(
            this.play,
            this,
            0,
            modeName
        );
    }

}