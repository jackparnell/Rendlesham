class TitleScreen extends CanvasGameState
{
    create()
    {
        super.create();

        this.loadUser();
        this.checkUser();

        this.titleScreenBackground = this.game.add.tileSprite(0, 0, this.game.camera.width, this.game.camera.height, 'touchMushroomBackground');
        this.titleScreenBackground.fixedToCamera = true;
        this.game.backgrounds.add(this.titleScreenBackground);

        this.addButtonTextLink('playGameLink', 'Play the Game', 46, 'forestGreen', 0, this.game.height * .68, 'center', 'playTheGame');

        this.titleText = this.game.add.bitmapText(500, this.game.height * .12, this.game.globals.bitmapFontName, this.game.globals.applicationTitle, 64);
        this.titleText.x = (this.game.width * .5) - (this.titleText.width * .5);

        this.captionText = this.game.add.bitmapText(500, this.game.height * .36, this.game.globals.bitmapFontName, 'An extra-terrestrial tower defence game', 32);
        this.captionText.x = (this.game.width * .5) - (this.captionText.width * .5);
        this.captionText.tint = 0xFFCCCC;

        let tips = [
            "Save Nathan the alien from being captured by the humans."
        ];

        let tipTextContent = tips[Math.floor(Math.random() * tips.length)];

        this.tipText = this.game.add.bitmapText(500, this.game.height * .53, this.game.globals.bitmapFontName, tipTextContent, 20);
        this.tipText.x = (this.game.width * .5) - (this.tipText.width * .5);
        this.tipText.tint = 0xCCFFCC;

        // this.addButtonTextLink('downloadSaveLink', 'Download Save File', 20, 'smallWideDark', 10, this.game.camera.height - 40, 'left', 'downloadSave');

        this.addButtonTextLink('achievementsLink', 'View Achievements', 20, 'smallWideDark', 10, this.game.camera.height - 40, 'right', 'showAchievements');

        this.addButtonTextLink('creditsLink', 'Credits', 20, 'smallWideDark', 10, this.game.camera.height - 40, 'left', 'showCredits');

        this.flashIntoState();
    }

    showAchievements()
    {
        this.fadeOutToState('achievements');
        window.location.hash = '#achievements';
    }

    showCredits()
    {
        this.fadeOutToState('credits');
        window.location.hash = '#credits';
    }

    playTheGame()
    {
        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(this.game.globals.interStateBackgroundColor, this.game.globals.fadeOutOfStateMs, true);
        this.game.camera.onFadeComplete.add(this.goToZone, this);
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
        this.game.state.start('zone', true, true, zoneName);
    }

}