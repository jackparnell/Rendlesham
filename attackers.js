function Attacker(game, x, y, spriteName, waveNumber) {
    
    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();
    this.creationTurn = mainState.turn;
    this.waveNumber = waveNumber;
    this.health = (window[this.constructor.name].defaultHealth || 1000) * this.calculateHealthModifier();
    this.maximumHealth = this.health;
    this.coinsValue = window[this.constructor.name].coinsValue || 1;
    this.invulnerable = false;

    this.speed = (window[this.constructor.name].defaultSpeed || 75);
    this.path = [];
    this.path_step = -1;

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

    this.targeted = false;

    this.moveToGoal();


}
Attacker.prototype = Object.create(Phaser.Sprite.prototype);
Attacker.prototype.constructor = Attacker;

Attacker.prototype.hit = function(attacker, bullet)
{
    if (!this.invulnerable) {
        attacker.health -= bullet.damageValue;
    }
    mainState.spawnExplosion(bullet.x, bullet.y);
    bullet.kill();
}
Attacker.prototype.update = function()
{

    if (!this.alive) {
        return;
    }

    if (this.hasReachedGoal()) {
        this.reachedGoal();
    }

    this.followPath();

    // game.physics.arcade.collide(this, mainState.collisionLayer);

    mainState.bullets.forEachAlive(function(bullet) {
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
    var target_position = new Phaser.Point(this.game.goalX, this.game.goalY);
    this.move_to(target_position);

};
Attacker.prototype.hasReachedGoal = function()
{
    if (this.x < game.width * .025) {

        return true;
    }

    return false;
};
Attacker.prototype.reachedGoal = function()
{
    this.invulnerable = true;

    // Fade out over 300 ms
    game.add.tween(this).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 1000, true);

    // Die in 300 ms
    timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * .3, this.die, this));

};
Attacker.prototype.followPath = function()
{
    mainState.game.physics.arcade.collide(this, mainState.layers.collision);

    if (this.path.length > 0) {
        this.next_position = this.path[this.path_step];

        if (!this.reached_target_position(this.next_position)) {
            this.velocity = new Phaser.Point(this.next_position.x - this.position.x,
                this.next_position.y - this.position.y);
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

};

Attacker.prototype.reached_target_position = function (target_position) {
    "use strict";
    var distance;
    distance = Phaser.Point.distance(this.position, target_position);
    return distance < 1;
};

Attacker.prototype.move_to = function (target_position) {
    "use strict";
    mainState.pathfinding.find_path(this.position, target_position, this.move_through_path, this);
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
    } else if (mainState.lives >= 1) {
        mainState.changeLives(-1, this.x, this.y);
    }
    if (this.healthBar) {
        this.healthBar.kill();
    }
    if (this.crosshair) {
        this.crosshair.kill();
    }

    this.kill();
};
Attacker.prototype.createHealthBar = function()
{
    var barColor;

    var barConfig = {
        width: 20,
        height: 5,
        animationDuration: 100,
        bg: {
            color: '#333333'
        },
        bar: {
            color: '#00FF00'
        },
    };
    this.healthBar = new HealthBar(game, barConfig);
};
Attacker.prototype.updateHealthBar = function()
{

    var healthPercentage = Math.round((this.health / this.maximumHealth) * 100);

    // No health bar if at full health
    if (healthPercentage >= 100) {
        return;
    }

    if (!this.healthBar) {
        this.createHealthBar();
    }

    this.healthBar.setPercent(healthPercentage);
    this.healthBar.setPosition(this.x, this.y - 30);

    if (healthPercentage < 60) {
        this.healthBar.config.bar.color = '#FFFF00;'
    } else if (healthPercentage < 30) {
        this.healthBar.config.bar.color = '#FF0000;'
    }

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

    this.targeted = true;

    this.crosshair = game.add.sprite(this.x, this.y, 'crosshair');
    game.physics.arcade.enable(this.crosshair);

    this.crosshair.anchor.setTo(0.5, 0.75);


    this.crosshair.trackSprite(this);

    mainState.crosshairs.add(this.crosshair);

};
Attacker.prototype.untarget = function()
{
    this.targeted = false;

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
    return .8 + (mainState.waveNumber / 5);
};


// Begin Oscar
function Oscar(game, x, y) {
    Attacker.call(this, game, x, y, 'oscar');
    this.body.setSize(12, 12, 8, 8);
}
Oscar.prototype = Object.create(Attacker.prototype);
Oscar.prototype.constructor = Oscar;
Oscar.defaultScale = 1;
Oscar.defaultHealth = 1000;
Oscar.defaultSpeed = 75;
Oscar.coinsValue = 5;
// End Oscar

// Begin Aquila
function Aquila(game, x, y) {
    Attacker.call(this, game, x, y, 'aquila');
    this.body.setSize(12, 12, 8, 8);
}
Aquila.prototype = Object.create(Attacker.prototype);
Aquila.prototype.constructor = Aquila;
Aquila.defaultScale = 1;
Aquila.defaultHealth = 2500;
Aquila.defaultSpeed = 75;
Aquila.coinsValue = 10;
// End Aquila

// Begin Mib
function Mib(game, x, y) {
    Attacker.call(this, game, x, y, 'mib');
    this.body.setSize(12, 12, 8, 8);
}
Mib.prototype = Object.create(Attacker.prototype);
Mib.prototype.constructor = Mib;
Mib.defaultScale = 1;
Mib.defaultHealth = 5000;
Mib.defaultSpeed = 75;
Mib.coinsValue = 15;
// End Mib