var map;
var layer;
var timerEvents = [];

var mainState = {
    preload: function() {

        this.guid = guid();

        this.version = '0.1.1';

        this.backgrounds = game.add.group();

        loadMainFiles();

        game.load.tilemap('map1', 'assets/tilemaps/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tilemaps/tiles/tiles_spritesheet.png');

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


        this.turn = 0;
        this.coins = 0;
        this.lives = 999;
        this.towerSelected = 'Rock';
        this.squareWidth = 35;

        window.onkeydown = function() {
            if (game.input.keyboard.event.keyCode == 80) {
                mainState.togglePause();
            }
        };

        this.map = game.add.tilemap('map1');
        this.map.addTilesetImage('tiles_spritesheet', 'tiles');


        // create map layers
        this.layers = {};
        this.map.layers.forEach(function (layer) {
            this.layers[layer.name] = this.map.createLayer(layer.name);
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

        this.collisionLayer = this.map.createLayer('collision');
        game.physics.arcade.enable(this.collisionLayer);


        var tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
        this.pathfinding = this.game.plugins.add(Rendlesham.Pathfinding, this.map.layers[1].data, [-1], tile_dimensions);

        this.game.goalX = game.width * .025;
        this.game.goalY = game.height * .41;

        this.towers = game.add.group();
        this.attackers = game.add.group();
        this.weapons = game.add.group();
        this.bullets = game.add.group();
        this.overlays = game.add.group();

        this.initiateLabels();
        this.initiateLoops();

        game.input.onDown.add(this.placeTower, this);


        this.gameOverBackground = this.game.add.tileSprite(0, 0, game.width, game.height, 'gameOverBackground');
        this.gameOverBackground.alpha = 0;
        this.overlays.add(this.gameOverBackground);

        this.startLevel(1);

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

            if (window['level' + this.level].completed()) {
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

        this.titleStyle = { font: "16px Chewy", fill: "#DDDDDD", boundsAlignH: "center", boundsAlignV: "middle" };
        this.labelStyle = { font: "26px Chewy", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" };

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

    move_player: function() {
        "use strict";
        var target_position;
        target_position = new Phaser.Point(this.game.input.activePointer.x, this.game.input.activePointer.y);
        this.player1.move_to(target_position);
    },

    render: function() {
        // game.debug.spriteBounds(this.pathwayPlacementRectangle);
    },


    nextLevel: function()
    {

        this.displayMessage('Level completed!');

        this.level += 1;

        if (typeof window['level' + this.level] != 'undefined') {
            window['level' + this.level].begin();
        }

        return true;
    },

    placeTower: function()
    {

        var cost = window[this.towerSelected].cost;

        var x = Math.floor(game.input.x / this.squareWidth) * this.squareWidth;
        var y = Math.floor(game.input.y / this.squareWidth) * this.squareWidth;

        if (x == 0) {
            x = 1;
        }
        if (y == 0) {
            y = 1;
        }


        var action = '';

        if (this.isTowerPlacementAppropriateAtPosition(x, y)) {
            action = 'add';
        } else if (this.isTowerUpgradeAppropriateAtPosition(x, y)) {
            action = 'upgrade';
        } else {
            return false;
        }

        switch (action) {
            case 'add':
                if (!this.coinsSufficientForTowerPlacement()) {
                    return false;
                }

                this.spawnTower(this.towerSelected, x, y);
                break;
            case 'upgrade':
                if (!this.coinsSufficientForTowerUpgrade()) {
                    return false;
                }

                var tower = this.getTowerAtPosition(x, y);
                tower.upgrade();
                break;
        }

        this.changeCoins(-cost, x, y);

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
            // return false;
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
        var placementRectangle = new Phaser.Rectangle(x, y, this.squareWidth - 3, this.squareWidth - 3);

        this.towers.forEachAlive(function(tower){
            if (Phaser.Rectangle.intersects(tower.getBounds(), placementRectangle)) {
                return tower;
            }
        });

        return {};
    },

    isPositionOnPathway: function(x, y)
    {

        this.pathwayPlacementRectangle = game.add.sprite(x + 8, y + 8, null);
        game.physics.enable(this.pathwayPlacementRectangle, Phaser.Physics.ARCADE);
        this.pathwayPlacementRectangle.scale.setTo(0.5, 0.5);

        var onPathway = true;

        if (game.physics.arcade.collide(this.pathwayPlacementRectangle, this.layers.collision)) {
            onPathway = false;
        }

        return onPathway;
        
    },

    startLevel: function(levelNumber)
    {
        this.level = levelNumber;
        this.allAttackersDispatched = false;

        this.clearMap();

        window['level' + this.level].begin();

        // Set coins to the startingCoins value from the level
        this.coins = window['level' + this.level].startingCoins;

        // Set lives to the startingLives value from the level
        this.lives = window['level' + this.level].startingLives;

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
        var borderColor;


        if (this.lives < 1) {

            borderColor = 0x000000;

        } else if (this.isTowerPlacementAppropriateAtPosition(xCoordinate, yCoordinate)) {

            if (this.coinsSufficientForTowerPlacement()) {
                borderColor = 0x00FF00;
            } else {
                borderColor = notEnoughCoinsColor;
            }


        } else if (this.isTowerUpgradeAppropriateAtPosition(xCoordinate, yCoordinate)) {

            if (this.coinsSufficientForTowerUpgrade()) {
                borderColor = 0x0088FF;
            } else {
                borderColor = notEnoughCoinsColor;
            }

        } else {
            borderColor = inappropriateColor;

        }

        this.graphics.lineStyle(2, borderColor, 1);
        this.graphics.drawRect(xCoordinate, yCoordinate, this.squareWidth, this.squareWidth);
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
        game.time.events.add(Phaser.Timer.SECOND * 7, this.clearMessage, this).autoDestroy = true;
    },

    clearMessage: function()
    {
        this.labelMessage.text = '';
    }

};