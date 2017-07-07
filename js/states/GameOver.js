class GameOver extends GameState
{
    preload()
    {
        this.backgrounds = game.add.group();
        this.linkBackgrounds = game.add.group();
        this.texts = game.add.group();
        loadMainFiles();
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
        game.state.start('play', true, true, obj);
    }

    create()
    {
        if (game.device.desktop === false)
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = "#112c06";

        this.capturedText = game.add.bitmapText(500, game.height * .125, bitmapFontName, 'Captured', 80);
        this.capturedText.align = 'center';
        this.capturedText.x = (game.width * .5) - (this.capturedText.width * .5);

        let replayText = 'Try Again';
        let details = 'You were captured by the humans in wave ' + this.waveReached + '.';
        if (this.mode === 'endless')
        {
            replayText = 'Play Again';
            details = 'Score: ' + this.score;
        }

        this.detailsText = game.add.bitmapText(500, game.height * .35, bitmapFontName, details, 20);
        this.detailsText.align = 'center';
        this.detailsText.x = (game.width * .5) - (this.detailsText.width * .5);

        this.addButtonTextLink('retry', replayText, 46, 'forestGreen', 0, game.height * .5, 'center', 'tryAgain');

        this.addButtonTextLink('exit', 'Exit', 46, 'forestGreen', 0, game.height * .725, 'center', 'goToTitleScreen');
    }
}