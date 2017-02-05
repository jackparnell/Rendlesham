var map;
var layer;
var timerEvents = [];

var mainState = {
    preload: function() {

        this.guid = guid();

        this.version = '0.1.1';
        this.name = 'rendlesham';

        loadMainFiles();

    },

    create: function() {

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game = game;

        this.loadUser();

        this.turn = 0;
        this.coins = 0;
        this.lives = 999;
        this.towerSelected = 'Gun';
        this.squareWidth = 35;
        this.level = 1;

        window.onkeydown = function() {
            // Press P
            if (game.input.keyboard.event.keyCode == 80) {
                mainState.togglePause();
            }
            // Press S
            if (game.input.keyboard.event.keyCode == 83) {
                mainState.toggleSellMode();
            }
        };

        this.backgrounds = game.add.group();

        this.setupMap();

        this.game.goalX = game.width * .025;
        this.game.goalY = game.height * .41;

        this.towers = game.add.group();
        this.attackers = game.add.group();
        this.weapons = game.add.group();
        this.explosions = game.add.group();
        this.crosshairs = game.add.group();
        this.bullets = game.add.group();
        this.overlays = game.add.group();

        this.initiateLabels();
        this.initiateLoops();

        game.input.onDown.add(this.placeTower, this);


        this.gameOverBackground = this.game.add.tileSprite(0, 0, game.width, game.height, 'gameOverBackground');
        this.gameOverBackground.alpha = 0;
        this.overlays.add(this.gameOverBackground);

        this.mode = 'place';

        this.startLevel();

    },

    update: function() {

        try {
            this.turn += 1;

            if (this.lives < 1) {
                this.noLivesLeft();
            }

            this.updateCoins();
            this.updateLives();
            this.updateNotifications();
            this.drawIndicators();

            if (!this.pendingNextLevel && window['level' + this.level].completed()) {
                this.nextLevel();
            }

        }
        catch (err) {
            console.log(err);
        }

    },

    getDifficulty: function() {
        var difficulty = 3;
        return difficulty;
    },

    noLivesLeft: function()
    {
        // TODO The tween below is nowhere near finished after 4 seconds. Determine why and fix.
        game.add.tween(this.gameOverBackground, this.game).to( { alpha: 1 }, Phaser.Timer.SECOND * 4, Phaser.Easing.Linear.None, true);
        game.time.events.add(Phaser.Timer.SECOND * 5, this.gameOver, this);


        this.attackers.callAll('prepareForGameOver');
        this.towers.callAll('prepareForGameOver');

    },

    gameOver: function() {
        game.state.start('gameOver');
    },

    shutdown: function()
    {

    },

    initiateLoops: function()
    {
        if (this.loopsInitiated) {
            // Loops already initiated
            return;
        }

        game.time.events.loop(9000, this.cleanUp, this);

        this.loopsInitiated = true;
    },


    removeNotification: function(containerArrayName, guid)
    {
        var index = this[containerArrayName].indexOf(guid);

        if (index > -1) {
            this[containerArrayName].splice(index, 1);
        }
    },

    initiateLabels: function()
    {

        this.titleStyle = { font: "16px Ubuntu", fill: "#DDDDDD", boundsAlignH: "center", boundsAlignV: "middle" };
        this.labelStyle = { font: "26px Ubuntu", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" };
        this.indicatorMessageStyle = { font: "16px Ubuntu", fill: "#FFFFFF", boundsAlignH: "right", boundsAlignV: "middle" };

        this.titlesYCoordinate = 10;
        this.valuesYCoordinate = 30;
        this.notificationYCoordinate = 50;

        this.labelCoinsXCoordinate = 10;

        this.labelCoinsTitle = game.add.text(this.labelCoinsXCoordinate, this.titlesYCoordinate, 'Coins', this.titleStyle);
        this.labelCoinsTitle.setTextBounds(0, 5, 40, 10);
        this.labelCoins = game.add.text(this.labelCoinsXCoordinate, this.valuesYCoordinate, this.coins, this.labelStyle);
        this.labelCoins.setTextBounds(0, 5, 40, 10);
        this.labelCoinsNotifications = [];

        this.labelLivesXCoordinate = 75;

        this.labelLivesTitle = game.add.text(this.labelLivesXCoordinate, this.titlesYCoordinate, 'Lives', this.titleStyle);
        this.labelLivesTitle.setTextBounds(0, 5, 40, 10);
        this.labelLives = game.add.text(this.labelLivesXCoordinate, this.valuesYCoordinate, this.lives, this.labelStyle);
        this.labelLives.setTextBounds(0, 5, 40, 10);
        this.labelLivesNotifications = [];


        this.messageXCoordinate = this.labelCoinsXCoordinate;
        this.messageYCoordinate = game.height - this.squareWidth + 2;

        this.labelMessage = game.add.text(this.messageXCoordinate, this.messageYCoordinate, '', this.labelStyle);

        this.indicatorMessageXCoordinate = game.width * .6;
        this.indicatorMessageYCoordinate = game.height - this.squareWidth + 8;

        this.labelIndicatorMessage = game.add.text(this.indicatorMessageXCoordinate, this.indicatorMessageYCoordinate, '', this.indicatorMessageStyle);


    },

    changeCoins: function(amount, notificationSpawnX, notificationSpawnY)
    {
        if (isNaN(amount)) {
            return false;
        }
        this.coins += amount;

        if (amount >= 1) {
            var displayAmount = '+' + amount;
        } else {
            var displayAmount = amount;
        }

        this.notification('coins', displayAmount, notificationSpawnX, notificationSpawnY);

    },

    updateCoins: function()
    {
        this.labelCoins.text = this.coins;
    },

    updateLives: function()
    {
        this.labelLives.text = this.lives;
    },

    changeLives: function(amount, notificationSpawnX, notificationSpawnY)
    {
        if (isNaN(amount)) {
            return false;
        }
        this.lives += amount;

        if (amount >= 1) {
            var displayAmount = '+' + amount;
        } else {
            var displayAmount = amount;
        }

        this.notification('lives', displayAmount, notificationSpawnX, notificationSpawnY);

    },

    notification: function(statisticName, changeText, spawnX, spawnY)
    {

        if (changeText === 0) {
            return;
        }

        var statisticNameUcFirst = statisticName[0].toUpperCase() + statisticName.substr(1);

        var xCoordinateName = 'label' + statisticNameUcFirst + 'XCoordinate';
        var notificationsArrayName = 'label' + statisticNameUcFirst + 'Notifications';

        if (!spawnX || !spawnY) {
            spawnX = this[xCoordinateName];
            spawnY = this.notificationYCoordinate + 100;
        }

        var textName = guid();

        var y = this.notificationYCoordinate;

        y += this[notificationsArrayName].length * 15;

        this[textName] = game.add.text(this[xCoordinateName], y, changeText, this.titleStyle);
        this[textName].alpha = 0;
        this[textName].setTextBounds(0, 5, 40, 10);


        if (changeText >= 1) {
            this[textName].addColor('#33FF33', 0) ;
        } else if (changeText <= -1) {
            this[textName].addColor('#FF0000', 0) ;
        } else {
            this[textName].addColor('#FFFFFF', 0) ;
        }

        this[notificationsArrayName].push(textName);

        game.add.tween(this[textName]).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
        game.add.tween(this[textName]).from( { x: spawnX, y: spawnY }, 500, Phaser.Easing.Linear.None, true);

        game.time.events.add(
            Phaser.Timer.SECOND * 2.25,
            function() {
                game.add.tween(this[textName]).to({alpha: 0}, 750, Phaser.Easing.Linear.None, true);
            },
            this
        ).autoDestroy = true;

        game.time.events.add(
            Phaser.Timer.SECOND * 3,
            function() {
                this[textName].destroy()
            },
            this
        ).autoDestroy = true;

        game.time.events.add(
            Phaser.Timer.SECOND * 2.5,
            function() {
                this.removeNotification(notificationsArrayName, textName)
            },
            this
        ).autoDestroy = true;

    },

    updateNotifications: function()
    {

        var notificationArrayNames = [
            'labelCoinsNotifications',
            'labelLivesNotifications'
        ];

        for (j = 0; j < notificationArrayNames.length; ++j) {

            var notificationArrayName = notificationArrayNames[j];

            if (this[notificationArrayName] instanceof Array) {
                for (i = 0; i < this[notificationArrayName].length; ++i) {
                    var y = Math.round(this.notificationYCoordinate + (i * 15));
                    var text = this[this[notificationArrayName][i]];

                    if (text.y > y) {
                        text.y -= .5;
                    }
                }
            }

        }
    },

    removeNotification: function(containerArrayName, guid)
    {
        var index = this[containerArrayName].indexOf(guid);

        if (index > -1) {
            this[containerArrayName].splice(index, 1);
        }
    },

    togglePause: function()
    {
        if (game.paused) {
            this.unpause();
        } else {
            this.pause();
        }
    },

    toggleSellMode: function()
    {
        if (this.mode != 'sell') {
            this.mode = 'sell';
        } else {
            this.mode = 'place';
        }

        console.log(this.mode);
    },

    pause: function()
    {
        game.paused = true;

        this.pausedText = game.add.text(game.width * 0.5, game.height * 0.5, '-Paused-', this.healthStyle);
        this.pausedText.anchor.set(0.5, 0.5);

    },

    unpause: function()
    {
        game.paused = false;

        this.pausedText.destroy();
    },

    spawnOscar: function() {
        this.oscar = new Oscar(this.game, this.game.width-5, this.game.height * .41);
        this.attackers.add(this.oscar);
    },

    spawnAttacker: function(className, x, y)
    {
        if (!x) {
            x = this.game.width - 5;
        }
        if (!y) {
            y = this.game.height * .41;
        }

        var item = new window[className](this.game, x, y);

        this.attackers.add(item);
    },

    spawnTower: function(className, x, y)
    {
        var item = new window[className](game, x, y);
        this.towers.add(item);
    },

    spawnExplosion: function(x, y) {

        var explosion = game.add.sprite(x, y, 'explosion');

        this.explosions.add(explosion);

        explosion.lifespan = 500;

        explosion.animations.add('explode', [0, 1, 2, 3, 4, 5], 12, false);
        explosion.animations.play('explode');

        game.physics.arcade.enable(explosion);

        explosion.checkWorldBounds = true;
        explosion.outOfBoundsKill = true;

    },

    move_player: function() {
        "use strict";
        var target_position;
        target_position = new Phaser.Point(this.game.input.activePointer.x, this.game.input.activePointer.y);
        this.player1.move_to(target_position);
    },

    render: function()
    {

    },


    nextLevel: function()
    {

        this.pendingNextLevel = true;

        this.displayMessage('Level ' + this.level + ' completed!');

        this.user.levelsComplete[this.level] = true;
        this.save();

        this.level ++;

        game.time.events.add(Phaser.Timer.SECOND * 6, this.startLevel, this).autoDestroy = true;

        return true;
    },

    placeTower: function()
    {

        var cost = window[this.towerSelected].cost;

        var x = Math.floor(game.input.x / this.squareWidth) * this.squareWidth + (this.squareWidth / 2);
        var y = Math.floor(game.input.y / this.squareWidth) * this.squareWidth + (this.squareWidth / 2);

        if (x == 0) {
            x = 1;
        }
        if (y == 0) {
            y = 1;
        }


        var action = '';

        if (this.mode == 'sell') {
            if (this.isTowerSaleAppropriateAtPosition(x, y)) {
                action = 'sell';
            } else {
                return false;
            }
        } else if (this.isTowerPlacementAppropriateAtPosition(x, y)) {
            action = 'add';
        } else if (this.isTowerUpgradeAppropriateAtPosition(x, y)) {
            action = 'upgrade';
        } else if (this.doesAttackerExistAtPosition(x, y)) {
            action = 'target';
        } else {
            return false;
        }

        switch (action) {
            case 'add':
                if (!this.coinsSufficientForTowerPlacement()) {
                    return false;
                }

                this.spawnTower(this.towerSelected, x, y);
                this.changeCoins(-cost, x, y);
                break;
            case 'upgrade':
                if (!this.coinsSufficientForTowerUpgrade()) {
                    return false;
                }

                var tower = this.getTowerAtPosition(x, y);
                tower.upgrade();
                this.changeCoins(-cost, x, y);
                break;
            case 'target':

                var attacker = this.getAttackerAtPosition(x, y);
                attacker.targetToggle();

                break;
            case 'sell':

                var tower = this.getTowerAtPosition(x, y);
                tower.sell();

                break;
        }


        return true;
    },

    isTowerPlacementAppropriateAtPosition: function(x, y)
    {
        if (!this.isPositionOnScreen(x, y)) {
            return false;
        }

        if (this.doesTowerExistAtPosition(x, y)) {
            return false;
        }

        if (this.isPositionOnPathway(x, y)) {
            return false;
        }

        return true;

    },

    isTowerUpgradeAppropriateAtPosition: function(x, y)
    {
        var tower = this.getTowerAtPosition(x, y);
        if (tower.guid && tower.upgradable()) {
            return true;
        }

        return false;
    },

    isTowerSaleAppropriateAtPosition: function(x, y)
    {
        var tower = this.getTowerAtPosition(x, y);
        if (tower.guid && tower.getSellValue()) {
            return true;
        }

        return false;
    },

    isPositionOnScreen: function(x, y)
    {
        if (x < 0 || x >= game.width) {
            return false;
        }
        if (y < 0 || y >= game.height) {
            return false;
        }

        return true;

    },

    doesTowerExistAtPosition: function(x, y)
    {

        var tower = this.getTowerAtPosition(x, y);

        if (tower.guid) {
            return true;
        } else {
            return false;
        }

    },

    getTowerAtPosition: function(x, y)
    {

        var towerAtPosition = {};

        var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        var gridX = gridCoordinates[0];
        var gridY = gridCoordinates[1];

        this.towers.forEachAlive(function(tower){
            if (gridX == tower.gridX && gridY == tower.gridY) {
                towerAtPosition = tower;
            }
        });


        return towerAtPosition;
    },

    doesAttackerExistAtPosition: function(x, y)
    {

        var attacker = this.getAttackerAtPosition(x, y);

        if (attacker.guid) {
            return true;
        } else {
            return false;
        }

    },

    getAttackerAtPosition: function (x, y)
    {
        var placementRectangle = new Phaser.Rectangle(x-5, y-5, 10, 10);

        var attackerAtPosition = {};

        this.attackers.forEachAlive(function(attacker){
            if (Phaser.Rectangle.intersects(attacker.getBounds(), placementRectangle)) {
                attackerAtPosition = attacker;
            }
        });

        return attackerAtPosition;
    },

    isPositionOnPathway: function(x, y)
    {

        var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        var gridX = gridCoordinates[0];
        var gridY = gridCoordinates[1];

        var index = this.layers.collision.layer.data[gridY][gridX].index;

        if (index >= 1) {
            return false;
        } else {
            return true;
        }
    },

    startLevel: function()
    {

        console.log('Starting level ' + this.level);
        this.allAttackersDispatched = false;
        this.pendingNextLevel = false;

        this.clearMap();
        this.setupMap();

        window['level' + this.level].begin();

        // Set coins to the startingCoins value from the level
        this.coins = window['level' + this.level].startingCoins;

        // Set lives to the startingLives value from the level
        this.lives = window['level' + this.level].startingLives;

        console.log(this.user);

    },

    clearMap: function()
    {

        this.attackers.callAll('die');

        // Oddness of code below is intentional. Towers get destroyed instead of killed,
        // causing array index issues, meaning die() doesn't get called on all elements.
        // Keep calling until all are gone.
        while (this.towers.length >= 1) {
            this.towers.callAll('die');
        }

        this.bullets.callAll('kill');

        this.crosshairs.callAll('kill');
        this.explosions.callAll('kill');

        this.clearTimedEvents();

    },

    clearTimedEvents: function()
    {

        for (var i=0; i < timerEvents.length; i++) {
            game.time.events.remove(timerEvents[i]);
        }

    },

    drawIndicators: function()
    {
        if (this.graphics) {
            this.graphics.destroy();
        }

        this.graphics = game.add.graphics(0, 0);

        var xCoordinate = Math.floor(game.input.x / this.squareWidth) * this.squareWidth;
        var yCoordinate = Math.floor(game.input.y / this.squareWidth) * this.squareWidth;

        var inappropriateColor = 0xFF8888;
        var notEnoughCoinsColor = 0xFFFF88;
        var upgradeColor = 0x33FFFF;
        var sellColor = 0xBB33BB;
        var borderColor;
        var indicatorMessage = '';

        if (this.lives < 1) {

            borderColor = 0x000000;
            indicatorMessage = 'Game Over';

        } else if (this.mode == 'sell' && this.isTowerSaleAppropriateAtPosition(xCoordinate, yCoordinate)) {

            var tower = this.getTowerAtPosition(xCoordinate, yCoordinate);

            borderColor = sellColor;
            indicatorMessage = 'Sell ' + this.towerSelected + ' tower for £' + tower.getSellValue() + '.';

        } else if (this.mode == 'place' && this.isTowerPlacementAppropriateAtPosition(xCoordinate, yCoordinate)) {

            if (this.coinsSufficientForTowerPlacement()) {
                borderColor = 0x00FF00;
                indicatorMessage = 'Place ' + this.towerSelected + ' tower for £' + window[this.towerSelected].cost + '.';
            } else {
                borderColor = notEnoughCoinsColor;
                indicatorMessage = 'Need £' + window[this.towerSelected].cost + ' for a ' + this.towerSelected + ' tower.';
            }


        } else if (this.mode == 'place' && this.isTowerUpgradeAppropriateAtPosition(xCoordinate, yCoordinate)) {

            if (this.coinsSufficientForTowerUpgrade()) {
                borderColor = upgradeColor;
                indicatorMessage = 'Upgrade ' + this.towerSelected + ' tower for £' + window[this.towerSelected].cost + '.';
            } else {
                borderColor = notEnoughCoinsColor;
                indicatorMessage = 'Need £' + window[this.towerSelected].cost + ' to upgrade ' + this.towerSelected + ' tower.';
            }

        } else if (this.mode == 'place' && this.doesAttackerExistAtPosition(xCoordinate, yCoordinate)) {
            borderColor = 0xFF8800;
            indicatorMessage = 'Target this attacker.';

        } else {
            borderColor = inappropriateColor;
            indicatorMessage = '';
        }

        this.labelIndicatorMessage.text = indicatorMessage;

        this.graphics.lineStyle(2, borderColor, 1);
        this.graphics.drawRect(xCoordinate, yCoordinate, this.squareWidth, this.squareWidth);

        if (this.mode == 'place' && this.doesTowerExistAtPosition(xCoordinate, yCoordinate)) {
            var tower = this.getTowerAtPosition(xCoordinate, yCoordinate);


            if (tower.weapon1) {
                this.graphics.lineStyle(2, 0x88FF88, 0.5);
                this.graphics.beginFill(0x88FF88, 0.2);
                this.graphics.drawCircle(tower.x, tower.y, tower.calculateBulletKillDistance(tower.grade)*2);
                this.graphics.endFill();

                if (tower.upgradable()) {
                    this.graphics.lineStyle(2, upgradeColor, 0.5);
                    this.graphics.drawCircle(tower.x, tower.y, tower.calculateBulletKillDistance(tower.grade+1)*2);
                    this.graphics.endFill();
                }

            }

        }
    },

    coinsSufficientForTowerPlacement: function()
    {

        if (this.coins < window[this.towerSelected].cost) {
            return false;
        }

        return true;
    },

    coinsSufficientForTowerUpgrade: function()
    {
        if (this.coins < window[this.towerSelected].cost) {
            return false;
        }

        return true;
    },

    cleanUp: function()
    {
        // Code based on an article at http://davidp.net/phaser-sprite-destroy/

        var aCleanup = [];

        this.attackers.forEachDead(function(item){
            aCleanup.push(item);
        }, this);
        this.towers.forEachDead(function(item){
            aCleanup.push(item);
        }, this);
        this.bullets.forEachDead(function(item){
            aCleanup.push(item);
        }, this);

        var i = aCleanup.length - 1;
        while(i > -1)
        {
            var getItem = aCleanup[i];
            getItem.destroy();
            i--;
        }

    },

    lastWaveDispatched: function()
    {
        this.allAttackersDispatched = true;
    },

    displayMessage: function(message)
    {
        this.labelMessage.text = message;
        game.time.events.add(Phaser.Timer.SECOND * 6, this.clearMessage, this).autoDestroy = true;
    },

    clearMessage: function()
    {
        this.labelMessage.text = '';
    },

    translatePixelCoordinatesToGridCoordinates: function(x, y)
    {
        x = Math.floor(game.input.x / this.squareWidth);
        y = Math.floor(game.input.y / this.squareWidth);

        return [x, y];
    },

    setupMap: function()
    {
        this.map = game.add.tilemap('map' + this.level);
        this.map.addTilesetImage('tiles_spritesheet', 'tiles');

        // create map layers
        this.layers = {};
        this.map.layers.forEach(function (layer) {
            this.layers[layer.name] = this.map.createLayer(layer.name);

            this.backgrounds.add(this.layers[layer.name]);

            if (layer.properties.collision) { // collision layer
                var collision_tiles = [];
                layer.data.forEach(function (data_row) { // find tiles used in the layer
                    data_row.forEach(function (tile) {
                        // check if it's a valid tile index and isn't already in the list
                        if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                            collision_tiles.push(tile.index);
                        }
                    }, this);
                }, this);
                this.map.setCollision(collision_tiles, true, layer.name);
            }
        }, this);



        // resize the world to be the size of the current layer
        this.layers[this.map.layer.name].resizeWorld();

        this.backgroundLayer = this.map.createLayer('background');
        this.backgrounds.add(this.backgroundLayer);

        this.collisionLayer = this.map.createLayer('collision');
        this.backgrounds.add(this.collisionLayer);

        game.physics.arcade.enable(this.collisionLayer);

        var tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
        this.pathfinding = this.game.plugins.add(Rendlesham.Pathfinding, this.map.layers[1].data, [-1], tile_dimensions);
    },

    loadUser: function()
    {

        if (localStorage.getItem(this.name)) {
            this.user = JSON.parse(localStorage.getItem(this.name));
        } else {
            this.user = {
                levelsComplete: []
            }
            this.save();
        }

    },

    save: function()
    {
        localStorage.setItem(this.name, JSON.stringify(this.user));

    }

};