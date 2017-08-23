class Character extends GameSprite
{
    constructor(game, x, y, spriteName)
    {
        super(game, x, y, spriteName);

        this.moveable = true;

        this.guid = guid();
        this.creationTurn = this.game.globals.turn;

        game.physics.arcade.enable(this);

        this.roundedCoordinates = this.currentState.pixelsNearestTileTopLeftCoordinates(x, y);
        x = this.roundedCoordinates[0];
        y = this.roundedCoordinates[1];

        this.x = x + (this.game.state.states.play.squareWidth * .5);
        this.y = y + (this.game.state.states.play.squareWidth * .5);

        this.anchor.setTo(0.5, 0.5);

        this.checkWorldBounds = true;
        this.collideWorldBounds = false;
        this.outOfBoundsKill = false;

        let gridCoordinates = this.currentState.translatePixelCoordinatesToGridCoordinates(this.body.x, this.body.y);
        this.gridX = gridCoordinates[0];
        this.gridY = gridCoordinates[1];

        let scale = this.getScale();
        if (scale !== 1)
        {
            this.scale.setTo(scale, scale);
        }
    }

    initialise()
    {
        this.navigatingToGoal = true;
    }

    prepareForGameOver()
    {
        this.body.enable = false;
    }

}

window.Nathan = class Nathan extends Character
{
    drawForceFields()
    {
        if (this.game.state.current === 'play')
        {
            this.currentState.drawForceFields(this, this.game.state.states.play.lives);
        }
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
        this.currentState.drawForceFields(this, this.game.state.states.play.lives);
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

        if (this.game.state.current !== 'play')
        {
            return;
        }

        if (this.hasReachedGoal())
        {
            this.generateNewGoal();
        }

        if (this.haveGridCoordinatesChanged())
        {
            this.currentState.addGlobalImpassablePoint(this.gridX, this.gridY);
            this.currentState.removeGlobalImpassablePoint(this.oldGridX, this.oldGridY);
            if (this.pathNeedsRegenerating)
            {
                this.moveToCoordinates(this.goalX, this.goalY);
            }
        }

        this.followPath();
    }

    /**
     * Generate a new goal.
     *
     * @returns {boolean}
     */
    generateNewGoal()
    {
        if (this.game.state.current !== 'play')
        {
            return false;
        }
        let goal = this.currentState.level.bullyGoalCoordinates[Math.floor(Math.random() * this.currentState.level.bullyGoalCoordinates.length)];
        this.goalX = goal[0];
        this.goalY = goal[1];
        this.moveToCoordinates(this.goalX, this.goalY);
        return true;
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


// Reco is an invisible sprite the camera follows during level introductions.
window.Reco = class Reco extends Character
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Reco');
        this.width = 1;
        this.height = 1;
    }

    die()
    {
        this.destroy();
    }
};
