function Obstacle(game, x, y, spriteName) {
    
    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();
    this.creationTurn = mainState.turn;
    this.health = window[this.constructor.name].defaultHealth || 1000;
    this.maximumHealth = this.health;
    this.coinsValue = window[this.constructor.name].coinsValue || 1;
    this.invulnerable = false;

    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(x, y);
    this.gridX = gridCoordinates[0];
    this.gridY = gridCoordinates[1];

    Phaser.Sprite.call(this, game, x, y, spriteName);
    
    game.physics.arcade.enable(this);

    this.x = x;
    this.y = y;

    this.checkWorldBounds = true;
    this.collideWorldBounds = false;
    this.outOfBoundsKill = false;

    var scale = this.getScale();
    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }

    this.targeted = false;


}
Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.hit = function(attacker, bullet)
{
    if (!this.invulnerable) {
        attacker.health -= bullet.damageValue;
    }
    mainState.spawnExplosion(bullet.x, bullet.y);
    bullet.kill();
}
Obstacle.prototype.update = function()
{

    if (!this.alive) {
        return;
    }

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


}

Obstacle.prototype.prepareForGameOver = function()
{
    this.body.enable = false;
    this.invulnerable = true;
};

Obstacle.prototype.die = function()
{
    if (this.health <= 0) {
        mainState.changeCoins(this.coinsValue, this.x, this.y);
    }
    if (this.healthBar) {
        this.healthBar.kill();
    }
    if (this.crosshair) {
        this.crosshair.kill();
    }

    this.kill();
}

Obstacle.prototype.createHealthBar = function()
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

Obstacle.prototype.updateHealthBar = function()
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
    this.healthBar.setPosition(this.x + 17, this.y - 3);

    if (healthPercentage < 60) {
        this.healthBar.config.bar.color = '#FFFF00;'
    } else if (healthPercentage < 30) {
        this.healthBar.config.bar.color = '#FF0000;'
    }

};
Obstacle.prototype.targetToggle = function()
{
    if (this.targeted) {
        this.untarget();
    } else {
        this.target();
    }
}
Obstacle.prototype.target = function()
{
    // Un-target all other obstacles and attackers
    mainState.untargetAll();

    this.targeted = true;

    this.crosshair = game.add.sprite(this.x, this.y, 'crosshair');
    game.physics.arcade.enable(this.crosshair);

    mainState.crosshairs.add(this.crosshair);

};
Obstacle.prototype.untarget = function()
{
    this.targeted = false;

    if (this.crosshair) {
        this.crosshair.kill();
    }
};
Obstacle.prototype.updateCrosshair = function()
{
    if (!this.crosshair) {
        return false;
    }

    this.crosshair.x = this.x - 2;
    this.crosshair.y = this.y;
};


// Begin TallBrownMushroom
function TallBrownMushroom(game, x, y) {
    Obstacle.call(this, game, x, y, 'tallBrownMushroom');

    this.body.setSize(5, 5, 17, 17);

}
TallBrownMushroom.prototype = Object.create(Obstacle.prototype);
TallBrownMushroom.prototype.constructor = TallBrownMushroom;
TallBrownMushroom.defaultScale = 1;
TallBrownMushroom.defaultHealth = 10000;
TallBrownMushroom.coinsValue = 50;
// End TallBrownMushroom

// Begin TallRedMushroom
function TallRedMushroom(game, x, y) {
    Obstacle.call(this, game, x, y, 'tallRedMushroom');

    this.body.setSize(5, 5, 17, 17);

}
TallRedMushroom.prototype = Object.create(Obstacle.prototype);
TallRedMushroom.prototype.constructor = TallRedMushroom;
TallRedMushroom.defaultScale = 1;
TallRedMushroom.defaultHealth = 30000;
TallRedMushroom.coinsValue = 100;
// End TallBrownMushroom