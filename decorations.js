function Decoration(game, x, y, spriteName) {

    $.extend( this, standard );

    this.guid = guid();

    Phaser.Sprite.call(this, game, x, y, spriteName);

    game.physics.arcade.enable(this);

    this.anchor.setTo(0.5, 0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

}
Decoration.prototype = Object.create(Phaser.Sprite.prototype);
Decoration.prototype.constructor = Decoration;
Decoration.prototype.initialise = function() {};
Decoration.prototype.update = function() {};
Decoration.prototype.die = function()
{
    this.kill();
};
Decoration.prototype.setTint = function(tint)
{
    this.tint = tint;
};
Decoration.prototype.unTint = function()
{
    this.tint = 0xffffff;
};
Decoration.prototype.setAngle = function(angle)
{
    this.angle = angle;
};

// Begin Explosion
function Explosion(game, x, y) {
    Decoration.call(this, game, x, y, 'explosion');
    this.initialise();
}
Explosion.prototype = Object.create(Decoration.prototype);
Explosion.prototype.constructor = Explosion;
Explosion.prototype.initialise = function()
{
    Decoration.prototype.initialise.call(this);
    this.unTint();
    this.angle = getRandomInteger(-45, 45);
    this.lifespan = 500;
    this.animations.add('explode', [0, 1, 2, 3, 4, 5], 12, false);
    this.animations.play('explode');
    this.alpha = .6;
};
Explosion.prototype.reuse = function(x, y)
{
    this.reset(x, y);
    this.initialise();
};
// End Explosion

// Begin Zap
function Zap(game, x, y) {
    Decoration.call(this, game, x, y, 'Zap');
    this.initialise();
}
Zap.prototype = Object.create(Decoration.prototype);
Zap.prototype.constructor = Zap;
Zap.prototype.initialise = function()
{
    Decoration.prototype.initialise.call(this);
    this.unTint();
    this.lifespan = 250;
    this.animations.add('explode', [0, 1, 2], 12, false);
    this.animations.play('explode');
    this.alpha = .6;
};
Zap.prototype.reuse = function(x, y)
{
    this.reset(x, y);
    this.initialise();
};
// End Zap
