var attackerGroups = ['attackers'];
var bulletGroups = ['bullets'];
var towerGroups = ['rocks', 'boulders', 'logs'];

var map;
var layer;

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


        // Add attacker groups
        for (i = 0; i < attackerGroups.length; i++) {
            this[attackerGroups[i]] = game.add.group();
        }

        // Add bullet groups
        for (i = 0; i < bulletGroups.length; i++) {
            this[bulletGroups[i]] = game.add.group();
        }

        // Add tower groups
        for (i = 0; i < towerGroups.length; i++) {
            this[towerGroups[i]] = game.add.group();
        }

        this.initiateLabels();

        game.input.onDown.add(this.placeTower, this);

        this.startLevel(1);

    },

    update: function() {

        try {
            this.turn += 1;

            this.updateCoins();
            this.updateLives();

            this.updateNotifications();

        }
        catch (err) {
            console.log(err);
        }

    },

    render: function() {
        this.bullets.debug(100, 100);

    },

    cleanUp: function()
    {
        // Code based on an article at http://davidp.net/phaser-sprite-destroy/

        var aCleanup = [];

        // Tower groups
        for (i = 0; i < towerGroups.length; i++) {
            this[towerGroups[i]].forEachDead(function(item){
                aCleanup.push(item);
            });
        }

        var i = aCleanup.length - 1;
        while(i > -1)
        {
            var getitem = aCleanup[i];
            getitem.destroy();
            i--;
        }

        // console.log(aCleanup.length);
    },

    getDifficulty: function() {
        var difficulty = 3;
        return difficulty;
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

        /*
        game.time.events.loop(7000, this.spawnTower, this, 'Rock');
        game.time.events.loop(5555, this.spawnTower, this, 'Rock');
        game.time.events.loop(4000, this.spawnTree, this);
        game.time.events.loop(5250, this.spawnTree, this);
        game.time.events.loop(6700, this.spawnTree, this);
        */

        this.loopsInitiated = true;
    },

    healthChangeNotification: function(healthChangeText, spawnX, spawnY)
    {

        var style = {
            font: "18px Arial",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        if (!spawnX || !spawnY) {
            spawnX = this.healthXCoordinate;
            spawnY = this.notificationYCoordinate + 100;
        }

        var textName = guid();

        var y = this.notificationYCoordinate;

        y += this.labelHealthNotifications.length * 15;

        this[textName] = game.add.text(this.healthXCoordinate, y, healthChangeText, style);
        this[textName].alpha = 0;

        this.labelHealthNotifications.push(textName);

        game.add.tween(this[textName]).to({alpha: 1}, 750, Phaser.Easing.Linear.None, true);
        game.add.tween(this[textName]).from( { x: spawnX, y: spawnY }, 750, Phaser.Easing.Linear.None, true);

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
                this.removeNotification('labelHealthNotifications', textName)
            },
            this
        ).autoDestroy = true;

    },

    healthChangeNotificationInFlightChanges: function()
    {

        for (i = 0; i < this.labelHealthNotifications.length; ++i) {
            var y = Math.round(this.notificationYCoordinate + (i * 15));
            var text = this[this.labelHealthNotifications[i]];

            if (text.y > y) {
                text.y -= .5;
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

    spawnTower: function(className, x, y) {
        var item = new window[className](game, x, y);
        var groupName = className.toLowerCase() + 's';
        this[groupName].add(item);
    },

    move_player: function() {
        "use strict";
        var target_position;
        target_position = new Phaser.Point(this.game.input.activePointer.x, this.game.input.activePointer.y);
        this.player1.move_to(target_position);
    },

    render: function() {

    },


    nextLevel: function()
    {
        this.level += 1;

        mainState.notification('level', '+1', this.sandcastles.children[0].x, this.sandcastles.children[0].y);

        if (typeof window['level' + this.level] != 'undefined') {
            window['level' + this.level].begin();
        }

        return true;
    },

    placeTower: function()
    {
        var cost = window[this.towerSelected].cost;

        if (cost > this.coins) {
            return false;
        }

        var xCoordinate = Math.floor(game.input.x / this.squareWidth) * this.squareWidth;
        var yCoordinate = Math.floor(game.input.y / this.squareWidth) * this.squareWidth;

        if (!this.isTowerPlacementAppropriateAtPosition(xCoordinate, yCoordinate)) {
            return false;
        }

        this.spawnTower(this.towerSelected, xCoordinate, yCoordinate);
        this.changeCoins(-cost, xCoordinate, yCoordinate);

        return true;
    },
    
    isTowerPlacementAppropriateAtPosition: function(x, y)
    {

        if (this.doesTowerExistAtPosition(x, y)) {
            return false;
        }
        
        return true;
        
    },

    doesTowerExistAtPosition: function(x, y)
    {
        var placementRectangle = new Phaser.Rectangle(x, y, this.squareWidth - 3, this.squareWidth - 3);

        var towerExists = false;

        for (i = 0; i < towerGroups.length; i++) {
            this[towerGroups[i]].forEach(function(item){
                if (Phaser.Rectangle.intersects(item.getBounds(), placementRectangle)) {
                    towerExists = true;
                }
            });
        }

        return towerExists;
    },
    
    startLevel: function(levelNumber)
    {
        this.level = levelNumber;

        this.clearMap();

        window['level' + this.level].begin();

        // Set coins to the startingCoins value from the level
        this.coins = window['level' + this.level].startingCoins;

        // Set lives to the startingLives value from the level
        this.lives = window['level' + this.level].startingLives;

    },

    clearMap: function()
    {
        for (i = 0; i < attackerGroups.length; i++) {
            this[attackerGroups[i]].callAll('kill');
        }
        for (i = 0; i < towerGroups.length; i++) {
            this[towerGroups[i]].callAll('kill');
        }
        for (i = 0; i < bulletGroups.length; i++) {
            this[bulletGroups[i]].callAll('kill');
        }

    }

};