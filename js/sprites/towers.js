class Tower extends GameSprite
{
    constructor(game, x, y, spriteName)
    {
        super(game, x, y, spriteName);

        this.moveable = false;

        this.guid = guid();

        game.physics.arcade.enable(this);

        this.checkWorldBounds = true;
        this.outOfBoundsKill = false;

        let rangeInPixels = this.calculateRangeInPixels(1);
        let bulletKillDistance = this.calculateBulletKillDistance(1);

        this.weapon1 = this.game.add.weapon(3, window[this.constructor.name].bulletSpriteName, 0, this.game.bullets);
        this.weapon1.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        this.weapon1.bulletSpeed = this.calculateBulletSpeed();
        this.weapon1.bulletKillDistance = bulletKillDistance;
        this.weapon1.fireRate = window[this.constructor.name].defaultFireRate;
        this.weapon1.angle = this.angleToTarget();
        this.weapon1.rangeInPixels = rangeInPixels;

        this.anchor.setTo(0.5, 0.5);

        this.initialise(x, y);
    }

    initialise(x, y)
    {
        this.grade = 1;
        this.calculateSpecs();

        this.frame = this.grade - 1;

        if (this.width !== mainState.map.tileWidth)
        {
            this.scaleToTile();
        }

        let gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(x, y);
        this.gridX = gridCoordinates[0];
        this.gridY = gridCoordinates[1];

        this.target = {};

        this.bulletDamageValue = window[this.constructor.name].defaultDamageValue;

        if (mainState.level.canPlaceTowerOnPathway)
        {
            mainState.addGlobalImpassablePoint(this.gridX, this.gridY, 'grid');
        }

        this.body.immovable = true;
        this.body.moves = false;

        this.weapon1.trackSprite(this);
    }

    update()
    {
        if (!this.alive)
        {
            return false;
        }

        // If pendingLevelCompleted, do nothing
        if (mainState.pendingLevelCompleted)
        {
            return;
        }

        if (this.game.time.now >= this.weapon1._nextFire)
        {
            this.determineTarget();
        }
        this.fire();

        if (this.hasTarget())
        {
            this.angle = this.angleToTarget();
        }
    }

    fire()
    {
        if (!this.hasTarget())
        {
            return
        }

        this.weapon1.fireAngle = this.angleToTarget() - 90;

        let angleRadians = Number(this.angleToTarget() * (Math.PI / 180) );
        let offsetDistance = 15;
        let offsetX = Math.round(offsetDistance * Math.sin(angleRadians));
        let offsetY = -Math.round(offsetDistance * Math.cos(angleRadians));
        this.weapon1.trackSprite(this, offsetX, offsetY, false);

        let bullet = this.weapon1.fire();

        if (bullet)
        {
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

            if (mainState.level.bulletsCanOnlyHitTarget)
            {
                bullet.canOnlyHitTarget = true;
            }

            if (!bullet.guid)
            {
                bullet.guid = guid();
            }
        }

        if (typeof this.target.calculateProjectedHealth === 'function')
        {
            this.target.calculateProjectedHealth();
        }
    }

    die()
    {
        if (!this.alive)
        {
            return false;
        }

        // this.weapon1.destroy();

        mainState.removeGlobalImpassablePoint(this.gridX, this.gridY);

        this.kill();
    }

    determineTarget()
    {
        let target = {};
        let mostAdvanced = 1;

        if (this.game.target.guid)
        {
            let distanceBetween = game.physics.arcade.distanceBetween(this, this.game.target);
            if (distanceBetween < this.weapon1.rangeInPixels)
            {
                target = this.game.target;
            }
        }

        // If target obtained from this.game.target, no need to iterate through attackers
        if (target.guid)
        {
            this.setTarget(target);
            return;
        }

        mainState.attackers.forEachAlive(function(item)
        {
            // If not in camera, don't target
            if (!item.inCamera)
            {
                return;
            }

            let distanceBetween = game.physics.arcade.distanceBetween(this, item);

            if (distanceBetween < this.weapon1.rangeInPixels)
            {
                let advanced = item.getAdvancement() + (item.getAgeInTurns() * 0.01);
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
    }

    setTarget(target)
    {
        if (this.target.guid && this.target.guid === target.guid)
        {
            return;
        }
        this.target = target;
    }

    hasTarget()
    {
        return (this.target && this.target.hasOwnProperty("body"));
    }

    angleToTarget()
    {
        let angleToTarget = 0;
        if (this.hasTarget())
        {
            angleToTarget = this.angleToSprite(this.target) + 90;
        }
        return angleToTarget;
    }

    angleToSprite(otherSprite)
    {
        return Math.atan2(otherSprite.body.y - this.body.y, otherSprite.body.x - this.body.x ) * (180/Math.PI);
    }

    prepareForGameOver()
    {
        this.weapon1.fireRate = 9999999;
    }

    calculateSpecs()
    {
        this.bulletDamageValue = window[this.constructor.name].defaultDamageValue * this.grade;
        this.weapon1.fireRate = window[this.constructor.name].defaultFireRate * 1.1 - (this.grade / 8);
        if (this.game.time.slowMotion !== 1)
        {
            this.weapon1.fireRate *= this.game.time.slowMotion;
        }
        this.weapon1.rangeInPixels = this.calculateRangeInPixels(this.grade);
        this.weapon1.bulletKillDistance = this.calculateBulletKillDistance(this.grade);
    }

    calculateRangeInPixels(grade)
    {
        let rangeInPixels = window[this.constructor.name].range * mainState.map.tileWidth;
        rangeInPixels *= (1 + ((grade - 1) * .3));
        this.rangeInPixels = rangeInPixels;
        return rangeInPixels;
    }

    calculateBulletKillDistance(grade)
    {
        let bulletKillDistance = this.calculateRangeInPixels(grade);
        if (mainState.level.bulletsCanOnlyHitTarget)
        {
            bulletKillDistance *= 1.6;
        }
        return bulletKillDistance;
    }

    upgradable()
    {
        return !(this.grade >= window[this.constructor.name].maximumGrade);
    }

    getCost()
    {
        return window[this.constructor.name].cost;
    }

    getSellValue()
    {
        return Math.round((window[this.constructor.name].cost * this.grade) * .6);
    }

    sell()
    {
        mainState.changeCoins(this.getSellValue(), this.x, this.y);
        this.die();
    }

    sellable()
    {
        return true;
    }

    upgrade()
    {
        if (!this.upgradable())
        {
            return false;
        }

        this.grade ++;
        this.calculateSpecs();
        this.frame = (this.grade - 1);

        return true;
    }

    upgradeAtCost()
    {
        this.upgrade();
        let cost = this.getUpgradeCost();
        mainState.changeCoins(-cost, this.x, this.y);
    }

    getUpgradeCost()
    {
        return this.getCost();
    }

    reuse(x, y)
    {
        this.reset(x, y);
        this.initialise(x, y);
    }

    scaleToTile()
    {
        let scale = 1 / (this.width / mainState.map.tileWidth);
        this.scale.setTo(scale, scale);
    }

    calculateBulletSpeed()
    {
        // Default speed is 400
        let bulletSpeed = 400;
        // pace is tiles per second
        if (window[this.constructor.name].bulletPace)
        {
            bulletSpeed = mainState.map.tileWidth * window[this.constructor.name].bulletPace;
        }
        else if (window[this.constructor.name].defaultBulletSpeed)
        {
            bulletSpeed = window[this.constructor.name].defaultBulletSpeed;
        }

        return bulletSpeed;
    }
}

window.Gun = class Gun extends Tower
{
    static get DEFAULT_SCALE() { return .5; }

    constructor(game, x, y)
    {
        super(game, x, y, Gun.spriteName);
        this.body.setSize(14, 19, 4, 7);
        this.weapon1.setBulletBodyOffset(15, 15, 25, 25);
    }
};
Gun.defaultScale = .5;
Gun.defaultDamageValue = 500;
Gun.defaultFireRate = 1000;
Gun.range = 2.7;
Gun.cost = 50;
Gun.maximumGrade = 3;
Gun.spriteName = 'gun';
Gun.bulletSpriteName = 'bullet';
Gun.bulletPace = 14;
Gun.bulletHitDecorationClassName = 'Explosion';


window.Freezer = class Freezer extends Tower
{
    static get DEFAULT_SCALE() { return .5; }

    constructor(game, x, y)
    {
        super(game, x, y, Freezer.spriteName);
        this.body.setSize(14, 19, 4, 7);
        this.weapon1.setBulletBodyOffset(12, 12, 8, 8);
    }
};
Freezer.defaultScale = .5;
Freezer.defaultDamageValue = 200;
Freezer.defaultFireRate = 1500;
Freezer.range = 2.7;
Freezer.cost = 100;
Freezer.maximumGrade = 3;
Freezer.spriteName = 'freezer';
Freezer.bulletSpriteName = 'iceLance';
Freezer.bulletPace = 14;
Freezer.bulletHitDecorationClassName = 'Zap';
Freezer.bulletHitDecorationTint = 0x0000FF;

window.Laser = class Laser extends Tower
{
    static get DEFAULT_SCALE() { return .5; }

    constructor(game, x, y)
    {
        super(game, x, y, Laser.spriteName);
        this.body.setSize(14, 19, 4, 7);
        this.weapon1.setBulletBodyOffset(12, 12, 8, 8);
    }
};
Laser.defaultScale = .5;
Laser.defaultDamageValue = 200;
Laser.defaultFireRate = 500;
Laser.range = 3.7;
Laser.cost = 150;
Laser.maximumGrade = 3;
Laser.spriteName = 'laser';
Laser.bulletSpriteName = 'redLaser';
Laser.bulletPace = 23;
Laser.bulletHitDecorationClassName = 'Zap';
Laser.bulletHitDecorationTint = 0xFF0000;
