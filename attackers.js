function Attacker(game, x, y, spriteName, waveNumber) {

    $.extend( this, standard );
    $.extend( this, moveable );

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

    this.speed = this.calculateSpeed();
    this.path = [];
    this.path_step = -1;

    this.targeted = false;

    this.tint = 0xffffff;
    this.alpha = 1;

    this.tilesTraversed = 0;

    if (this.fadeOutTween) {
        game.tweens.remove(this.fadeOutTween);
    }

    this.moveToGoal();

};
Attacker.prototype.hit = function(attacker, bullet)
{
    if (bullet.canOnlyHitTarget && bullet.target.guid != attacker.guid) {
        return false;
    }

    if (!this.invulnerable) {
        attacker.health -= bullet.damageValue;
    }

    if (bullet.towerClass == 'Freezer') {
        attacker.freeze(bullet.grade);
    }

    var decorationClassName = window[bullet.towerClass].bulletHitDecorationClassName || 'Explosion';
    var decorationTint = window[bullet.towerClass].bulletHitDecorationTint || '0xFFFFFF';
    var spawnFunctionName = 'spawn' + decorationClassName;

    var midPoint = mainState.getMidPointBetweenSprites(attacker, bullet);
    mainState[spawnFunctionName](midPoint.x, midPoint.y, decorationTint, midPoint.angle);

    delete bullet.target;
    bullet.kill();

    return true;

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
    this.handleNoPath();

    if (this.health <= 0) {
        this.health = 0;
        this.die();
    }

    this.calculateProjectedHealth();

    if (isNaN(this.health)) {
        throw {
            'code': 10001,
            'description': 'Health of ' + this.constructor.name + ' is not a number.'
        };
    }


};
Attacker.prototype.handleNoPath = function()
{
    if (!this.path || this.path.length == 0) {
        this.moveToGoal();
    }
};
Attacker.prototype.moveToGoal = function()
{
    this.moveToCoordinates(mainState.level.goalXGrid, mainState.level.goalYGrid);
};

/**
 * Has the attacker reached its goal?
 *
 * @returns {boolean}
 */
Attacker.prototype.hasReachedGoal = function()
{
    if (mainState.level.goalX <= 1 && this.x > 100) {
        return false;
    }

    if (mainState.level.goalY <= 1 && this.y > 100) {
        return false;
    }

    if (mainState.nathan) {

        var distanceToGoal = game.physics.arcade.distanceBetween(this, mainState.nathan);

        var distanceNeeded = 26 + (mainState.lives-1) * 7.5;

        if (distanceToGoal <= distanceNeeded) {
            return true;
        } else {
            return false;
        }

    }

    if (this.gridX == mainState.level.goalXGrid && this.gridY == mainState.level.goalYGrid) {
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

Attacker.prototype.prepareForGameOver = function()
{
    if (this.animations) {
        this.animations.paused = true;
    }
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
        mainState.sounds.nes09.play();
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
        return false;
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

    var healthBarYOffset = 0;
    if (window[this.constructor.name].spriteHeight) {
        healthBarYOffset = -window[this.constructor.name].spriteHeight + 3;
    } else {
        healthBarYOffset = -30;
    }

    var healthBarY = this.y + healthBarYOffset;

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
    // Change speed to 40% normal value
    this.speed = this.calculateSpeed() * .4;

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
    this.speed = this.calculateSpeed();

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
Attacker.prototype.calculateSpeed = function()
{

    // Default speed is 75
    var speed = 75;
    // pace is tiles per second
    if (window[this.constructor.name].pace) {
        speed = mainState.map.tileWidth * window[this.constructor.name].pace;
    } else if (window[this.constructor.name].defaultSpeed) {
        speed = window[this.constructor.name].defaultSpeed;
    }

    return speed;

};
Attacker.prototype.calculateProjectedHealth = function()
{
    if (!mainState.level.calculateAttackerProjectedHealth) {
        this.projectedHealth = this.health;
        return;
    }

    var projectedHealth = this.health;

    var bullets = mainState.getBulletsAlive();

    for (var i = 0; i < bullets.length; i++) {
        projectedHealth -= bullets[i].damageValue;
    }

    this.projectedHealth = projectedHealth;
};
Attacker.prototype.simpleAnimate = function()
{
    if (this.body.velocity.x <= -5) {
        this.animations.play('walk');
        this.scale.x = -1;
    } else if (this.body.velocity.x >= 5) {
        this.animations.play('walk');
        this.scale.x = 1;
    }
    this.animations.play('walk');
};
Attacker.prototype.simpleSetSize = function()
{
    var bodyWidth = 25;
    var bodyHeight = 30;
    var offsetX = bodyWidth;
    var offsetY = 45 - bodyHeight;
    this.body.setSize(bodyWidth, bodyHeight, bodyWidth, offsetY);

};

// Begin Oscar
function Oscar(game, x, y) {
    Attacker.call(this, game, x, y, 'oscar');
    this.body.setSize(20, 30, 6, 1);
    this.animations.add('walkDown', [1, 2], 6, false, true);
    this.animations.add('walkRight', [3, 4], 6, false, true);
    this.animations.add('walkLeft', [5, 6], 6, false, true);
    this.animations.add('walkUp', [7, 8], 6, false, true);
}
Oscar.prototype = Object.create(Attacker.prototype);
Oscar.prototype.constructor = Oscar;
Oscar.defaultScale = 1;
Oscar.defaultHealth = 1000;
Oscar.pace = 2.15;
Oscar.coinsValue = 5;
Oscar.scoreValue = 5;
Oscar.prototype.update = function() {
    Attacker.prototype.update.call(this);

    if (!this.alive) {
        return;
    }

    if (this.body.velocity.y >= 15) {
        this.animations.play('walkDown');
    } else if (this.body.velocity.x <= -15) {
        this.animations.play('walkLeft');
    } else if (this.body.velocity.x >= 15) {
        this.animations.play('walkRight');
    } else if (this.body.velocity.y <= -15) {
        this.animations.play('walkUp');
    } else {
        this.animations.stop();
        this.frame = 0;
    }

};
// End Oscar

// Begin Roger
function Roger(game, x, y) {
    Attacker.call(this, game, x, y, 'roger');
    this.body.setSize(20, 30, 6, 1);

    this.animations.add('walkDown', [1, 2], 6, false, true);
    this.animations.add('walkRight', [3, 4], 6, false, true);
    this.animations.add('walkLeft', [5, 6], 6, false, true);
    this.animations.add('walkUp', [7, 8], 6, false, true);
}
Roger.prototype = Object.create(Attacker.prototype);
Roger.prototype.constructor = Roger;
Roger.defaultScale = 1;
Roger.defaultHealth = 1000;
Roger.pace = 2.9;
Roger.coinsValue = 5;
Roger.scoreValue = 5;
Roger.prototype.update = function() {
    Attacker.prototype.update.call(this);

    if (!this.alive) {
        return;
    }

    if (this.body.velocity.y >= 15) {
        this.animations.play('walkDown');
    } else if (this.body.velocity.x <= -15) {
        this.animations.play('walkLeft');
    } else if (this.body.velocity.x >= 15) {
        this.animations.play('walkRight');
    } else if (this.body.velocity.y <= -15) {
        this.animations.play('walkUp');
    } else {
        this.animations.stop();
        this.frame = 0;
    }

};
// End Roger

// Begin Dibley
function Dibley(game, x, y) {
    Attacker.call(this, game, x, y, 'dibley');
    this.body.setSize(20, 30, 6, 1);
}
Dibley.prototype = Object.create(Attacker.prototype);
Dibley.prototype.constructor = Dibley;
Dibley.defaultScale = 1;
Dibley.defaultHealth = 5000;
Dibley.pace = 1.5;
Dibley.coinsValue = 10;
Dibley.scoreValue = 10;
// End Dibley

// Begin Aquila
function Aquila(game, x, y) {
    Attacker.call(this, game, x, y, 'aquila');
    this.body.setSize(20, 30, 6, 1);
}
Aquila.prototype = Object.create(Attacker.prototype);
Aquila.prototype.constructor = Aquila;
Aquila.defaultScale = 1;
Aquila.defaultHealth = 2000;
Aquila.pace = 2.15;
Aquila.coinsValue = 10;
Aquila.scoreValue = 10;
// End Aquila

// Begin Mib
function Mib(game, x, y) {
    Attacker.call(this, game, x, y, 'mib');
    this.body.setSize(20, 30, 6, 1);

    this.animations.add('walkDown', [1, 2], 6, false, true);
    this.animations.add('walkRight', [3, 4], 6, false, true);
    this.animations.add('walkLeft', [5, 6], 6, false, true);
    this.animations.add('walkUp', [7, 8], 6, false, true);
}
Mib.prototype = Object.create(Attacker.prototype);
Mib.prototype.constructor = Mib;
Mib.defaultScale = 1;
Mib.defaultHealth = 4000;
Mib.pace = 2.15;
Mib.coinsValue = 15;
Mib.scoreValue = 15;
Mib.prototype.update = function() {
    Attacker.prototype.update.call(this);

    if (!this.alive) {
        return;
    }

    if (this.body.velocity.y >= 15) {
        this.animations.play('walkDown');
    } else if (this.body.velocity.x <= -15) {
        this.animations.play('walkLeft');
    } else if (this.body.velocity.x >= 15) {
        this.animations.play('walkRight');
    } else if (this.body.velocity.y <= -15) {
        this.animations.play('walkUp');
    } else {
        this.animations.stop();
        this.frame = 0;
    }

};
// End Mib