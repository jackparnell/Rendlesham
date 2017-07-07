class Obstacle extends Phaser.Sprite
{
    constructor (game, x, y, spriteName)
    {
        super(game, x, y, spriteName);

        $.extend( this, standard );

        this.guid = guid();
        this.creationTurn = game.globals.turn;

        this.health = this.constructor.DEFAULT_HEALTH || 1000;
        this.maximumHealth = this.health;
        this.coinsValue = this.constructor.DEFAULT_COINS_VALUE || 0;
        this.scoreValue = this.constructor.DEFAULT_SCORE_VALUE || 0;
        this.invulnerable = false;

        game.physics.arcade.enable(this);

        this.roundedCoordinates = mainState.pixelsNearestTileTopLeftCoordinates(x, y);
        x = this.roundedCoordinates[0];
        y = this.roundedCoordinates[1];

        this.x = x + mainState.halfSquareWidth;
        this.y = y + mainState.halfSquareWidth;

        this.anchor.setTo(0.5, 0.5);

        this.checkWorldBounds = true;
        this.collideWorldBounds = false;
        this.outOfBoundsKill = false;

        let scale = this.constructor.DEFAULT_SCALE || 1;
        if (scale != 1) {
            this.scale.setTo(scale, scale);
        }

        this.targeted = false;

        this.initialise();
    }

    initialise()
    {
        this.body.immovable = true;
        this.body.moves = false;
    }

    firstUpdate()
    {
        this.generateGridCoordinates();
        mainState.addGlobalImpassablePoint(this.gridX, this.gridY, 'grid');

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
        let midPoint = mainState.getMidPointBetweenSprites(obstacle, bullet);
        mainState[spawnFunctionName](midPoint.x, midPoint.y, decorationTint, midPoint.angle);

        delete bullet.target;
        bullet.kill();

        return true;
    }

    generateGridCoordinates()
    {
        let gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(this.x, this.y);
        this.gridX = gridCoordinates[0];
        this.gridY = gridCoordinates[1];
    }

    update()
    {
        if (!this.alive) {
            return;
        }

        if (!this.firstUpdateRun) {
            this.firstUpdate();
        }

        if (!this.gridX || !this.gridY) {
            this.generateGridCoordinates();
        }

        this.game.bullets.forEachAlive(function(bullet) {
            game.physics.arcade.overlap(this, bullet, this.hit, null, this);
        }, this);

        this.updateHealthBar();
        this.updateCrosshair();

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        if (isNaN(this.health)) {
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
        if (this.health <= 0) {
            mainState.changeCoins(this.coinsValue, this.x, this.y);
            mainState.changeScore(this.scoreValue, this.x, this.y);
            mainState.sounds.nes08.play();
        }
        if (this.healthBar) {
            this.healthBar.kill();
        }
        if (this.crosshair) {
            this.crosshair.kill();
        }
        if (this.targeted) {
            mainState.noTarget();
        }

        mainState.removeGlobalImpassablePoint(this.gridX, this.gridY, 'grid');

        this.kill();

    }

    /**
     * Create a health bar for the sprite, if appropriate.
     *
     * @returns {boolean}
     */
    createHealthBar()
    {
        if (this.game.noHealthBars) {
            return false;
        }

        if (!this.alive) {
            return false;
        }

        // No health bar if at full health
        if (this.health >= this.maximumHealth) {
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
        if (this.game.noHealthBars) {
            return false;
        }

        // No health bar if at full health
        if (this.health >= this.maximumHealth) {
            return false;
        }

        if (!this.healthBar) {
            this.createHealthBar();
        }

        let healthPercentage = Math.round((this.health / this.maximumHealth) * 100);

        let healthBarFrame = Math.floor(healthPercentage*.2);

        healthBarFrame = 20 - healthBarFrame;

        if (healthBarFrame !== this.healthBar.frame) {
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
        if (this.targeted) {
            this.untarget();
        } else {
            this.target();
        }
    }

    target()
    {
        // Un-target all other obstacles and attackers
        mainState.untargetAll();
        mainState.setTarget(this);

        this.targeted = true;

        this.crosshair = game.add.sprite(this.x, this.y, 'crosshair');
        game.physics.arcade.enable(this.crosshair);

        mainState.crosshairs.add(this.crosshair);
    }

    untarget()
    {
        this.targeted = false;

        if (this.game.target.guid && this.guid === this.game.target.guid) {
            mainState.noTarget();
        }

        if (this.crosshair) {
            this.crosshair.kill();
        }
    }

    updateCrosshair()
    {
        if (!this.crosshair) {
            return false;
        }

        this.crosshair.x = this.x - mainState.halfSquareWidth - 2 ;
        this.crosshair.y = this.y - mainState.halfSquareWidth - 2;
    }
}

class TallBrownMushroom extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 50; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 105; }

    constructor(game, x, y)
    {
        super(game, x, y, 'tallBrownMushroom');
        this.createCentralCircle(16);
    }
}

class TallRedMushroom extends Obstacle
{

    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 35000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 100; }
    static get SPRITE_SHEET_GID() { return 106; }

    constructor(game, x, y)
    {
        super(game, x, y, 'tallRedMushroom');
        this.createCentralCircle(16);
    }
}

class TallGreyMushroom extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 50000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 150; }
    static get SPRITE_SHEET_GID() { return 107; }

    constructor(game, x, y)
    {
        super(game, x, y, 'tallGreyMushroom');
        this.createCentralCircle(16);
    }

    die()
    {
        super.die();

        if (!mainState.hasItem('greyMushroomSpore')) {
            mainState.addItem('greyMushroomSpore');
        }
    }
}

class BigBush extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 20; }
    static get SPRITE_SHEET_GID() { return 63; }

    constructor(game, x, y)
    {
        super(game, x, y, 'bigBush');
        this.createCentralCircle(16);
    }
}

class BigBushAutumn extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 20; }
    static get SPRITE_SHEET_GID() { return 5; }

    constructor(game, x, y)
    {
        super(game, x, y, 'bigBushAutumn');
        this.createCentralCircle(16);
    }
}

class SmallBush extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 5000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 10; }
    static get SPRITE_SHEET_GID() { return 64; }

    constructor(game, x, y)
    {
        super(game, x, y, 'smallBush');
        this.createCentralCircle(16);
    }
}

class SnowyPine extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 5000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 20; }
    static get SPRITE_SHEET_GID() { return 94; }

    constructor(game, x, y)
    {
        super(game, x, y, 'smallBush');
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
        super(game, x, y, 'rock');
        // this.createCentralCircle(18);
    }
}

class PurpleRock extends Obstacle
{
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
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 15000; }
    static get DEFAULT_COINS_VALUE() { return 0; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 51; }

    constructor(game, x, y)
    {
        super(game, x, y, 'crate');
        this.createCentralCircle(18);
    }
}

class Bulrush extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 20000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 150; }
    static get SPRITE_SHEET_GID() { return 78; }

    constructor(game, x, y)
    {
        super(game, x, y, 'bulrush');
        this.createCentralCircle(8);
    }

    die()
    {
        super.die();

        if (!mainState.hasItem('bulrushSeed')) {
            mainState.addItem('bulrushSeed');
        }
    }
}

class Snowman extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 100000; }
    static get DEFAULT_COINS_VALUE() { return 100; }
    static get DEFAULT_SCORE_VALUE() { return 150; }
    static get SPRITE_SHEET_GID() { return 76; }

    constructor(game, x, y)
    {
        super(game, x, y, 'snowman');
        this.createCentralCircle(16);
    }

    die()
    {
        super.die();

        if (!mainState.hasItem('carrot')) {
            mainState.addItem('carrot');
        }
    }
}

class Pumpkin extends Obstacle
{
    static get DEFAULT_SCALE() { return 1; }
    static get DEFAULT_HEALTH() { return 10000; }
    static get DEFAULT_COINS_VALUE() { return 50; }
    static get DEFAULT_SCORE_VALUE() { return 50; }
    static get SPRITE_SHEET_GID() { return 60; }

    constructor(game, x, y)
    {
        super(game, x, y, 'pumpkin');
        this.createCentralCircle(16);
    }

    die()
    {
        super.die();

        if (!mainState.hasItem('pumpkin')) {
            mainState.addItem('pumpkin');
        }
    }
}

class PinkCrystal extends Obstacle
{
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

        if (!mainState.hasItem('pinkCrystal')) {
            mainState.addItem('pinkCrystal');
        }
    }
}