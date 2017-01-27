function Decoration(game, x, y, spriteName) {

    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();
    this.creationTurn = mainState.turn;


    if (!x) {
        x = game.width;
    }
    this.spawnYPositionModifier = getRandomInteger(0, 180);

    if (!y) {
        y = game.height + 60 + this.spawnYPositionModifier;
    }

    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.physics.arcade.enable(this);

    var velocityX = -200;
    velocityX *= 1 + (this.spawnYPositionModifier/440);
    var velocityY = velocityX * .45;

    this.body.velocity.x = velocityX;
    this.body.velocity.y = velocityY;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = false;

    var scale = this.getScale();
    scale *= 1 + (this.spawnYPositionModifier/180);

    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }

    this.createShadow(scale);

}
Decoration.prototype = Object.create(Phaser.Sprite.prototype);
Decoration.prototype.constructor = Decoration;
Decoration.prototype.update = function() {

    if (this.x < -300) {
        this.die();
    }

    this.updateShadow();


}
Decoration.prototype.generateScale = function()
{

}
Decoration.prototype.die = function()
{
    this.destroyShadow();
    this.destroy();
}


function Tree(game, x, y) {
    Decoration.call(this, game, x, y, 'tree');
    this.angle = getRandomInteger(-3, 3);
}
Tree.prototype = Object.create(Decoration.prototype);
Tree.prototype.constructor = Tree;
Tree.defaultScale = 2;
