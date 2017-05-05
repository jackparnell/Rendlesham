function Tower(game, x, y, spriteName) {

    $.extend( this, standard );

    this.guid = guid();

    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.physics.arcade.enable(this);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = false;

    var bulletKillDistance = this.calculateBulletKillDistance(1);

    this.weapon1 = this.game.add.weapon(3, window[this.constructor.name].bulletSpriteName, 0, this.game.bullets);
    this.weapon1.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    this.weapon1.bulletSpeed = this.calculateBulletSpeed();
    this.weapon1.bulletKillDistance = bulletKillDistance;
    this.weapon1.fireRate = window[this.constructor.name].defaultFireRate;
    this.weapon1.angle = this.angleToTarget();

    this.anchor.setTo(0.5, 0.5);

    this.initialise(x, y);

}
Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;
Tower.prototype.initialise = function(x, y)
{
    this.grade = 1;
    this.calculateSpecs();

    this.frame = this.grade - 1;

    if (this.width != mainState.map.tileWidth) {
        this.scaleToTile();
    }

    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(x, y);
    this.gridX = gridCoordinates[0];
    this.gridY = gridCoordinates[1];

    this.target = {};

    this.bulletDamageValue = window[this.constructor.name].defaultDamageValue;

    if (mainState.level.canPlaceTowerOnPathway) {
        mainState.addGlobalImpassablePoint(this.gridX, this.gridY, 'grid');
    }

    this.body.immovable = true;
    this.body.moves = false;

    this.weapon1.trackSprite(this);

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

    if (this.game.time.now >= this.weapon1._nextFire) {
        this.determineTarget();
    }
    this.fire();

    if (this.hasTarget()) {
        this.angle = this.angleToTarget();
    }
};
Tower.prototype.fire = function()
{
    if (this.hasTarget()) {

        this.weapon1.fireAngle = this.angleToTarget() - 90;

        var angleRadians = Number(this.angleToTarget() * (Math.PI / 180) );
        var offsetDistance = 15;
        var offsetX = Math.round(offsetDistance * Math.sin(angleRadians));
        var offsetY = -Math.round(offsetDistance * Math.cos(angleRadians));
        this.weapon1.trackSprite(this, offsetX, offsetY, false);

        var bullet = this.weapon1.fire();

        if (bullet) {

            mainState.sounds.footstep02.play();

            bullet.angle = this.angleToTarget();
            bullet.damageValue = this.bulletDamageValue;
            bullet.scale.setTo(0.75, 0.75);
            bullet.frame = (this.grade-1);
            bullet.towerClass = this.constructor.name;
            bullet.grade = this.grade;
            bullet.enableBody = true;
            bullet.target = this.target;
            bullet.speed = this.weapon1.bulletSpeed;

            if (mainState.level.bulletsCanOnlyHitTarget) {
                bullet.canOnlyHitTarget = true;
            }

            if (!bullet.guid) {
                bullet.guid = guid();
            }

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

    if (this.game.target.guid) {
        var distanceBetween = game.physics.arcade.distanceBetween(this, this.game.target);
        if (distanceBetween < this.weapon1.bulletKillDistance) {
            target = this.game.target;
        }
    }

    // If target obtained from this.game.target, no need to iterate through attackers
    if (target.guid) {
        this.setTarget(target);
        return;
    }

    mainState.attackers.forEachAlive(function(item) {

        // If not in camera, don't target
        if (!item.inCamera) {
            return;
        }

        var distanceBetween = game.physics.arcade.distanceBetween(this, item);

        if (distanceBetween < this.weapon1.bulletKillDistance) {

            var advanced = item.getAdvancement() + (item.getAgeInTurns() * 0.01);

            if (
                !target.targeted // If target is targeted, we've found the target.
                &&
                (advanced > mostAdvanced || item.targeted)
                &&
                item.projectedHealth > 0
            ) {
                mostAdvanced = advanced;
                target = item;
            }

        }


    }, this);

    this.setTarget(target);

};
Tower.prototype.setTarget = function(target)
{
    if (this.target.guid && this.target.guid == target.guid) {
        return;
    }

    this.target = target;
};
Tower.prototype.hasTarget = function()
{
    if (this.target && this.target.hasOwnProperty("body")) {
        return true;
    } else {
        return false;
    }
};
Tower.prototype.angleToTarget = function()
{
    var angleToTarget = 0;

    if (this.hasTarget()) {
        angleToTarget = this.angleToSprite(this.target) + 90;
    }

    return angleToTarget;
};
Tower.prototype.angleToSprite = function(otherSprite)
{
    return Math.atan2(otherSprite.y - this.y, otherSprite.x - this.x ) * (180/Math.PI);
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
    // Default kill distance is 100
    var bulletKillDistance = 100;
    if (window[this.constructor.name].range) {
        // Range is kill distance in tiles
        bulletKillDistance = window[this.constructor.name].range * mainState.map.tileWidth;
    } else if (window[this.constructor.name].range) {
        bulletKillDistance = window[this.constructor.name].defaultKillDistance;
    }

    bulletKillDistance *= (1 + ((grade - 1) * .3));

    return bulletKillDistance;
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
    return Math.round((window[this.constructor.name].cost * this.grade) * .6);
};
Tower.prototype.sell = function()
{
    mainState.changeCoins(this.getSellValue(), this.x, this.y);
    this.die();
};
Tower.prototype.sellable = function()
{
    return true;
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
Tower.prototype.upgradeAtCost = function()
{
    this.upgrade();
    var cost = this.getUpgradeCost();
    mainState.changeCoins(-cost, this.x, this.y);
};
Tower.prototype.getUpgradeCost = function()
{
    return this.getCost();
};
Tower.prototype.reuse = function(x, y)
{

    this.reset(x, y);
    this.initialise(x, y);

};
Tower.prototype.scaleToTile = function()
{
    var scale = 1 / (this.width / mainState.map.tileWidth);
    this.scale.setTo(scale, scale);
};
Tower.prototype.calculateBulletSpeed = function()
{
    // Default speed is 400
    var bulletSpeed = 400;
    // pace is tiles per second
    if (window[this.constructor.name].bulletPace) {
        bulletSpeed = mainState.map.tileWidth * window[this.constructor.name].bulletPace;
    } else if (window[this.constructor.name].defaultBulletSpeed) {
        bulletSpeed = window[this.constructor.name].defaultBulletSpeed;
    }

    return bulletSpeed;
};


function Gun(game, x, y) {
    Tower.call(this, game, x, y, Gun.spriteName);
    this.body.setSize(14, 19, 4, 7);
    this.weapon1.setBulletBodyOffset(15, 15, 25, 25);
}
Gun.prototype = Object.create(Tower.prototype);
Gun.prototype.constructor = Gun;
Gun.prototype.update = function() {
    Tower.prototype.update.call(this);
};
Gun.defaultScale = .5;
Gun.defaultDamageValue = 500;
Gun.defaultFireRate = 1000;
Gun.range = 2.8;
Gun.cost = 50;
Gun.maximumGrade = 3;
Gun.spriteName = 'gun';
Gun.bulletSpriteName = 'bullet';
Gun.bulletPace = 12;
Gun.bulletHitDecorationClassName = 'Explosion';

function Freezer(game, x, y) {
    Tower.call(this, game, x, y, Freezer.spriteName);
    this.body.setSize(14, 19, 4, 7);
    this.weapon1.setBulletBodyOffset(12, 12, 8, 8);
}
Freezer.prototype = Object.create(Tower.prototype);
Freezer.prototype.constructor = Freezer;
Freezer.prototype.update = function() {
    Tower.prototype.update.call(this);
};
Freezer.defaultScale = .5;
Freezer.defaultDamageValue = 200;
Freezer.defaultFireRate = 1500;
Freezer.range = 2.8;
Freezer.cost = 100;
Freezer.maximumGrade = 3;
Freezer.spriteName = 'freezer';
Freezer.bulletSpriteName = 'iceLance';
Freezer.bulletPace = 12;
Freezer.bulletHitDecorationClassName = 'Zap';
Freezer.bulletHitDecorationTint = 0x0000FF;

function Laser(game, x, y) {
    Tower.call(this, game, x, y, Laser.spriteName);
    this.body.setSize(14, 19, 4, 7);
    this.weapon1.setBulletBodyOffset(12, 12, 8, 8);
}
Laser.prototype = Object.create(Tower.prototype);
Laser.prototype.constructor = Laser;
Laser.prototype.update = function() {
    Tower.prototype.update.call(this);
};
Laser.defaultScale = .5;
Laser.defaultDamageValue = 175;
Laser.defaultFireRate = 500;
Laser.range = 4.2;
Laser.cost = 100;
Laser.maximumGrade = 3;
Laser.spriteName = 'laser';
Laser.bulletSpriteName = 'redLaser';
Laser.bulletPace = 23;
Laser.bulletHitDecorationClassName = 'Zap';
Laser.bulletHitDecorationTint = 0xFF0000;
