function Attacker(game, x, y, spriteName) {
    
    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();
    this.creationTurn = mainState.turn;
    this.health = window[this.constructor.name].defaultHealth || 1000;
    this.coinsValue = window[this.constructor.name].coinsValue || 1;
    this.invulnerable = false;

    this.walking_speed = 75;
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

    this.moveToGoal();


}
Attacker.prototype = Object.create(Phaser.Sprite.prototype);
Attacker.prototype.constructor = Attacker;

Attacker.prototype.hit = function(attacker, bullet)
{
    if (!this.invulnerable) {
        attacker.health -= bullet.damageValue;
    }
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
Attacker.prototype.moveToGoal = function()
{
    var target_position = new Phaser.Point(this.game.goalX, this.game.goalY);
    this.move_to(target_position);

}
Attacker.prototype.hasReachedGoal = function()
{
    if (this.x < game.width * .025) {

        return true;
    }

    return false;
}
Attacker.prototype.reachedGoal = function()
{
    this.invulnerable = true;

    // Fade out over 300 ms
    game.add.tween(this).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 1000, true);

    // Die in 300 ms
    timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * .3, this.die, this));

}
Attacker.prototype.followPath = function()
{
    mainState.game.physics.arcade.collide(this, mainState.layers.collision);

    if (this.path.length > 0) {
        this.next_position = this.path[this.path_step];

        if (!this.reached_target_position(this.next_position)) {
            this.velocity = new Phaser.Point(this.next_position.x - this.position.x,
                this.next_position.y - this.position.y);
            this.velocity.normalize();
            this.body.velocity.x = this.velocity.x * this.walking_speed;
            this.body.velocity.y = this.velocity.y * this.walking_speed;
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

}

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
    this.kill();
}

Attacker.prototype.moveUp = function() {
    this.changeVelocity('y', -5);
}
Attacker.prototype.moveDown = function() {
    this.changeVelocity('y', 5);
}
Attacker.prototype.moveLeft = function() {
    this.changeVelocity('x', -5);
}
Attacker.prototype.moveRight = function() {
    this.changeVelocity('x', 5);
}
Attacker.prototype.slowVertical =  function () {
    this.body.velocity.y *= .9;
}
Attacker.prototype.slowHorizontal =  function () {
    this.body.velocity.x *= .9;
}


// Begin Oscar
function Oscar(game, x, y) {
    Attacker.call(this, game, x, y, 'oscar');
    this.body.setSize(12, 12, 8, 8);
}
Oscar.prototype = Object.create(Attacker.prototype);
Oscar.prototype.constructor = Oscar;
Oscar.defaultScale = 1;
Oscar.defaultHealth = 1000;
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
Aquila.coinsValue = 10;
// End Aquila