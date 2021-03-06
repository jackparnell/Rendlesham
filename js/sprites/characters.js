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
    }

    initialise()
    {
        this.navigatingToGoal = true;
        this.overrideSimpleAnimate = false;

        let scale = this.getScale();

        this.scale.setTo(scale, scale);

        this.initialised = true;
    }

    prepareForGameOver()
    {
        this.body.enable = false;
    }

    drawForceFields()
    {
        if (this.game.state.current === 'play')
        {
            this.currentState.drawForceFields(this, this.game.state.states.play.lives);
        }
    }

    action() {}

    defeated() {}

    hurt() {}

    update()
    {
        super.update();
        if (!this.initialised)
        {
            this.initialise();
        }
    }
}

window.Nathan = class Nathan extends Character
{

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
        super.initialise();

        this.creationTurn = game.globals.turn;

        this.speed = (window[this.constructor.name].defaultSpeed || 75);
        this.path = [];
        this.path_step = -1;

        this.tint = 0xffffff;
        this.alpha = 1;

        this.tilesTraversed = 0;

        this.generateNewGoal();
    }

    update()
    {
        super.update();

        if (!this.alive)
        {
            return;
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



window.Wizard = class Wizard extends Character
{
    constructor(game, x, y)
    {
        super(game, x, y, 'wizard');
        this.simpleSetSize();
        this.animations.add('action', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 45, false, true);
        this.animations.add('defeated', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 12, false, true);
        this.animations.add('hurt', [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], 12, false, true);
        this.animations.add('idle', [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], 12, false, true);
        this.anchor.setTo(0.5, 0.75);
        this.forceFieldCenterXOffset = 2;
        this.forceFieldCenterYOffset = -15;
    }

    initialise()
    {
        super.initialise();
        if (this.currentState.level.goalCharacterDefaultFacing === 'left')
        {
            this.scale.x = -1;
            this.forceFieldCenterXOffset *= -1;
            this.forceFieldCenterYOffset *= -1;
        }
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }

    action()
    {
        this.overrideSimpleAnimate = true;
        this.animations.play('action');
    }

    defeated()
    {
        this.overrideSimpleAnimate = true;
        this.animations.play('defeated');
    }

    hurt()
    {
        this.overrideSimpleAnimate = true;
        this.animations.play('hurt');
    }
};
Wizard.defaultScale = 1;
Wizard.spriteName = 'Wizard';