var Rendlesham = Rendlesham || {};

Rendlesham.boot = function(game){

};

Rendlesham.boot.prototype = {
    preload: function(){
        game.load.image('loading', 'assets/loading.png');

        game.stage.backgroundColor = "#4488AA";
        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    },
    create: function(){
        this.game.state.start('preloader');
    }
};