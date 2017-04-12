function Character(game, x, y, spriteName) {
    
    $.extend( this, standard );
    $.extend( this, moveable );
    $.extend( this, shadow );

    this.guid = guid();
    this.creationTurn = mainState.turn;

    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(x, y);
    this.gridX = gridCoordinates[0];
    this.gridY = gridCoordinates[1];

    Phaser.Sprite.call(this, game, x, y, spriteName);
    
    game.physics.arcade.enable(this);

    this.roundedCoordinates = mainState.pixelsNearestTileTopLeftCoordinates(x, y);
    x = this.roundedCoordinates[0];
    y = this.roundedCoordinates[1];

    this.x = x + (mainState.squareWidth/2);
    this.y = y + (mainState.squareWidth/2);

    this.anchor.setTo(0.5, 0.5);

    this.checkWorldBounds = true;
    this.collideWorldBounds = false;
    this.outOfBoundsKill = false;

    var scale = this.getScale();
    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }
    
}
Character.prototype.initialise = function()
{

};
Character.prototype.prepareForGameOver = function()
{
    this.body.enable = false;
};
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
Nathan.prototype.drawForceFields = function()
{
    mainState.drawForceFields(this, mainState.lives);
};
// End Nathan

// Begin Bully
function Bully(game, x, y) {
    Character.call(this, game, x, y, 'bully');
    this.createCentralCircle(16);
}
Bully.prototype = Object.create(Character.prototype);
Bully.prototype.constructor = Bully;
Bully.defaultScale = 1;
Bully.defaultSpeed = 50;
Bully.spriteName = 'bully';
Bully.spriteSheetGid = 120;
Bully.prototype.initialise = function()
{
    this.creationTurn = mainState.turn;

    this.speed = (window[this.constructor.name].defaultSpeed || 75);
    this.path = [];
    this.path_step = -1;

    this.tint = 0xffffff;
    this.alpha = 1;

    this.tilesTraversed = 0;

    this.initialised = true;

    this.generateNewGoal();
};
Bully.prototype.update = function() {
    Character.prototype.update.call(this);

    if (!this.alive) {
        return;
    }

    if (!this.initialised) {
        this.initialise();
    }

    if (this.hasReachedGoal()) {
        this.generateNewGoal();
    }

    if (this.haveGridCoordinatesChanged()) {

        mainState.addGlobalImpassablePoint(this.gridX, this.gridY);
        mainState.removeGlobalImpassablePoint(this.oldGridX, this.oldGridY);

        if (this.pathNeedsRegenerating) {
            this.moveToCoordinates(this.goalX, this.goalY);
        }
    }

    this.followPath();

};
Bully.prototype.generateNewGoal = function()
{
    var goal = mainState.level.bullyGoalCoordinates[Math.floor(Math.random() * mainState.level.bullyGoalCoordinates.length)];
    this.goalX = goal[0];
    this.goalY = goal[1];
    this.moveToCoordinates(this.goalX, this.goalY);
};
Bully.prototype.hasReachedGoal = function()
{
    if (this.gridX == this.goalX && this.gridY == this.goalY) {
        return true;
    }

    return false;
};
// End Bully

// Begin Ghost
function Ghost(game, x, y) {
    Character.call(this, game, x, y, 'ghost');
}
Ghost.prototype.initialise = function()
{
    this.creationTurn = mainState.turn;
    this.initialised = true;
    this.alpha = .6;
};
Ghost.prototype.update = function() {
    Character.prototype.update.call(this);
    if (!this.initialised) {
        this.initialise();
    }
};
Ghost.prototype = Object.create(Character.prototype);
Ghost.prototype.constructor = Nathan;
Ghost.defaultScale = 1;
Ghost.spriteName = 'ghost';
Ghost.spriteSheetGid = 72;
// End Ghost