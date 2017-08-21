class Obstacle extends GameSprite
{
    static get MAXIMUM_GRADE() { return 1; }

    constructor (game, x, y, spriteName)
    {
        super(game, x, y, spriteName);

        this.moveable = false;

        this.guid = guid();
        this.creationTurn = this.game.globals.turn;

        this.health = this.constructor.DEFAULT_HEALTH || 1000;
        this.maximumHealth = this.health;
        this.coinsValue = this.constructor.DEFAULT_COINS_VALUE || 0;
        this.scoreValue = this.constructor.DEFAULT_SCORE_VALUE || 0;
        this.invulnerable = false;

        this.game.physics.arcade.enable(this);

        this.roundedCoordinates = this.game.state.states[this.game.state.current].pixelsNearestTileTopLeftCoordinates(x, y);
        x = this.roundedCoordinates[0];
        y = this.roundedCoordinates[1];

        this.x = x + this.game.state.states[this.game.state.current].halfSquareWidth;
        this.y = y + this.game.state.states[this.game.state.current].halfSquareWidth;

        this.anchor.setTo(0.5, 0.5);

        this.checkWorldBounds = true;
        this.collideWorldBounds = false;
        this.outOfBoundsKill = false;

        let scale = this.constructor.DEFAULT_SCALE || 1;
        if (scale !== 1)
        {
            this.scale.setTo(scale, scale);
        }

        this.targeted = false;

        this.initialise();
    }

    initialise()
    {
        this.body.immovable = true;
        this.body.moves = false;
        this.grade = 1;
    }

    firstUpdate()
    {
        this.generateGridCoordinates();
        if (this.game.state.current === 'play')
        {
            this.currentState.addGlobalImpassablePoint(this.gridX, this.gridY, 'grid');
        }
        this.firstUpdateRun = true;
    }

    hit(obstacle, bullet)
    {
        if (bullet.canOnlyHitTarget && bullet.target.guid !== obstacle.guid) {
            return false;
        }

        if (!this.invulnerable) {
            obstacle.health -= bullet.damageValue;
        }

        let decorationClassName = window[bullet.towerClass].bulletHitDecorationClassName || 'Explosion';
        let decorationTint = window[bullet.towerClass].bulletHitDecorationTint || '0xFFFFFF';
        let spawnFunctionName = 'spawn' + decorationClassName;
        let midPoint = this.currentState.getMidPointBetweenSprites(obstacle, bullet);
        this.currentState[spawnFunctionName](midPoint.x, midPoint.y, decorationTint, midPoint.angle);

        delete bullet.target;
        bullet.kill();

        return true;
    }

    generateGridCoordinates()
    {
        let gridCoordinates = this.currentState.translatePixelCoordinatesToGridCoordinates(this.x, this.y);
        this.gridX = gridCoordinates[0];
        this.gridY = gridCoordinates[1];
    }

    update()
    {
        if (!this.alive)
        {
            return;
        }

        if (!this.firstUpdateRun)
        {
            this.firstUpdate();
        }

        if (!this.gridX || !this.gridY)
        {
            this.generateGridCoordinates();
        }

        this.game.bullets.forEachAlive(function(bullet) {
            this.game.physics.arcade.overlap(this, bullet, this.hit, null, this);
        }, this);

        this.updateHealthBar();
        this.updateCrosshair();

        if (this.health <= 0)
        {
            this.health = 0;
            this.die();
        }
        if (isNaN(this.health))
        {
            throw {
                'code': 10001,
                'description': 'Health of ' + this.constructor.name + ' is not a number.'
            };
        }
    }

    prepareForGameOver()
    {
        this.body.enable = false;
        this.invulnerable = true;
    }

    die()
    {
        if (this.health <= 0)
        {
            this.currentState.changeCoins(this.coinsValue, this.x, this.y);
            this.currentState.changeScore(this.scoreValue, this.x, this.y);
            this.currentState.sounds.nes08.play();
        }
        if (this.healthBar)
        {
            this.healthBar.kill();
        }
        if (this.crosshair)
        {
            this.crosshair.kill();
        }
        if (this.targeted)
        {
            this.currentState.noTarget();
        }

        this.currentState.removeGlobalImpassablePoint(this.gridX, this.gridY, 'grid');

        this.kill();
    }

    /**
     * Create a health bar for the sprite, if appropriate.
     *
     * @returns {boolean}
     */
    createHealthBar()
    {
        if (this.game.noHealthBars)
        {
            return false;
        }

        if (!this.alive)
        {
            return false;
        }

        // No health bar if at full health
        if (this.health >= this.maximumHealth)
        {
            return;
        }

        let healthBarX = this.x;
        let healthBarY = this.y - 20;

        this.healthBar = this.game.add.sprite(healthBarX, healthBarY, 'healthBar');
        this.game.healthBars.add(this.healthBar);

        this.healthBar.anchor.setTo(0.5, 0.5);

        return true;
    }

    /**
     * Update's the sprite's health bar, if appropriate.
     *
     * @returns {boolean}
     */
    updateHealthBar()
    {
        if (this.game.noHealthBars)
        {
            return false;
        }

        // No health bar if at full health
        if (this.health >= this.maximumHealth)
        {
            return false;
        }

        if (!this.healthBar)
        {
            this.createHealthBar();
        }

        let healthPercentage = Math.round((this.health / this.maximumHealth) * 100);

        let healthBarFrame = Math.floor(healthPercentage*.2);

        healthBarFrame = 20 - healthBarFrame;

        if (healthBarFrame !== this.healthBar.frame)
        {
            this.healthBar.frame = healthBarFrame;
        }

        let healthBarX = this.x;
        let healthBarY = this.y - 18;

        this.healthBar.x = healthBarX;
        this.healthBar.y = healthBarY;

        return true;
    }

    targetToggle()
    {
        if (this.targeted)
        {
            this.untarget();
        }
        else
        {
            this.target();
        }
    }

    target()
    {
        // Un-target all other obstacles and attackers
        this.currentState.untargetAll();
        this.currentState.setTarget(this);

        this.targeted = true;

        this.crosshair = game.add.sprite(this.x, this.y, 'crosshair');
        this.game.physics.arcade.enable(this.crosshair);

        this.currentState.crosshairs.add(this.crosshair);
    }

    untarget()
    {
        this.targeted = false;
        if (this.game.target.guid && this.guid === this.game.target.guid)
        {
            this.currentState.noTarget();
        }
        if (this.crosshair)
        {
            this.crosshair.kill();
        }
    }

    updateCrosshair()
    {
        if (!this.crosshair)
        {
            return false;
        }
        this.crosshair.x = this.x - this.currentState.halfSquareWidth - 2 ;
        this.crosshair.y = this.y - this.currentState.halfSquareWidth - 2;
    }

    onWaveBeaten()
    {
        this.calculateSpecs();
    }

    calculateSpecs()
    {
        if (this.constructor.MAXIMUM_GRADE > 1)
        {
            this.coinsValue = this.constructor.DEFAULT_COINS_VALUE * (.5 + (this.grade * .5));
            this.scoreValue = this.constructor.DEFAULT_SCORE_VALUE * (.5 + (this.grade * .5));
        }
    }
}

class TallBrownMushroom extends Obstacle
{
    static get DESCRIPTION() { return 'The Brown Mushroom is a mushroom you can target. Destroy it to earn coins.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 50; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 105; }

    constructor(game, x, y)
    {
        super(game, x, y, 'TallBrownMushroom');
        this.createCentralCircle(16);
    }
}

class TallRedMushroom extends Obstacle
{

    static get DESCRIPTION() { return 'The Red Mushroom is tougher than the Brown Mushroom and worth more coins.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 35000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 100; }
    static get SPRITE_SHEET_GID() { return 106; }

    constructor(game, x, y)
    {
        super(game, x, y, 'TallRedMushroom');
        this.createCentralCircle(16);
    }
}

class TallGreyMushroom extends Obstacle
{
    static get DESCRIPTION() { return 'The Grey Mushroom is rare and worth a lot of coins if you can destroy it.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 50000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 150; }
    static get SPRITE_SHEET_GID() { return 107; }

    constructor(game, x, y)
    {
        super(game, x, y, 'TallGreyMushroom');
        this.createCentralCircle(16);
    }

    die()
    {
        super.die();

        if (!this.currentState.hasItem('greyMushroomSpore')) {
            this.currentState.addItem('greyMushroomSpore');
        }
    }
}

class BigBush extends Obstacle
{
    static get DESCRIPTION() { return 'The Big Bush is foliage. Destroy it for fun, but it has no coin value.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 20; }
    static get SPRITE_SHEET_GID() { return 63; }

    constructor(game, x, y)
    {
        super(game, x, y, 'BigBush');
        this.createCentralCircle(16);
    }
}

class BigBushAutumn extends Obstacle
{
    static get DESCRIPTION() { return 'The Big Bush is foliage. Destroy it for fun, but it has no coin value.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 20; }
    static get SPRITE_SHEET_GID() { return 5; }

    constructor(game, x, y)
    {
        super(game, x, y, 'BigBushAutumn');
        this.createCentralCircle(16);
    }
}

class SmallBush extends Obstacle
{
    static get DESCRIPTION() { return 'The Small Bush is foliage. Destroy it for fun, but it has no coin value.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 5000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 10; }
    static get SPRITE_SHEET_GID() { return 64; }

    constructor(game, x, y)
    {
        super(game, x, y, 'SmallBush');
        this.createCentralCircle(16);
    }
}

class SnowyPine extends Obstacle
{
    static get DESCRIPTION() { return 'The Snowy Pine is foliage. Destroy it for fun, but it has no coin value.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 5000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 20; }
    static get SPRITE_SHEET_GID() { return 94; }

    constructor(game, x, y)
    {
        super(game, x, y, 'SnowyPine');
        this.createCentralCircle(16);
    }
}

class Rock extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 15000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 51; }

    constructor(game, x, y)
    {
        super(game, x, y, 'Rock');
        // this.createCentralCircle(18);
    }
}

class PurpleRock extends Obstacle
{
    static get DESCRIPTION() { return 'The Purple Rock is a tough obstacle to destroy. It is there to block you, but has no coin value.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 15000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 59; }

    constructor(game, x, y)
    {
        super(game, x, y, 'PurpleRock');
        this.createCentralCircle(18);
    }
}

class Crate extends Obstacle
{
    static get DESCRIPTION() { return 'The Crate is a tough obstacle to destroy. It is there to block you, but has no coin value.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 15000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 51; }

    constructor(game, x, y)
    {
        super(game, x, y, 'Crate');
        this.createCentralCircle(18);
    }
}

class Bulrush extends Obstacle
{
    static get DESCRIPTION() { return 'The Bulrush is a rare plant. Destroy it for a coin bonus.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 20000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 150; }
    static get SPRITE_SHEET_GID() { return 78; }

    constructor(game, x, y)
    {
        super(game, x, y, 'Bulrush');
        this.createCentralCircle(8);
    }

    die()
    {
        super.die();
        if (!this.currentState.hasItem('bulrushSeed'))
        {
            this.currentState.addItem('bulrushSeed');
        }
    }
}

class Snowman extends Obstacle
{
    static get DESCRIPTION() { return 'The Snowman is a super tough obstacle. Destroy it for a coin bonus.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 100000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 150; }
    static get SPRITE_SHEET_GID() { return 76; }

    constructor(game, x, y)
    {
        super(game, x, y, 'Snowman');
        this.createCentralCircle(16);
    }

    die()
    {
        super.die();
        if (!this.currentState.hasItem('carrot'))
        {
            this.currentState.addItem('carrot');
        }
    }
}

class Pumpkin extends Obstacle
{
    static get DESCRIPTION() { return 'The Pumpkin is a plant you can target. Destroy it to earn coins.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 15000; }
    static get DEFAULT_COINS_VALUE() { return 50; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 60; }

    constructor(game, x, y)
    {
        super(game, x, y, 'Pumpkin');
        this.createCentralCircle(16);
    }

    die()
    {
        super.die();
        this.currentState.addItem('Pumpkin');
    }
}

class PinkCrystal extends Obstacle
{
    static get DESCRIPTION() { return 'The Pink Crystal is a very valuable target. Destroy it for a coin bonus.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 30000; }
    static get DEFAULT_COINS_VALUE() { return 200; }
    static get DEFAULT_SCORE_VALUE() { return 200; }
    static get SPRITE_SHEET_GID() { return 118; }

    constructor(game, x, y)
    {
        super(game, x, y, 'PinkCrystal');
        this.createCentralCircle(8);
    }

    die()
    {
        super.die();
        if (!this.currentState.hasItem('pinkCrystal'))
        {
            this.currentState.addItem('pinkCrystal');
        }
    }
}

class Puffball extends Obstacle
{
    static get DESCRIPTION() { return 'The Puffball is a mushroom that grows as the game progress. The larger is gets, the more coins it is worth.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 15000; }
    static get DEFAULT_COINS_VALUE() { return 50; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get MAXIMUM_GRADE() { return 3; }

    constructor(game, x, y)
    {
        super(game, x, y, 'Puffball');
        this.createCentralCircle(8);
    }

    onWaveBeaten()
    {
        this.upgrade();
        super.onWaveBeaten();
    }

    upgrade()
    {
        if (this.grade < this.constructor.MAXIMUM_GRADE)
        {
            this.grade += 1;
        }
        this.frame = (this.grade - 1);
    }
}

class Tombstone extends Obstacle
{
    static get DESCRIPTION() { return 'The Tombstone is a targetable obstacle. Destroy it for a coin bonus.'; }
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 50; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 9; }

    constructor(game, x, y)
    {
        super(game, x, y, 'Tombstone');
        this.createCentralCircle(8);
    }
}