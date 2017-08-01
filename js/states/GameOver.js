class GameOver extends GameState
{
    preload()
    {
        this.backgrounds = this.game.add.group();
        this.linkBackgrounds = this.game.add.group();
        this.texts = this.game.add.group();
        this.loadMainFiles();
    }

    init(obj)
    {
        this.zoneName = obj.zoneName;
        this.levelId = obj.levelNumber;
        this.mode = obj.mode || 'classic';
        this.score = obj.score || 0;
        this.waveReached = obj.waveReached || 0;
    }

    tryAgain()
    {
        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelId,
            mode: this.mode
        };
        this.game.state.start('play', true, true, obj);
    }

    create()
    {
        this.handleScaling();

        this.game.stage.backgroundColor = "#112c06";

        this.capturedText = this.game.add.bitmapText(
            500,
            this.game.height * .125,
            this.game.globals.bitmapFontName,
            'Captured',
            80
        );
        this.capturedText.align = 'center';
        this.capturedText.x = (this.game.width * .5) - (this.capturedText.width * .5);
        this.capturedText.fixedToCamera = true;

        let replayText = 'Try Again';
        let details = 'You were captured by the humans in wave ' + this.waveReached + '.';
        if (this.mode === 'endless')
        {
            replayText = 'Play Again';
            details = 'Score: ' + this.score;
        }

        this.detailsText = this.game.add.bitmapText(
            500,
            this.game.height * .35,
            this.game.globals.bitmapFontName,
            details,
            20
        );
        this.detailsText.align = 'center';
        this.detailsText.x = (this.game.width * .5) - (this.detailsText.width * .5);
        this.detailsText.fixedToCamera = true;

        this.addButtonTextLink('retry', replayText, 46, 'forestGreen', 0, this.game.height * .5, 'center', 'tryAgain');

        this.addButtonTextLink('exit', 'Exit', 46, 'forestGreen', 0, this.game.height * .725, 'center', 'goToTitleScreen');
    }
}