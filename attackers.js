function Attacker(game, x, y, spriteName, waveNumber) {
    
    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();

    Phaser.Sprite.call(this, game, x, y, spriteName);
    
    game.physics.arcade.enable(this);

    this.x = x;
    this.y = y;

    this.body.bounce.setTo(0.1, 0.1);
    this.anchor.setTo(0.5, 0.75);

    this.checkWorldBounds = true;
    this.collideWorldBounds = false;
    this.outOfBoundsKill = false;

    var scale = this.getScale();
    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }


    this.initialise(waveNumber);

}
Attacker.prototype = Object.create(Phaser.Sprite.prototype);
Attacker.prototype.constructor = Attacker;
Attacker.prototype.initialise = function(waveNumber)
{
    this.creationTurn = mainState.turn;
    this.waveNumber = waveNumber;
    this.health = (window[this.constructor.name].defaultHealth || 1000) * this.calculateHealthModifier();
    this.maximumHealth = this.health;
    this.coinsValue = window[this.constructor.name].coinsValue || 1;
    this.scoreValue = window[this.constructor.name].scoreValue || 5;
    this.invulnerable = false;
    this.incrementalId = mainState.attackersSpawnedCount;

    this.speed = (window[this.constructor.name].defaultSpeed || 75);
    this.path = [];
    this.path_step = -1;

    this.targeted = false;

    this.tint = 0xffffff;
    this.alpha = 1;

    if (this.fadeOutTween) {
        game.tweens.remove(this.fadeOutTween);
    }

    this.moveToGoal();

};
Attacker.prototype.hit = function(attacker, bullet)
{
    if (!this.invulnerable) {
        attacker.health -= bullet.damageValue;
    }

    if (bullet.towerClass == 'Freezer') {
        attacker.freeze(bullet.grade);
    }

    mainState.spawnExplosion(bullet.x, bullet.y);
    bullet.kill();

};
Attacker.prototype.update = function()
{

    if (!this.alive) {
        return;
    }

    if (this.hasReachedGoal()) {
        this.reachedGoal();
    }
    
    if (this.haveGridCoordinatesChanged()) {
        if (this.pathNeedsRegenerating) {
            this.moveToGoal();
        }
    }

    this.followPath();

    // game.physics.arcade.collide(this, mainState.collisionLayer);

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


};
Attacker.prototype.moveToGoal = function()
{

    var pixelCoordinates = mainState.translateGridCoordinatesToPixelCoordinates(
        mainState.level.goalXGrid,
        mainState.level.goalYGrid
    );

    var target_position = new Phaser.Point(pixelCoordinates[0], pixelCoordinates[1]);
    this.move_to(target_position);

    this.pathNeedsRegenerating = false;

};

/**
 * Has the attacker reached its goal?
 *
 * @returns {boolean}
 */
Attacker.prototype.hasReachedGoal = function()
{

    // Goal is always to left of the screen. Assume if this.x is more than 100, not reached goal.
    // Maybe change this if goal location becomes more varied.
    if (this.x > 100) {
        return false;
    }

    var goalX;

    if (mainState.nathan) {

        var distanceToGoal = game.physics.arcade.distanceBetween(this, mainState.nathan);

        var distanceNeeded = 26 + (mainState.lives-1) * 7.5;

        if (distanceToGoal <= distanceNeeded) {
            return true;
        } else {
            return false;
        }

    }

    var pixelCoordinates = mainState.translateGridCoordinatesToPixelCoordinates(
        mainState.level.goalXGrid,
        mainState.level.goalYGrid
    );

    goalX = pixelCoordinates[0] + mainState.halfSquareWidth;

    goalX += (32 + ((mainState.lives-1) * 7.5));

    if (this.x <= goalX) {
        return true;
    }

    return false;
};
Attacker.prototype.reachedGoal = function()
{

    if (this.reachedGoalProcessed) {
        return;
    }

    this.invulnerable = true;

    mainState.spawnExplosion(this.x - 10, this.y, 0x8888ff);

    // Fade out over 200 ms
    this.fadeOutTween = game.add.tween(this).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 1000, true);

    // Die in 200 ms
    timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * .2, this.die, this));

    this.reachedGoalProcessed = true;

};
Attacker.prototype.followPath = function()
{
    // mainState.game.physics.arcade.collide(this, mainState.layers.collision);

    if (this.path.length == 0) {

        this.body.velocity.x = -this.speed;
        this.body.velocity.y = 0;

    } else {

        this.next_position = this.path[this.path_step];

        if (!this.reached_target_position(this.next_position)) {
            this.velocity = new Phaser.Point(
                this.next_position.x - this.position.x,
                this.next_position.y - this.position.y
            );
            this.velocity.normalize();
            this.body.velocity.x = this.velocity.x * this.speed;
            this.body.velocity.y = this.velocity.y * this.speed;
        } else {
            this.position.x = this.next_position.x;
            this.position.y = this.next_position.y;
            if (this.path_step < this.path.length - 1) {
                this.path_step += 1;
            } else {
                this.path = [];
                this.path_step = -1;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        }
    }

    /*
    var deltaTime = (game.time.elapsedMS * game.time.fps) / 1000;
    this.body.velocity.x *= deltaTime;
    this.body.velocity.y *= deltaTime;
    */

};

Attacker.prototype.reached_target_position = function (target_position) {
    "use strict";
    var distance;
    distance = Phaser.Point.distance(this.position, target_position);
    return distance < 1;
};

Attacker.prototype.move_to = function (target_position) {
    mainState.pathfinding.find_path(this.position, target_position, this.move_through_path, this, this.getAdditionalCostTiles());
};

Attacker.prototype.getAdditionalCostTiles = function() {

    if (typeof mainState.level.pathAdditionalCostTiles == 'function') {
        return mainState.level.pathAdditionalCostTiles(this);
    }

    return [];

};

Attacker.prototype.move_through_path = function (path) {
    "use strict";
    if (path !== null) {
        this.path = path;
        this.path_step = 0;
    } else {
        this.path = [];
    }
};

Attacker.prototype.prepareForGameOver = function()
{
    this.body.enable = false;
    this.invulnerable = true;
};

Attacker.prototype.die = function()
{
    if (!this.alive || mainState.lives < 1) {
        return false;
    }
    if (this.health <= 0) {
        mainState.changeCoins(this.coinsValue, this.x, this.y);
        mainState.changeScore(this.scoreValue, this.x, this.y);
    } else if (mainState.lives >= 1) {
        mainState.changeLives(-1, this.x, this.y);
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

    this.kill();
};

/**
 * Create a health bar for the sprite, if appropriate.
 *
 * @returns {boolean}
 */
Attacker.prototype.createHealthBar = function()
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

    var healthBarX = this.x;
    var healthBarY = this.y - 30;

    this.healthBar = this.game.add.sprite(healthBarX, healthBarY, 'healthBar');
    this.game.healthBars.add(this.healthBar);

    this.healthBar.frame = 0;
    this.healthBar.anchor.setTo(0.5, 0.5);

    return true;

};

/**
 * Update's the sprite's health bar, if appropriate.
 *
 * @returns {boolean}
 */
Attacker.prototype.updateHealthBar = function()
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

    var healthPercentage = Math.round((this.health / this.maximumHealth) * 100);

    var healthBarFrame = Math.floor(healthPercentage*.2);

    healthBarFrame = 20 - healthBarFrame;

    if (healthBarFrame != this.healthBar.frame && (!this.healthBarAnimation || !this.healthBarAnimation.isPlaying)) {

        this.healthBar.frame = healthBarFrame;

        /*
        var animationName = this.healthBar.frame + '_to_' + healthBarFrame;

        var frames = Phaser.ArrayUtils.numberArray(this.healthBar.frame, healthBarFrame);

        if (frames.length) {
            var fps = Math.round(frames.length * 4);

            this.healthBar.animations.add(
                animationName,
                frames,
                fps,
                false
            );

            this.healthBarAnimation = this.healthBar.animations.play(animationName);
        }
        */

    }

    var healthBarX = this.x;
    var healthBarY = this.y - 30;

    this.healthBar.x = healthBarX;
    this.healthBar.y = healthBarY;

    return true;

};

Attacker.prototype.targetToggle = function()
{
    if (this.targeted) {
        this.untarget();
    } else {
        this.target();
    }
};
Attacker.prototype.target = function()
{
    mainState.untargetAll();
    mainState.setTarget(this);

    this.targeted = true;

    this.crosshair = game.add.sprite(this.x, this.y, 'crosshair');
    game.physics.arcade.enable(this.crosshair);

    this.crosshair.anchor.setTo(0.5, 0.75);

    // this.crosshair.trackSprite(this);

    mainState.crosshairs.add(this.crosshair);

};
Attacker.prototype.untarget = function()
{
    this.targeted = false;

    if (this.game.target.guid && this.guid == this.game.target.guid) {
        mainState.noTarget();
    }

    if (this.crosshair) {
        this.crosshair.kill();
    }
};
Attacker.prototype.updateCrosshair = function()
{
    if (!this.crosshair) {
        return false;
    }

    this.crosshair.x = this.x;
    this.crosshair.y = this.y;
};
Attacker.prototype.calculateHealthModifier = function()
{
    var waveHealthModifier = mainState.level.waveHealthModifier || .2;
    
    return (1 - waveHealthModifier) + (mainState.waveNumber * waveHealthModifier);
};
Attacker.prototype.freeze = function(bulletGrade)
{
    // Change speed to half default speed
    this.speed = window[this.constructor.name].defaultSpeed * .4;

    // Tint blue
    this.tint = 0x8888ff;
    
    var frozenSeconds = 3 + (bulletGrade * 3);

    // Schedule unfreeze event
    game.time.events.add(
        Phaser.Timer.SECOND * frozenSeconds,
        this.unfreeze,
        this
    ).autoDestroy = true;

};
Attacker.prototype.unfreeze = function()
{
    // Change speed to default
    this.speed = window[this.constructor.name].defaultSpeed;

    // Remove tint
    this.tint = 0xffffff;

};
Attacker.prototype.reuse = function()
{

    // console.log('Reusing ' + this.constructor.name + ' ' + this.guid);

    var coordinates = mainState.generateSpawnAttackerPixelCoordinates();

    var x = coordinates[0];
    var y = coordinates[1];

    this.reset(x, y);

    if (this.healthBar) {
        this.healthBar.reset();
    }

    this.initialise(mainState.waveNumber);

};
/**
 * Determines whether grid coordinates have changed since last turn.
 *
 * @returns {boolean}
 */
Attacker.prototype.haveGridCoordinatesChanged = function()
{
    var gridCoordinatesChanges = false;

    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(this.x, this.y);

    if (gridCoordinates[0] != this.gridX) {
        this.gridX = gridCoordinates[0];
        gridCoordinatesChanges = true;
    }

    if (gridCoordinates[1] != this.gridY) {
        this.gridY = gridCoordinates[1];
        gridCoordinatesChanges = true;
    }

    return gridCoordinatesChanges;
};

// Begin Oscar
function Oscar(game, x, y) {
    Attacker.call(this, game, x, y, 'oscar');
    this.body.setSize(20, 30, 6, 1);
}
Oscar.prototype = Object.create(Attacker.prototype);
Oscar.prototype.constructor = Oscar;
Oscar.defaultScale = 1;
Oscar.defaultHealth = 1000;
Oscar.defaultSpeed = 75;
Oscar.coinsValue = 5;
Oscar.scoreValue = 5;
// End Oscar

// Begin Roger
function Roger(game, x, y) {
    Attacker.call(this, game, x, y, 'roger');
    this.body.setSize(20, 30, 6, 1);
}
Roger.prototype = Object.create(Attacker.prototype);
Roger.prototype.constructor = Roger;
Roger.defaultScale = 1;
Roger.defaultHealth = 1000;
Roger.defaultSpeed = 100;
Roger.coinsValue = 5;
Roger.scoreValue = 5;
// End Roger

// Begin Aquila
function Aquila(game, x, y) {
    Attacker.call(this, game, x, y, 'aquila');
    this.body.setSize(20, 30, 6, 1);
}
Aquila.prototype = Object.create(Attacker.prototype);
Aquila.prototype.constructor = Aquila;
Aquila.defaultScale = 1;
Aquila.defaultHealth = 2000;
Aquila.defaultSpeed = 75;
Aquila.coinsValue = 10;
Aquila.scoreValue = 10;
// End Aquila

// Begin Mib
function Mib(game, x, y) {
    Attacker.call(this, game, x, y, 'mib');
    this.body.setSize(20, 30, 6, 1);
}
Mib.prototype = Object.create(Attacker.prototype);
Mib.prototype.constructor = Mib;
Mib.defaultScale = 1;
Mib.defaultHealth = 4000;
Mib.defaultSpeed = 75;
Mib.coinsValue = 15;
Mib.scoreValue = 15;
// End Mib