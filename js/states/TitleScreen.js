class TitleScreen extends GameState
{
    preload()
    {
        this.backgrounds = game.add.group();

        this.linkBackgrounds = game.add.group();
        this.texts = game.add.group();

        this.loadMainFiles();
    }

    create()
    {
        this.loadUser();
        this.checkUser();

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop === false)
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        // game.stage.backgroundColor = "#112c06";

        this.titleScreenBackground = game.add.tileSprite(0, 0, game.camera.width, game.camera.height, 'touchMushroomBackground');
        this.titleScreenBackground.fixedToCamera = true;
        this.backgrounds.add(this.titleScreenBackground);

        this.addButtonTextLink('playGameLink', 'Play the Game', 46, 'forestGreen', 0, game.height * .68, 'center', 'goToZone');

        this.titleText = game.add.bitmapText(500, game.height * .12, bitmapFontName, 'Rendlesham Forest', 64);
        this.titleText.x = (game.width * .5) - (this.titleText.width * .5);

        this.captionText = game.add.bitmapText(500, game.height * .36, bitmapFontName, 'An extra-terrestrial tower defence game', 32);
        this.captionText.x = (game.width * .5) - (this.captionText.width * .5);
        this.captionText.tint = 0xFFCCCC;

        let tips = [
            "Save Nathan the alien from being captured by the humans."
        ];

        let tipTextContent = tips[Math.floor(Math.random() * tips.length)];

        this.tipText = game.add.bitmapText(500, game.height * .53, bitmapFontName, tipTextContent, 20);
        this.tipText.x = (game.width * .5) - (this.tipText.width * .5);
        this.tipText.tint = 0xCCFFCC;

        this.addButtonTextLink('achievementsLink', 'View Achievements', 20, 'smallWideDark', 10, game.camera.height - 40, 'right', 'showAchievements');

        // this.addButtonTextLink('creditsLink', 'Credits', 20, 'smallWideDark', 10, game.camera.height - 40, 'left', 'showCredits');
    }

    showAchievements()
    {
        this.changeGameState('achievements');
    }

    goToZone(zoneButton)
    {
        let zoneName;
        if (zoneButton && zoneButton.zoneName)
        {
            zoneName = zoneButton.zoneName;
        }
        else
        {
            zoneName = 'EAST_ANGLIA';
        }

        game.state.start('zone', true, true, zoneName);
    }
}