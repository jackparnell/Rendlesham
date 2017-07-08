class Preloader extends GameState
{
    preload()
    {
        this.game.stage.backgroundColor = '#112c06';

        let loadingBar = this.add.sprite(((this.game.width * .5) - 200), 200, 'loadingBar');
        loadingBar.x = (this.game.width * .5) - (loadingBar.width) * .5;
        this.load.setPreloadSprite(loadingBar);

        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        let style = {
            font: "bold 32px Arial",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        let text = this.game.add.text(0, 0, 'Loading Rendlesham Forest', style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 100, game.width, 100);

        this.loadMainFiles();
        this.loadTransylvanianFiles();
    }

    create()
    {
        this.game.state.start('titleScreen');
    }
}