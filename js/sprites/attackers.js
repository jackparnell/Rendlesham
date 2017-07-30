class Attacker extends GameSprite
{
    constructor (game, x, y, spriteName, waveNumber)
    {
        super(game, x, y, spriteName);

        this.moveable = true;

        this.guid = guid();

        this.game.physics.arcade.enable(this);

        this.x = x;
        this.y = y;

        this.body.bounce.setTo(0.1, 0.1);
        this.anchor.setTo(0.5, 0.75);

        this.checkWorldBounds = true;
        this.collideWorldBounds = false;
        this.outOfBoundsKill = false;

        let scale = this.getScale();
        if (scale !== 1)
        {
            this.scale.setTo(scale, scale);
        }

        this.initialise(waveNumber);
    }

    initialise(waveNumber)
    {
        this.creationTurn = this.game.globals.turn;
        this.waveNumber = waveNumber;
        this.health = Math.floor(
            (window[this.constructor.name].defaultHealth || 1000)
            *
            this.calculateHealthModifier()
        );
        this.maximumHealth = this.health;
        this.coinsValue = window[this.constructor.name].coinsValue || 1;
        this.scoreValue = window[this.constructor.name].scoreValue || 5;
        this.domain = window[this.constructor.name].domain || 'land';
        this.invulnerable = false;
        this.incrementalId = this.game.state.states.play.attackersSpawnedCount;

        this.speed = this.calculateSpeed();
        this.path = [];
        this.path_step = -1;
        this.advancement = 0;

        this.targeted = false;

        this.tint = 0xffffff;
        this.alpha = 1;

        this.tilesTraversed = 0;

        if (this.fadeOutTween)
        {
            this.game.tweens.remove(this.fadeOutTween);
        }

        this.reachedGoalProcessed = false;
        this.reachedGoalTurn = 0;

        this.moveToGoal();
    }

    hit(attacker, bullet)
    {
        if (bullet.canOnlyHitTarget && bullet.target.guid !== attacker.guid)
        {
            return false;
        }

        if (!this.invulnerable)
        {
            attacker.health -= bullet.damageValue;
        }

        if (bullet.towerClass === 'Freezer')
        {
            attacker.freeze(bullet.grade);
        }

        let decorationClassName = window[bullet.towerClass].bulletHitDecorationClassName || 'Explosion';
        let decorationTint = window[bullet.towerClass].bulletHitDecorationTint || '0xFFFFFF';
        let spawnFunctionName = 'spawn' + decorationClassName;

        let midPoint = this.game.state.states.play.getMidPointBetweenSprites(attacker, bullet);
        this.game.state.states.play[spawnFunctionName](midPoint.x, midPoint.y, decorationTint, midPoint.angle);

        delete bullet.target;
        bullet.kill();

        return true;
    }

    update()
    {
        if (!this.alive)
        {
            return;
        }

        if (this.hasReachedGoal())
        {
            this.reachedGoal();
        }

        if (this.haveGridCoordinatesChanged())
        {
            if (this.pathNeedsRegenerating)
            {
                this.moveToGoal();
            }
        }

        this.followPath();

        this.game.bullets.forEachAlive(function(bullet) {
            this.game.physics.arcade.overlap(this, bullet, this.hit, null, this);
        }, this);

        if (this.health <= 0)
        {
            this.health = 0;
            this.die();
            return;
        }

        this.updateHealthBar();
        this.updateCrosshair();
        this.handleNoPath();

        this.calculateProjectedHealth();

        if (isNaN(this.health))
        {
            throw {
                'code': 10001,
                'description': 'Health of ' + this.constructor.name + ' is not a number.'
            };
        }
    }

    handleNoPath()
    {
        if (!this.path || this.path.length === 0)
        {
            this.moveToGoal();
        }
    }

    moveToGoal()
    {
        this.moveToCoordinates(
            this.game.state.states.play.getGoalXGrid(),
            this.game.state.states.play.getGoalYGrid()
        );
    }

    /**
     * Has the attacker reached its goal?
     *
     * @returns {boolean}
     */
    hasReachedGoal()
    {
        if (this.game.state.states.play.level.goalX <= 1 && this.x > 100)
        {
            return false;
        }

        if (this.game.state.states.play.level.goalY <= 1 && this.y > 100)
        {
            return false;
        }

        if (this.game.state.states.play.nathan)
        {
            let distanceToGoal = this.game.physics.arcade.distanceBetween(this, this.game.state.states.play.nathan);
            let distanceNeeded = 26 + (this.game.state.states.play.lives-1) * 7.5;
            return (distanceToGoal <= distanceNeeded);
        }

        return (this.gridX === this.game.state.states.play.level.goalXGrid && this.gridY === this.game.state.states.play.level.goalYGrid);
    }

    reachedGoal()
    {
        if (this.reachedGoalProcessed)
        {
            return;
        }

        this.reachedGoalTurn = this.game.globals.turn;

        this.invulnerable = true;

        this.game.state.states.play.spawnExplosion(this.x - 10, this.y, 0x8888ff);

        // Fade out over 200 ms
        this.fadeOutTween = this.game.add.tween(this).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 1000, true);

        // Die in 200 ms
        this.game.timerEvents.push(this.game.time.events.add(Phaser.Timer.SECOND * .2, this.die, this));

        this.reachedGoalProcessed = true;
    }

    prepareForGameOver()
    {
        if (this.hasOwnProperty('animations') && this.animations.hasOwnProperty('paused'))
        {
            this.animations.paused = true;
        }
        this.body.enable = false;
        this.invulnerable = true;
    }

    die()
    {
        if (!this.alive || this.game.state.states.play.lives < 1)
        {
            return false;
        }
        if (this.health <= 0)
        {
            this.game.state.states.play.changeCoins(this.coinsValue, this.x, this.y);
            this.game.state.states.play.changeScore(this.scoreValue, this.x, this.y);
            this.game.state.states.play.sounds.nes09.play();
        }
        else if (this.game.state.states.play.lives >= 1)
        {
            this.game.state.states.play.changeLives(-1, this.x, this.y);
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
            this.game.state.states.play.noTarget();
        }
        this.kill();
    }

    vanish()
    {
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
            this.game.state.states.play.noTarget();
        }
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
            return false;
        }

        let healthBarX = this.x;
        let healthBarY = this.y - 30;

        this.healthBar = this.game.add.sprite(healthBarX, healthBarY, 'healthBar');
        this.game.healthBars.add(this.healthBar);

        this.healthBar.frame = 0;
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

        if (healthBarFrame !== this.healthBar.frame && (!this.healthBarAnimation || !this.healthBarAnimation.isPlaying))
        {
            this.healthBar.frame = healthBarFrame;
        }

        let healthBarX = this.x;

        let healthBarYOffset = 0;
        if (window[this.constructor.name].spriteHeight)
        {
            healthBarYOffset = -window[this.constructor.name].spriteHeight + 3;
        }
        else
        {
            healthBarYOffset = -30;
        }

        let healthBarY = this.y + healthBarYOffset;

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
        this.game.state.states.play.untargetAll();
        this.game.state.states.play.setTarget(this);

        this.targeted = true;

        this.crosshair = this.game.add.sprite(this.x, this.y, 'crosshair');
        this.game.physics.arcade.enable(this.crosshair);

        this.crosshair.anchor.setTo(0.5, 0.75);

        this.game.state.states.play.crosshairs.add(this.crosshair);
    }

    untarget()
    {
        this.targeted = false;

        if (this.game.target.guid && this.guid === this.game.target.guid)
        {
            this.game.state.states.play.noTarget();
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

        this.crosshair.x = this.x;
        this.crosshair.y = this.y;
    }

    calculateHealthModifier()
    {
        return this.game.state.states.play.calculateWaveHealthModifier(this.game.state.states.play.waveNumber);
    }

    freeze(bulletGrade)
    {
        // Change speed to 40% normal value
        this.speed = this.calculateSpeed() * .4;

        // Tint blue
        this.tint = 0x8888ff;

        let frozenSeconds = 3 + (bulletGrade * 3);

        // Schedule unfreeze event
        this.game.time.events.add(
            Phaser.Timer.SECOND * frozenSeconds,
            this.unfreeze,
            this
        ).autoDestroy = true;
    }

    unfreeze()
    {
        // Change speed to default
        this.speed = this.calculateSpeed();

        // Remove tint
        this.tint = 0xffffff;
    }

    reuse()
    {
        let coordinates = this.game.state.states.play.generateSpawnAttackerPixelCoordinates();

        let x = coordinates[0];
        let y = coordinates[1];

        this.reset(x, y);

        if (this.healthBar)
        {
            this.healthBar.reset();
        }

        this.initialise(this.game.state.states.play.waveNumber);
    }

    calculateSpeed()
    {
        // Default speed is 75
        let speed = 75;
        // pace is tiles per second
        if (window[this.constructor.name].pace)
        {
            speed = this.game.state.states.play.map.tileWidth * window[this.constructor.name].pace;
        }
        else if (window[this.constructor.name].defaultSpeed)
        {
            speed = window[this.constructor.name].defaultSpeed;
        }
        return speed;
    }

    calculateProjectedHealth()
    {
        if (!this.game.state.states.play.level.calculateAttackerProjectedHealth)
        {
            this.projectedHealth = this.health;
            return;
        }

        let projectedHealth = this.health;

        let bullets = this.game.state.states.play.getBulletsAlive();

        for (let i = 0; i < bullets.length; i++)
        {
            projectedHealth -= bullets[i].damageValue;
        }

        this.projectedHealth = Math.floor(projectedHealth);
    }

    simpleAnimate()
    {
        if (this.body.velocity.x <= -5)
        {
            this.animations.play('walk');
            this.scale.x = -1;
        }
        else if (this.body.velocity.x >= 5)
        {
            this.animations.play('walk');
            this.scale.x = 1;
        }
        this.animations.play('walk');
    }

    simpleSetSize()
    {
        let bodyWidth = 25;
        let bodyHeight = 30;
        let offsetX = bodyWidth;
        let offsetY = 45 - bodyHeight;
        this.body.setSize(bodyWidth, bodyHeight, bodyWidth, offsetY);
    }

    getStepsToGoal()
    {
        if (!this.path)
        {
            return 999;
        }
        return this.path.length - this.path_step;
    }

    generateAdvancement()
    {
        let advancement = 0;
        switch (this.domain)
        {
            case 'air':
                let distanceToGoal = this.game.physics.arcade.distanceBetween(this, this.game.state.states.play.nathan);
                advancement = 100000 - (distanceToGoal * (100 / this.game.state.states.play.squareWidth));
                break;
            default:
                let stepsToGoal = this.getStepsToGoal();
                if (stepsToGoal)
                {
                    advancement = 100000 - (stepsToGoal * 100);
                }
        }
        this.advancement = advancement;
    }

    getAdvancement()
    {
        if (!this.advancement)
        {
            this.generateAdvancement();
        }
        return this.advancement;
    }

    getAgeInTurns()
    {
        return game.globals.turn - this.creationTurn;
    }

    reachedTargetPosition()
    {
        this.generateAdvancement();
    }
}


window.Oscar = class Oscar extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Oscar');
        this.body.setSize(20, 30, 6, 1);
        this.animations.add('walkDown', [1, 2], 6, false, true);
        this.animations.add('walkRight', [3, 4], 6, false, true);
        this.animations.add('walkLeft', [5, 6], 6, false, true);
        this.animations.add('walkUp', [7, 8], 6, false, true);
    }

    update()
    {
        super.update();

        if (!this.alive) {
            return;
        }

        if (this.body.velocity.y >= 15)
        {
            this.animations.play('walkDown');
        }
        else if (this.body.velocity.x <= -15)
        {
            this.animations.play('walkLeft');
        }
        else if (this.body.velocity.x >= 15)
        {
            this.animations.play('walkRight');
        }
        else if (this.body.velocity.y <= -15)
        {
            this.animations.play('walkUp');
        }
        else
        {
            this.animations.stop();
            this.frame = 0;
        }
    }
};
Oscar.defaultScale = 1;
Oscar.defaultHealth = 1000;
Oscar.pace = 2.15;
Oscar.coinsValue = 5;
Oscar.scoreValue = 5;

window.Roger = class Roger extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Roger');
        this.body.setSize(20, 30, 6, 1);
        this.animations.add('walkDown', [1, 2], 6, false, true);
        this.animations.add('walkRight', [3, 4], 6, false, true);
        this.animations.add('walkLeft', [5, 6], 6, false, true);
        this.animations.add('walkUp', [7, 8], 6, false, true);
    }

    update()
    {
        super.update();

        if (!this.alive) {
            return;
        }

        if (this.body.velocity.y >= 15)
        {
            this.animations.play('walkDown');
        }
        else if (this.body.velocity.x <= -15)
        {
            this.animations.play('walkLeft');
        }
        else if (this.body.velocity.x >= 15)
        {
            this.animations.play('walkRight');
        }
        else if (this.body.velocity.y <= -15)
        {
            this.animations.play('walkUp');
        }
        else
        {
            this.animations.stop();
            this.frame = 0;
        }
    }
};
Roger.defaultHealth = 1000;
Roger.pace = 2.9;
Roger.coinsValue = 5;
Roger.scoreValue = 5;

window.Dibley = class Dibley extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Dibley');
        this.body.setSize(20, 30, 6, 1);
    }
};
Dibley.prototype = Object.create(Attacker.prototype);
Dibley.prototype.constructor = Dibley;
Dibley.defaultScale = 1;
Dibley.defaultHealth = 5000;
Dibley.pace = 1.5;
Dibley.coinsValue = 10;
Dibley.scoreValue = 10;


window.Aquila = class Aquila extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Aquila');
        this.body.setSize(20, 30, 6, 1);
    }
};
Aquila.prototype = Object.create(Attacker.prototype);
Aquila.prototype.constructor = Aquila;
Aquila.defaultScale = 1;
Aquila.defaultHealth = 2000;
Aquila.pace = 2.15;
Aquila.coinsValue = 10;
Aquila.scoreValue = 10;

window.Mib = class Mib extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Mib');
        this.body.setSize(20, 30, 6, 1);
        this.animations.add('walkDown', [1, 2], 6, false, true);
        this.animations.add('walkRight', [3, 4], 6, false, true);
        this.animations.add('walkLeft', [5, 6], 6, false, true);
        this.animations.add('walkUp', [7, 8], 6, false, true);
    }

    update()
    {
        super.update();

        if (!this.alive)
        {
            return;
        }

        if (this.body.velocity.y >= 15)
        {
            this.animations.play('walkDown');
        }
        else if (this.body.velocity.x <= -15)
        {
            this.animations.play('walkLeft');
        }
        else if (this.body.velocity.x >= 15)
        {
            this.animations.play('walkRight');
        }
        else if (this.body.velocity.y <= -15)
        {
            this.animations.play('walkUp');
        }
        else
        {
            this.animations.stop();
            this.frame = 0;
        }
    }
};
Mib.defaultScale = 1;
Mib.defaultHealth = 4000;
Mib.pace = 2.15;
Mib.coinsValue = 15;
Mib.scoreValue = 15;

window.Drone = class Drone extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Drone');
        this.body.setSize(20, 30, 6, 1);
    }

    update()
    {
        super.update();

        if (!this.alive)
        {
            return;
        }

        this.angle += 1;

    }
};
Drone.domain = 'air';
Drone.defaultScale = 1;
Drone.defaultHealth = 1000;
Drone.pace = 3;
Drone.coinsValue = 15;
Drone.scoreValue = 15;