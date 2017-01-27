function Monster(game, x, y, spriteName) {

    $.extend( this, standard );

    this.guid = guid();

    if (!x) {
        x = game.width;
    }
    if (!y) {
        y = game.height + getRandomInteger(35, game.height-35);
    }

    console.log(spriteName);

    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.physics.arcade.enable(this);

    this.body.velocity.x = -20;
    this.body.velocity.y = 0;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

}
Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;
Monster.prototype.update = function() {

};


function Ufo(game, x, y) {
    Monster.call(this, game, x, y, 'ufo');
}
Ufo.prototype = Object.create(Monster.prototype);
Ufo.prototype.constructor = Ufo;
Ufo.prototype.update = function() {
    Monster.prototype.update.call(this);

    // this.angle += 1;
};
