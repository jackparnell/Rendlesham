class Boot extends Phaser.State
{
    preload()
    {
        this.game.load.image('loadingBar', 'assets/ui/loading.png');
        if (this.game.device.desktop === false)
        {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setMinMax(game.width*.5, game.height*.5, game.width, game.height);
        }
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    }

    create()
    {
        this.game.state.start('preloader');
    }
}