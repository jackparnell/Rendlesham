function Obstacle(game, x, y, spriteName) {
    
    $.extend( this, standard );

    this.guid = guid();
    this.creationTurn = mainState.turn;
    this.health = window[this.constructor.name].defaultHealth || 1000;
    this.maximumHealth = this.health;
    this.coinsValue = window[this.constructor.name].coinsValue || 0;
    this.scoreValue = window[this.constructor.name].scoreValue || 0;
    this.invulnerable = false;

    Phaser.Sprite.call(this, game, x, y, spriteName);

    game.physics.arcade.enable(this);

    this.roundedCoordinates = mainState.pixelsNearestTileTopLeftCoordinates(x, y);
    x = this.roundedCoordinates[0];
    y = this.roundedCoordinates[1];

    this.x = x + (mainState.squareWidth/2);
    this.y = y + (mainState.squareWidth/2);

    this.anchor.setTo(0.5, 0.5);

    this.checkWorldBounds = true;
    this.collideWorldBounds = false;
    this.outOfBoundsKill = false;

    var scale = this.getScale();
    if (scale != 1) {
        this.scale.setTo(scale, scale);
    }

    this.targeted = false;

    this.initialise();


}
Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.initialise = function()
{
    this.body.immovable = true;
    this.body.moves = false;
};

Obstacle.prototype.firstUpdate = function()
{
    this.generateGridCoordinates();
    mainState.addGlobalImpassablePoint(this.gridX, this.gridY, 'grid');

    this.firstUpdateRun = true;
};

Obstacle.prototype.hit = function(attacker, bullet)
{
    if (!this.invulnerable) {
        attacker.health -= bullet.damageValue;
    }

    var decorationClassName = window[bullet.towerClass].bulletHitDecorationClassName || 'Explosion';
    var decorationTint = window[bullet.towerClass].bulletHitDecorationTint || '0xFFFFFF';
    var spawnFunctionName = 'spawn' + decorationClassName;
    var midPoint = mainState.getMidPointBetweenSprites(attacker, bullet);
    mainState[spawnFunctionName](midPoint.x, midPoint.y, decorationTint, midPoint.angle);

    delete bullet.target;
    bullet.kill();
};
Obstacle.prototype.generateGridCoordinates = function()
{
    var gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(this.x, this.y);
    this.gridX = gridCoordinates[0];
    this.gridY = gridCoordinates[1];
    
};
Obstacle.prototype.update = function()
{

    if (!this.alive) {
        return;
    }

    if (!this.firstUpdateRun) {
        this.firstUpdate();
    }

    if (!this.gridX || !this.gridY) {
        this.generateGridCoordinates();
    }

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
        mainState.changeScore(this.scoreValue, this.x, this.y);
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

    mainState.removeGlobalImpassablePoint(this.gridX, this.gridY, 'grid');


    this.kill();
}

/**
 * Create a health bar for the sprite, if appropriate.
 *
 * @returns {boolean}
 */
Obstacle.prototype.createHealthBar = function()
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
    var healthBarY = this.y - 20;

    this.healthBar = this.game.add.sprite(healthBarX, healthBarY, 'healthBar');
    this.game.healthBars.add(this.healthBar);

    this.healthBar.anchor.setTo(0.5, 0.5);

    return true;

};

/**
 * Update's the sprite's health bar, if appropriate.
 *
 * @returns {boolean}
 */
Obstacle.prototype.updateHealthBar = function()
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

    if (healthBarFrame != this.healthBar.frame) {
        this.healthBar.frame = healthBarFrame;
    }

    var healthBarX = this.x;
    var healthBarY = this.y - 18;

    this.healthBar.x = healthBarX;
    this.healthBar.y = healthBarY;

    return true;

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
    mainState.setTarget(this);

    this.targeted = true;

    this.crosshair = game.add.sprite(this.x, this.y, 'crosshair');
    game.physics.arcade.enable(this.crosshair);

    mainState.crosshairs.add(this.crosshair);

};
Obstacle.prototype.untarget = function()
{
    this.targeted = false;

    if (this.game.target.guid && this.guid == this.game.target.guid) {
        mainState.noTarget();
    }

    if (this.crosshair) {
        this.crosshair.kill();
    }
};
Obstacle.prototype.updateCrosshair = function()
{
    if (!this.crosshair) {
        return false;
    }

    this.crosshair.x = this.x - (mainState.squareWidth/2) - 2 ;
    this.crosshair.y = this.y - (mainState.squareWidth/2) - 2;
};

// Begin TallBrownMushroom
function TallBrownMushroom(game, x, y) {
    Obstacle.call(this, game, x, y, 'tallBrownMushroom');
    this.createCentralCircle(16);

}
TallBrownMushroom.prototype = Object.create(Obstacle.prototype);
TallBrownMushroom.prototype.constructor = TallBrownMushroom;
TallBrownMushroom.defaultScale = 1;
TallBrownMushroom.defaultHealth = 10000;
TallBrownMushroom.coinsValue = 50;
TallBrownMushroom.scoreValue = 50;
TallBrownMushroom.spriteSheetGid = 105;
// End TallBrownMushroom

// Begin TallRedMushroom
function TallRedMushroom(game, x, y) {
    Obstacle.call(this, game, x, y, 'tallRedMushroom');
    this.createCentralCircle(16);
}
TallRedMushroom.prototype = Object.create(Obstacle.prototype);
TallRedMushroom.prototype.constructor = TallRedMushroom;
TallRedMushroom.defaultScale = 1;
TallRedMushroom.defaultHealth = 35000;
TallRedMushroom.coinsValue = 100;
TallRedMushroom.scoreValue = 100;
TallRedMushroom.spriteSheetGid = 106;
// End TallBrownMushroom

// Begin TallGreyMushroom
function TallGreyMushroom(game, x, y) {
    Obstacle.call(this, game, x, y, 'tallGreyMushroom');
    this.createCentralCircle(16);
}
TallGreyMushroom.prototype = Object.create(Obstacle.prototype);
TallGreyMushroom.prototype.constructor = TallGreyMushroom;
TallGreyMushroom.defaultScale = 1;
TallGreyMushroom.defaultHealth = 50000;
TallGreyMushroom.coinsValue = 100;
TallGreyMushroom.scoreValue = 150;
TallGreyMushroom.spriteSheetGid = 107;
TallGreyMushroom.prototype.die = function() {
    Obstacle.prototype.die.call(this);
    
    if (!mainState.hasItem('greyMushroomSpore')) {
        mainState.addItem('greyMushroomSpore');
    }

};
// End TallGreyMushroom

// Begin BigBush
function BigBush(game, x, y) {
    Obstacle.call(this, game, x, y, 'bigBush');
    this.createCentralCircle(16);

}
BigBush.prototype = Object.create(Obstacle.prototype);
BigBush.prototype.constructor = BigBush;
BigBush.defaultScale = 1;
BigBush.defaultHealth = 10000;
BigBush.coinsValue = 0;
BigBush.scoreValue = 20;
BigBush.spriteSheetGid = 63;
// End BigBush

// Begin BigBushAutumn
function BigBushAutumn(game, x, y) {
    Obstacle.call(this, game, x, y, 'bigBushAutumn');
    this.createCentralCircle(16);

}
BigBushAutumn.prototype = Object.create(Obstacle.prototype);
BigBushAutumn.prototype.constructor = BigBushAutumn;
BigBushAutumn.defaultScale = 1;
BigBushAutumn.defaultHealth = 10000;
BigBushAutumn.coinsValue = 0;
BigBushAutumn.scoreValue = 20;
BigBushAutumn.spriteSheetGid = 5;
// End BigBushAutumn

// Begin SmallBush
function SmallBush(game, x, y) {
    Obstacle.call(this, game, x, y, 'smallBush');
    this.createCentralCircle(10);
}
SmallBush.prototype = Object.create(Obstacle.prototype);
SmallBush.prototype.constructor = SmallBush;
SmallBush.defaultScale = 1;
SmallBush.defaultHealth = 5000;
SmallBush.coinsValue = 0;
SmallBush.scoreValue = 10;
SmallBush.spriteSheetGid = 64;
// End SmallBush

// Begin SnowyPine
function SnowyPine(game, x, y) {
    Obstacle.call(this, game, x, y, 'smallBush');
    this.createCentralCircle(16);
}
SnowyPine.prototype = Object.create(Obstacle.prototype);
SnowyPine.prototype.constructor = SnowyPine;
SnowyPine.defaultScale = 1;
SnowyPine.defaultHealth = 5000;
SnowyPine.coinsValue = 0;
SnowyPine.scoreValue = 20;
SnowyPine.spriteSheetGid = 94;
// End SnowyPine

// Begin Rock
function Rock(game, x, y) {
    Obstacle.call(this, game, x, y, 'rock');
    // this.createCentralCircle(18);
}
Rock.prototype = Object.create(Obstacle.prototype);
Rock.prototype.constructor = Rock;
Rock.defaultScale = 1;
Rock.defaultHealth = 15000;
Rock.coinsValue = 0;
Rock.scoreValue = 50;
Rock.spriteSheetGid = 51;
// End Rock

// Begin Crate
function Crate(game, x, y) {
    Obstacle.call(this, game, x, y, 'crate');
    this.createCentralCircle(18);
}
Crate.prototype = Object.create(Obstacle.prototype);
Crate.prototype.constructor = Crate;
Crate.defaultScale = 1;
Crate.defaultHealth = 15000;
Crate.coinsValue = 0;
Crate.scoreValue = 50;
Crate.spriteSheetGid = 51;
// End Crate


// Begin Bulrush
function Bulrush(game, x, y) {
    Obstacle.call(this, game, x, y, 'bulrush');
    this.createCentralCircle(8);
}
Bulrush.prototype = Object.create(Obstacle.prototype);
Bulrush.prototype.constructor = Bulrush;
Bulrush.defaultScale = 1;
Bulrush.defaultHealth = 20000;
Bulrush.coinsValue = 100;
Bulrush.scoreValue = 150;
Bulrush.spriteSheetGid = 78;
Bulrush.prototype.die = function() {
    Obstacle.prototype.die.call(this);

    if (!mainState.hasItem('bulrushSeed')) {
        mainState.addItem('bulrushSeed');
    }

};
// End Bulrush

// Begin Snowman
function Snowman(game, x, y) {
    Obstacle.call(this, game, x, y, 'snowman');
    this.createCentralCircle(16);
}
Snowman.prototype = Object.create(Obstacle.prototype);
Snowman.prototype.constructor = Snowman;
Snowman.defaultScale = 1;
Snowman.defaultHealth = 100000;
Snowman.coinsValue = 100;
Snowman.scoreValue = 150;
Snowman.spriteSheetGid = 76;
Snowman.prototype.die = function() {
    Obstacle.prototype.die.call(this);

    if (!mainState.hasItem('carrot')) {
        mainState.addItem('carrot');
    }

};
// End Snowman