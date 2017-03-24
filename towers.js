function Tower(game, x, y, spriteName) {

    $.extend( this, standard );
    $.extend( this, shadow );

    this.guid = guid();

    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.physics.arcade.enable(this);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = false;

    this.weapon1 = this.game.add.weapon(-1, window[this.constructor.name].bulletSpriteName);
    this.weapon1.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    this.weapon1.bulletSpeed = 400;
    this.weapon1.bulletKillDistance = window[this.constructor.name].defaultKillDistance;
    this.weapon1.fireRate = window[this.constructor.name].defaultFireRate;
    this.weapon1.angle = this.angleToTarget;
    this.weapon1.setBulletBodyOffset(15, 15, 25, 25);

    // mainState.weapons.add(this.weapon1);

    this.anchor.setTo(0.5, 0.5);

    this.weapon1.trackSprite(this);

    var scale = this.getScale();
    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }

    this.initialise(x, y);

}
Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;
Tower.prototype.initialise = function(x, y)
{
    this.grade = 1;
    this.frame = this.grade - 1;

    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(x, y);
    this.gridX = gridCoordinates[0];
    this.gridY = gridCoordinates[1];

    this.target = {};

    this.bulletDamageValue = window[this.constructor.name].defaultDamageValue;

    mainState.addGlobalImpassablePoint(this.gridX, this.gridY, 'grid');

    this.body.immovable = true;
    this.body.moves = false;


};
Tower.prototype.update = function()
{
    if (!this.alive) {
        return false;
    }

    // If pendingLevelCompleted, do nothing
    if (mainState.pendingLevelCompleted) {
        return;
    }

    this.determineTarget();
    this.fire();

    if (this.hasTarget()) {
        this.angle = this.angleToTarget();
    }
};
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
            bullet.towerClass = this.constructor.name;
            bullet.grade = this.grade;
            mainState.bullets.add(bullet);
        }
    }
};
Tower.prototype.die = function()
{
    if (!this.alive) {
        return false;
    }

    // this.weapon1.destroy();

    mainState.removeGlobalImpassablePoint(this.gridX, this.gridY);

    this.kill();
};
Tower.prototype.determineTarget = function()
{
    var target = {};
    var mostAdvanced = 1;
    var mostAdvancedDistance = 999999;

    mainState.obstacles.forEachAlive(function(item) {
        var distanceBetween = game.physics.arcade.distanceBetween(this, item);
        if (item.targeted  && distanceBetween < this.weapon1.bulletKillDistance) {
            target = item;
        }
    }, this);

    // If an obstacle target already found, no need to iterate through attackers
    if (target.guid) {
        this.target = target;
        return;
    }

    mainState.attackers.forEachAlive(function(item) {

        // If not in camera, don't target
        if (!item.inCamera) {
            return;
        }

        var distanceBetween = game.physics.arcade.distanceBetween(this, item);
        var advanced = mainState.turn - item.creationTurn;
        if (
            !target.targeted // If target is targeted, we've found the target.
            &&
            distanceBetween < this.weapon1.bulletKillDistance  // Within range
            &&
            (advanced > mostAdvanced || item.targeted)
        ) {
            mostAdvanced = advanced;
            mostAdvancedDistance = distanceBetween;
            target = item;
        }

    }, this);

    this.target = target;

};
Tower.prototype.hasTarget = function()
{
    return this.target.hasOwnProperty("body");
};
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
    this.weapon1.bulletKillDistance = this.calculateBulletKillDistance(this.grade);

};
Tower.prototype.calculateBulletKillDistance = function(grade)
{
    return window[this.constructor.name].defaultKillDistance * (1 + ((grade - 1) * .3));
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
};
Tower.prototype.getSellValue = function()
{
    return Math.round((window[this.constructor.name].cost * this.grade) * (2/3));
};
Tower.prototype.sell = function()
{
    mainState.changeCoins(this.getSellValue(), this.x, this.y);
    this.die();
};

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
Tower.prototype.reuse = function(x, y)
{

    this.reset(x, y);
    this.initialise(x, y);

};

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
Gun.defaultDamageValue = 500;
Gun.defaultFireRate = 1000;
Gun.defaultKillDistance = 100;
Gun.cost = 50;
Gun.maximumGrade = 3;
Gun.spriteName = 'gun';
Gun.bulletSpriteName = 'bullet';

function Freezer(game, x, y) {
    Tower.call(this, game, x, y, 'freezer');

    this.body.setSize(14, 19, 4, 7);

}
Freezer.prototype = Object.create(Tower.prototype);
Freezer.prototype.constructor = Freezer;
Freezer.prototype.update = function() {
    Tower.prototype.update.call(this);
};
Freezer.defaultScale = .5;
Freezer.defaultDamageValue = 200;
Freezer.defaultFireRate = 1500;
Freezer.defaultKillDistance = 100;
Freezer.cost = 100;
Freezer.maximumGrade = 3;
Freezer.spriteName = 'freezer';
Freezer.bulletSpriteName = 'iceLance';
