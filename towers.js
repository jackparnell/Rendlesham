function Tower(game, x, y, spriteName) {

    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();

    this.grade = 1;
    
    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.physics.arcade.enable(this);

    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(x, y);
    this.gridX = gridCoordinates[0];
    this.gridY = gridCoordinates[1];

    console.log(this.gridX + ', ' + this.gridY);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = false;

    this.target = {};

    this.bulletDamageValue = window[this.constructor.name].defaultDamageValue;

    this.weapon1 = this.game.add.weapon(50, 'bullet');
    this.weapon1.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    this.weapon1.bulletSpeed = 150;
    this.weapon1.bulletKillDistance = 200;
    this.weapon1.fireRate = window[this.constructor.name].defaultFireRate;
    this.weapon1.angle = this.angleToTarget;

    this.anchor.setTo(0.5, 0.5);

    this.weapon1.trackSprite(this);

    var scale = this.getScale();
    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }

}
Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;
Tower.prototype.update = function()
{
    this.determineTarget();
    this.fire();

    if (this.hasTarget()) {
        this.angle = this.angleToTarget();
    }
}
Tower.prototype.fire = function()
{
    if (this.hasTarget()) {
        this.weapon1.fireAngle = this.angleToTarget() - 90;
        var bullet = this.weapon1.fire();

        if (bullet) {
            bullet.angle = this.angleToTarget();
            bullet.damageValue = this.bulletDamageValue;
            bullet.scale.setTo(0.75, 0.75);
            bullet.frame = (this.grade-1);
            mainState.bullets.add(bullet);
        }
    }
}
Tower.prototype.die = function()
{
    if (!this.alive) {
        return false;
    }
    // Weapon doesn't have a kill function
    this.weapon1.destroy();
    // Use destroy instead of kill, as otherwise weapon lingers.
    this.destroy();
}
Tower.prototype.determineTarget = function()
{
    var target = {};
    var mostAdvanced = 1;
    var mostAdvancedDistance = 999999;

    mainState.attackers.forEachAlive(function(item) {
        var distanceBetween = game.physics.arcade.distanceBetween(this, item);
        var advanced = mainState.turn - item.creationTurn;
        if (
            advanced > mostAdvanced
            &&
            distanceBetween < this.weapon1.bulletKillDistance  // Within range
        ) {
            mostAdvanced = advanced;
            mostAdvancedDistance = distanceBetween;
            target = item;
        }
    }, this);

    this.target = target;

}
Tower.prototype.hasTarget = function()
{
    return this.target.hasOwnProperty("body");
}
Tower.prototype.angleToTarget = function(otherSprite)
{
    var angleToTarget = 0;

    if (this.hasTarget()) {
        angleToTarget = this.angleToSprite(this.target) + 90;
    }

    return angleToTarget;
};
Tower.prototype.angleToSprite = function(otherSprite)
{
    var angleToSprite = Math.atan2(otherSprite.y - this.y, otherSprite.x - this.x ) * (180/Math.PI);
    return angleToSprite;
};

Tower.prototype.prepareForGameOver = function()
{
    this.weapon1.fireRate = 9999999;
};

Tower.prototype.calculateSpecs = function()
{
    this.bulletDamageValue = window[this.constructor.name].defaultDamageValue * this.grade;
    this.weapon1.fireRate = window[this.constructor.name].defaultFireRate * 1.1 - (this.grade / 8);

};
Tower.prototype.upgradable = function()
{
    if (this.grade >= window[this.constructor.name].maximumGrade) {
        return false;
    }

    return true;
};
Tower.prototype.getCost = function()
{
    return window[this.constructor.name].cost;
}

Tower.prototype.upgrade = function()
{
    if (!this.upgradable()) {
        return false;
    }

    this.grade ++;
    this.calculateSpecs();
    this.frame = (this.grade - 1);
    return true;
};


function Rock(game, x, y) {
    Tower.call(this, game, x, y, 'rock');

    this.body.setSize(14, 19, 4, 7);

}
Rock.prototype = Object.create(Tower.prototype);
Rock.prototype.constructor = Rock;
Rock.prototype.update = function() {
    Tower.prototype.update.call(this);
};
Rock.defaultScale = 1;
Rock.defaultDamageValue = 400;
Rock.defaultFireRate = 1000;
Rock.cost = 50;
Rock.maximumGrade = 3;

function Gun(game, x, y) {
    Tower.call(this, game, x, y, 'gun');

    this.body.setSize(14, 19, 4, 7);

}
Gun.prototype = Object.create(Tower.prototype);
Gun.prototype.constructor = Gun;
Gun.prototype.update = function() {
    Tower.prototype.update.call(this);
};
Gun.defaultScale = .5;
Gun.defaultDamageValue = 400;
Gun.defaultFireRate = 1000;
Gun.cost = 50;
Gun.maximumGrade = 3;