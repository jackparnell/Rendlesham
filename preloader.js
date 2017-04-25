Rendlesham.preloader = function(game) {};

Rendlesham.preloader.prototype = $.extend(true, {}, Rendlesham.gameState.prototype);

Rendlesham.preloader.prototype = {
    preload: function()
    {

        this.game.stage.backgroundColor = '#112c06';

        var loadingBar = this.add.sprite(((this.game.width * .5) - 200), 200, 'loadingBar');
        loadingBar.x = (this.game.width * .5) - (loadingBar.width) * .5;
        this.load.setPreloadSprite(loadingBar);

        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        var style = {
            font: "bold 32px Arial",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var text = this.game.add.text(0, 0, 'Loading Rendlesham Forest', style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 100, game.width, 100);

        loadMainFiles();

    },
    create: function()
    {
        this.game.state.start('titleScreen');
    }
}