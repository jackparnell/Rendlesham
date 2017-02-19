function Character(game, x, y, spriteName) {
    
    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();
    this.creationTurn = mainState.turn;

    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(x, y);
    this.gridX = gridCoordinates[0];
    this.gridY = gridCoordinates[1];

    Phaser.Sprite.call(this, game, x, y, spriteName);
    
    game.physics.arcade.enable(this);

    this.anchor.setTo(0.5, 0.5);

    this.x = x;
    this.y = y;

    this.checkWorldBounds = true;
    this.collideWorldBounds = false;
    this.outOfBoundsKill = false;

    var scale = this.getScale();
    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }
    
}
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

// Begin Nathan
function Nathan(game, x, y) {
    Character.call(this, game, x, y, 'nathan');
}
Nathan.prototype = Object.create(Character.prototype);
Nathan.prototype.constructor = Nathan;
Nathan.defaultScale = 1;
Nathan.spriteName = 'nathan';
// End Nathan
