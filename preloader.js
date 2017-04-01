var Rendlesham = Rendlesham || {};

Rendlesham.preloader = function(game){

}

Rendlesham.preloader.prototype = $.extend(true, {}, Rendlesham.gameState.prototype);

Rendlesham.preloader.prototype = {
    preload: function()
    {
        game.load.image('loading', 'assets/loading.png');

        var loadingBar = this.add.sprite(((game.width * .5) - 200), 200, 'loading');
        this.load.setPreloadSprite(loadingBar);

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        var style = {
            font: "bold 32px Arial",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var text = game.add.text(0, 0, 'Loading Rendlesham Forest', style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 100, game.width, 100);

        loadMainFiles();

    },
    create: function()
    {
        this.game.state.start('titleScreen');
    }
}