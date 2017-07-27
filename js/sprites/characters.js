class Character extends GameSprite
{
    constructor(game, x, y, spriteName)
    {
        super(game, x, y, spriteName);

        this.moveable = true;

        this.guid = guid();
        this.creationTurn = game.globals.turn;

        game.physics.arcade.enable(this);

        this.roundedCoordinates = this.game.state.states.play.pixelsNearestTileTopLeftCoordinates(x, y);
        x = this.roundedCoordinates[0];
        y = this.roundedCoordinates[1];

        this.x = x + (this.game.state.states.play.squareWidth * .5);
        this.y = y + (this.game.state.states.play.squareWidth * .5);

        this.anchor.setTo(0.5, 0.5);

        this.checkWorldBounds = true;
        this.collideWorldBounds = false;
        this.outOfBoundsKill = false;

        let gridCoordinates = this.game.state.states.play.translatePixelCoordinatesToGridCoordinates(this.body.x, this.body.y);
        this.gridX = gridCoordinates[0];
        this.gridY = gridCoordinates[1];

        let scale = this.getScale();
        if (scale !== 1)
        {
            this.scale.setTo(scale, scale);
        }
    }

    initialise(){}

    prepareForGameOver()
    {
        this.body.enable = false;
    }

}

window.Nathan = class Nathan extends Character
{
    drawForceFields()
    {
        this.game.state.states.play.drawForceFields(this, this.game.state.states.play.lives);
    }
};
Nathan.defaultScale = 1;
Nathan.spriteName = 'Nathan';


window.Bully = class Bully extends Character
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Bully');
        this.createCentralCircle(16);
    }

    drawForceFields()
    {
        this.game.state.states.play.drawForceFields(this, this.game.state.states.play.lives);
    }

    initialise()
    {
        this.creationTurn = game.globals.turn;

        this.speed = (window[this.constructor.name].defaultSpeed || 75);
        this.path = [];
        this.path_step = -1;

        this.tint = 0xffffff;
        this.alpha = 1;

        this.tilesTraversed = 0;

        this.initialised = true;

        this.generateNewGoal();
    }

    update()
    {
        super.update();

        if (!this.alive)
        {
            return;
        }

        if (!this.initialised)
        {
            this.initialise();
        }

        if (this.hasReachedGoal())
        {
            this.generateNewGoal();
        }

        if (this.haveGridCoordinatesChanged())
        {
            this.game.state.states.play.addGlobalImpassablePoint(this.gridX, this.gridY);
            this.game.state.states.play.removeGlobalImpassablePoint(this.oldGridX, this.oldGridY);

            if (this.pathNeedsRegenerating)
            {
                this.moveToCoordinates(this.goalX, this.goalY);
            }
        }

        this.followPath();

    }

    generateNewGoal()
    {
        let goal = this.game.state.states.play.level.bullyGoalCoordinates[Math.floor(Math.random() * this.game.state.states.play.level.bullyGoalCoordinates.length)];
        this.goalX = goal[0];
        this.goalY = goal[1];
        this.moveToCoordinates(this.goalX, this.goalY);
    }

    hasReachedGoal()
    {
        return (this.gridX === this.goalX && this.gridY === this.goalY);
    }
};
Bully.defaultScale = 1;
Bully.defaultSpeed = 50;
Bully.spriteName = 'Bully';
Bully.spriteSheetGid = 120;


window.Ghost = class Ghost extends Character
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Ghost');
    }

    initialise()
    {
        this.creationTurn = game.globals.turn;
        this.initialised = true;
        this.alpha = .6;
    }

    update()
    {
        super.update();
        if (!this.initialised)
        {
            this.initialise();
        }
    }
};
Ghost.prototype = Object.create(Character.prototype);
Ghost.prototype.constructor = Nathan;
Ghost.defaultScale = 1;
Ghost.spriteName = 'Ghost';
Ghost.spriteSheetGid = 72;
