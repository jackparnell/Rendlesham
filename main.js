var map;
var layer;
var timerEvents = [];
var wouldObstaclePlacementBlockPathResult;
var bitmapFontName = 'gem';

var mainState = {
    preload: function() {

        this.guid = guid();

        this.version = '0.1.1';
        this.name = 'rendlesham';

        game.forceSingleUpdate = true;

        loadMainFiles();

    },

    init: function(levelNumber)
    {
        this.level = levelNumber;
    },

    create: function()
    {

        game.time.advancedTiming = true;
        game.time.desiredFps = 60;

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width*2, game.height*2);

            this.goFullScreen();
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

        if (!this.level) {
            this.level = 1;
        }


        window.onkeydown = function() {
            // Press P
            if (game.input.keyboard.event.keyCode == 80) {
                mainState.togglePause();
            }
            // Press S
            if (game.input.keyboard.event.keyCode == 83) {
                mainState.toggleSellMode();
            }
            // Press 1
            if (game.input.keyboard.event.keyCode == 49) {
                mainState.towerSelected = 'Gun';
            }
            // Press 2
            if (game.input.keyboard.event.keyCode == 50) {
                mainState.towerSelected = 'Freezer';
            }

        };

        this.backgrounds = game.add.group();

        this.setupMap();
        this.positionCamera();

        /*
        this.game.goalX = game.width * .025;
        this.game.goalY = game.height * .41;
        */
        
        this.towers = game.add.group();
        this.obstacles = game.add.group();
        this.characters = game.add.group();
        this.attackers = game.add.group();
        this.weapons = game.add.group();
        this.explosions = game.add.group();
        this.crosshairs = game.add.group();
        this.bullets = game.add.group();
        this.overlays = game.add.group();
        this.finishedItems = game.add.group();

        this.initiateLoops();

        game.input.onDown.add(this.placeTower, this);


        this.gameOverBackground = this.game.add.tileSprite(game.camera.x, game.camera.y, game.width, game.height, 'gameOverBackground');
        this.gameOverBackground.alpha = 0;
        this.overlays.add(this.gameOverBackground);

        this.mode = 'place';

        this.startLevel();

        this.attackersSpawnedCount = 0;

    },

    update: function() {

        try {

            // console.log(game.time.elapsedMS);
            // console.log(1 / game.time.elapsedMS);

            this.turn += 1;

            // this.performanceModifier = game.time.elapsed / 16.66;

            if (this.lives < 1) {
                this.noLivesLeft();
            }

            this.updateCoins();
            this.updateLives();
            this.updateNotifications();
            this.drawIndicators();

            if (!this.pendingLevelCompleted && this.getCurrentLevel().completed()) {
                this.levelCompleted();
            }

            // console.log(game.time.fps);

        }
        catch (err) {
            console.log(err);
        }

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

    destroyLabels: function()
    {

        var labelPropertyNames = [
            'labelCoinsTitle',
            'labelCoins',
            'labelLivesTitle',
            'labelLives',
            'labelMessage',
            'labelIndicatorMessage'
        ];

        labelPropertyNames.forEach(function(labelPropertyName) {
            if (mainState[labelPropertyName]) {
                mainState[labelPropertyName].destroy();
            }
        });

    },

    initiateLabels: function()
    {

        this.destroyLabels();


        switch(window['level' + this.level].theme) {
            case 'snow':
                var titleTint = 0x666666;
                var valueTint = 0x333333;
                break;
            default:
                var titleTint = 0xDDDDDD;
                var valueTint = 0xFFFFFF;

                break;

        }

        this.titlesYCoordinate = game.camera.y + 5;
        this.valuesYCoordinate = game.camera.y + 21;
        this.notificationYCoordinate = game.camera.y + 50;

        this.labelCoinsXCoordinate = game.camera.x + 10;

        this.labelCoinsTitle = game.add.bitmapText(this.labelCoinsXCoordinate, this.titlesYCoordinate, bitmapFontName, 'Coins', 16);
        this.labelCoinsTitle.tint = titleTint;

        this.labelCoins = game.add.bitmapText(this.labelCoinsXCoordinate, this.valuesYCoordinate, bitmapFontName, this.coins, 28);
        this.labelCoins.tint = valueTint;
        this.labelCoinsNotifications = [];

        this.labelLivesXCoordinate = game.camera.x + 75;

        this.labelLivesTitle = game.add.bitmapText(this.labelLivesXCoordinate, this.titlesYCoordinate, bitmapFontName, 'Lives', 16);
        this.labelLivesTitle.tint = titleTint;

        this.labelLives = game.add.bitmapText(this.labelLivesXCoordinate + 12, this.valuesYCoordinate, bitmapFontName, this.lives, 28);
        this.labelLives.tint = valueTint;
        this.labelLivesNotifications = [];


        this.messageXCoordinate = this.labelCoinsXCoordinate;
        this.messageYCoordinate = game.camera.y + (game.height - this.squareWidth + 2);

        this.labelMessage = game.add.bitmapText(this.messageXCoordinate, this.messageYCoordinate, bitmapFontName, '', 24);
        this.labelMessage.tint = valueTint;

        this.indicatorMessageXCoordinate = game.camera.x + game.width * .6;
        this.indicatorMessageYCoordinate = game.camera.y + (game.height - this.squareWidth + 8);

        this.labelIndicatorMessage = game.add.bitmapText(this.indicatorMessageXCoordinate, this.indicatorMessageYCoordinate, bitmapFontName, '', 18);
        this.labelIndicatorMessage.tint = valueTint;

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

        if (this.coins >= 100) {
            this.labelCoins.x = this.labelCoinsXCoordinate;
        } else if (this.coins >= 10) {
            this.labelCoins.x = this.labelCoinsXCoordinate + 6;
        } else {
            this.labelCoins.x = this.labelCoinsXCoordinate + 12;
        }

        this.labelCoins.setText(this.coins);
    },

    updateLives: function()
    {
        this.labelLives.setText(this.lives);
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
        if (this.clearingMap) {
            return;
        }

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

        var x = this[xCoordinateName] + 11;

        this[textName] = game.add.bitmapText(x, y, bitmapFontName, changeText, 16);

        this[textName].alpha = 0;



        if (changeText >= 1) {
            this[textName].tint = 0x33FF33;
        } else if (changeText <= -1) {
            this[textName].tint = 0xFF0000;
        } else {
            // White
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

            if (window['level' + this.level].entryYGrid) {
                var gridX = window['level' + this.level].entryXGrid;
                x = (gridX * this.squareWidth) + (this.squareWidth-1);
            } else {
                x = this.game.width - 5;
            }

        }
        if (!y) {

            if (window['level' + this.level].entryYGrid) {
                var gridY = window['level' + this.level].entryYGrid;
                y = (gridY * this.squareWidth) + (this.squareWidth/2);
            } else {
                y = this.game.height * .41;
            }
            
        }

        this.attackersSpawnedCount ++;


        var reusable = {};

        this.attackers.forEachDead(function(attacker) {
            if (reusable.guid) {
                return;
            }
            if (attacker.constructor.name == className) {
                reusable = attacker;
            }
        }, this);


        if (typeof reusable.reuse == 'function') {
            // console.log(typeof reusable.reuse);
            // console.log(reusable);
            reusable.reuse();
        } else {
            var item = new window[className](this.game, x, y);
            this.attackers.add(item);
        }

    },
    
    spawnAttackerDelayed: function(className, seconds, waveNumber, x, y)
    {

        // Very slightly delay first attacker, to allow objects which may affect
        // attacker path to be generated first.
        if (seconds == 0) {
            seconds = 0.05;
        }

        timerEvents.push(
            game.time.events.add(
                Phaser.Timer.SECOND * seconds,
                this.spawnAttacker,
                this,
                className
            ).autoDestroy = true
        );
    },

    spawnObstacle: function(className, x, y, coordinateType)
    {

        if (coordinateType && coordinateType == 'grid') {
            var coordinates = mainState.translateGridCoordinatesToPixelCoordinates(x, y);
            x = coordinates[0];
            y = coordinates[1];
        }

        var item = new window[className](this.game, x, y);
        this.obstacles.add(item);

    },

    spawnLevelObstacles: function()
    {

        var level = window['level' + this.level];

        if (level.obstacles) {
            for (var obstacleClassName in level.obstacles) {
                if (level.obstacles.hasOwnProperty(obstacleClassName)) {
                    level.obstacles[obstacleClassName].forEach(function(coordinates) {
                        mainState.spawnObstacle(obstacleClassName, coordinates[0], coordinates[1], 'grid');
                    });
                }
            }
        }

        this.map.createFromObjects('objects', 51, 'rock', 0, true, false, this.obstacles, Rock, true);
        this.map.createFromObjects('objects', 63, 'bigBush', 0, true, false, this.obstacles, BigBush, true);
        this.map.createFromObjects('objects', 64, 'smallBush', 0, true, false, this.obstacles, SmallBush, true);
        this.map.createFromObjects('objects', 76, 'snowman', 0, true, false, this.obstacles, Snowman, true);
        this.map.createFromObjects('objects', 78, 'bulrush', 0, true, false, this.obstacles, Bulrush, true);
        this.map.createFromObjects('objects', 94, 'snowyPine', 0, true, false, this.obstacles, SnowyPine, true);

        this.map.createFromObjects('objects', 105, 'tallBrownMushroom', 0, true, false, this.obstacles, TallBrownMushroom, true);
        this.map.createFromObjects('objects', 106, 'tallRedMushroom', 0, true, false, this.obstacles, TallRedMushroom, true);
        this.map.createFromObjects('objects', 107, 'tallGreyMushroom', 0, true, false, this.obstacles, TallGreyMushroom, true);

        // this.map.createFromObjects('objects', 108, 'nathan', 0, true, false, this.characters, Nathan, true);

    },

    spawnCharacter: function(className, x, y, coordinateType)
    {

        if (coordinateType && coordinateType == 'grid') {
            var coordinates = mainState.translateGridCoordinatesToPixelCoordinates(x, y);
            x = coordinates[0] + (this.squareWidth / 2);
            y = coordinates[1] + (this.squareWidth / 2);
        }

        var item = new window[className](this.game, x, y);
        this.characters.add(item);

        return item;
    },

    spawnTower: function(className, x, y)
    {

        var reusable = {};

        this.towers.forEachDead(function(tower) {
            if (reusable.guid) {
                return;
            }
            if (tower.constructor.name == className) {
                reusable = tower;
            }
        }, this);


        if (typeof reusable.reuse == 'function') {
            reusable.reuse(x, y);
        } else {
            var item = new window[className](this.game, x, y);
            this.towers.add(item);
        }

        return true;

    },

    spawnExplosion: function(x, y, tint) {

        var explosion = game.add.sprite(x, y, 'explosion');

        this.explosions.add(explosion);

        explosion.anchor.setTo(0.5, 0.5);

        explosion.lifespan = 500;

        explosion.animations.add('explode', [0, 1, 2, 3, 4, 5], 12, false);
        explosion.animations.play('explode');

        game.physics.arcade.enable(explosion);
        
        if (tint) {
            explosion.tint = tint;
        }
        

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
        // game.debug.body(this.test);

        /*
        this.bullets.forEachAlive(function(item){
            game.debug.body(item);
        });

        this.obstacles.forEachAlive(function(item){
            game.debug.body(item);
        });
        */

        /*
        if (this.towers.children[0]) {
            this.towers.children[0].weapon1.debug();
        }
        */

        // console.log(this.bullets.countLiving() + ' ' + this.bullets.countDead());

        game.debug.text(game.time.fps, game.width - 50, 30)

    },

    levelCompleted: function()
    {
        this.pendingLevelCompleted = true;

        this.displayMessage('Level ' + this.level + ' completed!');
        this.labelIndicatorMessage.setText('');

        this.user.levelsComplete[this.level] = true;

        if (!this.user.levelStars) {
            this.user.levelStars = {};
        }

        var completionStars = window['level' + this.level].calculateCompletionStars();

        if (!this.user.levelStars[this.level] || this.user.levelStars[this.level] < completionStars) {
            this.user.levelStars[this.level] = completionStars;
        }

        this.save();

        game.time.events.add(Phaser.Timer.SECOND * 5, this.levelCompletedScreen, this).autoDestroy = true;

    },

    levelCompletedScreen: function()
    {

        this.gameOverBackground.alpha = .5;

        this.levelCompleteStyle = {
            font: "48px Ubuntu",
            fill: "#FFFFFF",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.levelCompleteText = game.add.bitmapText(
            500,
            game.height * .18,
            bitmapFontName,
            ' Level ' + this.level + ' complete!',
            58
        );
        this.levelCompleteText.x = (game.width / 2) - (this.levelCompleteText.width / 2);

        // Begin stars
        var completionStars = window['level' + this.level].calculateCompletionStars();

        var x = (game.width * .5) - 180 + game.camera.x;
        var y = (game.height * .38) + game.camera.y;

        var starSpriteName;


        for (i = 1; i <= 3; i++) {

            if (i <= completionStars) {
                starSpriteName = 'starYellow';
            } else {
                starSpriteName = 'starCharcoal';
            }

            var star = game.add.sprite(x, y, starSpriteName);

            this.finishedItems.add(star);

            star.scale.setTo(.55, .55);
            x += 120;
        }
        // End stars

        this.nextLevelButton = game.add.button(game.world.centerX - 80, game.height * .8, 'button', this.nextLevel, this);

    },


    nextLevel: function()
    {

        this.level ++;
        this.startLevel();

        return true;
    },

    placeTower: function()
    {

        var cost = window[this.towerSelected].cost;

        var x = Math.floor((game.input.x + game.camera.x) / this.squareWidth) * this.squareWidth + (this.squareWidth / 2);
        var y = Math.floor((game.input.y + game.camera.y) / this.squareWidth) * this.squareWidth + (this.squareWidth / 2);

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
        } else if (this.doesAttackerExistAtPosition(x - (this.squareWidth / 2), y - (this.squareWidth / 2))) {
            action = 'target';
        } else if (this.doesObstacleExistAtPosition(x, y)) {
            action = 'target';
        } else {
            return false;
        }

        switch (action) {
            case 'add':
                if (!this.coinsSufficientForTowerPlacement()) {
                    return false;
                }

                if (this.spawnTower(this.towerSelected, x, y)) {
                    this.changeCoins(-cost, x, y);
                }
                break;
            case 'upgrade':
                if (!this.coinsSufficientForTowerUpgrade()) {
                    return false;
                }

                var tower = this.getTowerAtPosition(x, y);
                if (tower.upgrade()) {
                    this.changeCoins(-cost, x, y);
                }

                break;
            case 'target':

                if (this.doesAttackerExistAtPosition(x - (this.squareWidth / 2), y - (this.squareWidth / 2))) {
                    var item = this.getAttackerAtPosition(x - (this.squareWidth / 2), y - (this.squareWidth / 2));
                } else if (this.doesObstacleExistAtPosition(x, y)) {
                    var item = this.getObstacleAtPosition(x, y);
                }

                item.targetToggle();

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

        if (this.doesObstacleExistAtPosition(x, y)) {
            return false;
        }

        if (this.isPositionOnPathway(x, y) && !window['level' + this.level].canPlaceTowerOnPathway) {
             return false;
        }

        if (window['level' + this.level].towerPlacementForbiddenRows) {
            var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            var gridY = gridCoordinates[1];

            if (window['level' + this.level].towerPlacementForbiddenRows.indexOf(gridY) != -1) {
                return false;
            }
        }


        if (this.wouldObstaclePlacementBlockPath(x, y, 'pixels')) {
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
        if (x < game.camera.x || x >= game.width + game.camera.x) {
            return false;
        }
        if (y < game.camera.y || y >= game.height + game.camera.y) {
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

    doesObstacleExistAtPosition: function(x, y)
    {

        var obstacle = this.getObstacleAtPosition(x, y);

        if (obstacle.guid) {
            return true;
        } else {
            return false;
        }

    },

    getObstacleAtPosition: function(x, y)
    {

        var obstacleAtPosition = {};

        var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        var gridX = gridCoordinates[0];
        var gridY = gridCoordinates[1];

        this.obstacles.forEachAlive(function(obstacles){
            if (gridX == obstacles.gridX && gridY == obstacles.gridY) {
                obstacleAtPosition = obstacles;
            }
        });


        return obstacleAtPosition;
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
        var placementRectangle = new Phaser.Rectangle(x-8, y-8, 16, 16);

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

        $('p').css('opacity', '0.01');

        console.log('Starting level ' + this.level);
        this.allAttackersDispatched = false;
        this.pendingLevelCompleted = false;

        this.clearMap();
        this.setupMap();
        this.spawnLevelObstacles();
        this.positionCamera();
        this.initiateLabels();

        window['level' + this.level].begin();

        // Set coins to the startingCoins value from the level
        this.coins = window['level' + this.level].startingCoins;

        // Set lives to the startingLives value from the level
        this.lives = window['level' + this.level].startingLives;

        this.startingObstaclesWithCoinsValue = this.countObstaclesWithCoinsValue();

    },

    startWave: function(waveNumber)
    {

        this.waveNumber = waveNumber;

        var message = '';

        if (waveNumber == 1) {
            message = 'Level ' + this.level + ' ';
        }

        message += 'Wave ' + this.waveNumber;

        this.displayMessage(message);

    },

    clearMap: function()
    {
        this.clearingMap = true;

        this.attackers.callAll('die');
        this.obstacles.callAll('die');

        // Oddness of code below is intentional. Towers get destroyed instead of killed,
        // causing array index issues, meaning die() doesn't get called on all elements.
        // Keep calling until all are gone.
        while (this.towers.countLiving() >= 1) {
            this.towers.callAll('die');
        }

        this.bullets.callAll('kill');

        this.crosshairs.callAll('kill');
        this.explosions.callAll('kill');
        this.characters.callAll('kill');
        this.finishedItems.callAll('kill');

        if (this.levelCompleteText) {
            this.levelCompleteText.destroy();
        }
        if (this.nextLevelButton) {
            this.nextLevelButton.destroy();
        }
        this.gameOverBackground.alpha = 0;

        this.clearTimedEvents();

        this.globalAdditionalCostTiles = [];
        this.pathfinding.easy_star.removeAllAdditionalPointCosts();
        this.pathfinding.easy_star.stopAvoidingAllAdditionalPoints();
        this.easyStarSync.removeAllAdditionalPointCosts();
        this.easyStarSync.stopAvoidingAllAdditionalPoints();

        this.clearingMap = false;

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

        if (!this.game.device.desktop) {
            return;
        }

        if (this.pendingLevelCompleted) {
            return;
        }

        this.graphics = game.add.graphics(0, 0);

        var x = Math.floor((game.input.x + game.camera.x) / this.squareWidth) * this.squareWidth;
        var y = Math.floor((game.input.y + game.camera.y) / this.squareWidth) * this.squareWidth;

        var inappropriateColor = 0xFF8888;
        var notEnoughCoinsColor = 0xFFFF88;
        var upgradeColor = 0x33FFFF;
        var sellColor = 0xBB33BB;
        var borderColor;
        var indicatorMessage = '';

        if (this.lives < 1) {

            borderColor = 0x000000;
            indicatorMessage = 'Game Over';

        } else if (this.mode == 'sell' && this.isTowerSaleAppropriateAtPosition(x, y)) {

            var tower = this.getTowerAtPosition(x, y);

            borderColor = sellColor;
            indicatorMessage = 'Sell ' + this.towerSelected + ' tower for £' + tower.getSellValue() + '.';

        } else if (this.mode == 'place' && this.isTowerPlacementAppropriateAtPosition(x, y)) {

            if (this.coinsSufficientForTowerPlacement()) {
                borderColor = 0x00FF00;
                indicatorMessage = 'Place ' + this.towerSelected + ' tower for £' + window[this.towerSelected].cost + '.';
            } else {
                borderColor = notEnoughCoinsColor;
                indicatorMessage = 'Need £' + window[this.towerSelected].cost + ' for a ' + this.towerSelected + ' tower.';
            }

            // this.placementGhost = game.add.sprite(x, y, window[this.towerSelected].spriteName);


        } else if (this.mode == 'place' && this.isTowerUpgradeAppropriateAtPosition(x, y)) {

            if (this.coinsSufficientForTowerUpgrade()) {
                borderColor = upgradeColor;
                indicatorMessage = 'Upgrade ' + this.towerSelected + ' tower for £' + window[this.towerSelected].cost + '.';
            } else {
                borderColor = notEnoughCoinsColor;
                indicatorMessage = 'Need £' + window[this.towerSelected].cost + ' to upgrade ' + this.towerSelected + ' tower.';
            }

        } else if (this.mode == 'place' && this.doesAttackerExistAtPosition(x, y)) {
            borderColor = 0xFF8800;
            indicatorMessage = 'Target this attacker.';

        } else if (this.mode == 'place' && this.doesObstacleExistAtPosition(x, y)) {
            borderColor = 0xFF8800;
            indicatorMessage = 'Target this obstacle.';

        } else {
            borderColor = inappropriateColor;
            indicatorMessage = '';
        }

        this.labelIndicatorMessage.setText(indicatorMessage);

        this.graphics.lineStyle(2, borderColor, 1);
        this.graphics.drawRect(x, y, this.squareWidth, this.squareWidth);

        if (this.mode == 'place' && this.doesTowerExistAtPosition(x, y)) {
            var tower = this.getTowerAtPosition(x, y);


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

        if (this.nathan) {
            this.drawForceFields(this.nathan, this.lives);
        }
    },
    
    drawForceFields: function(sprite, number) {

        if (number >= 5) {
            mainState.graphics.lineStyle(2, 0xBBBBFF, 0.5);
            mainState.graphics.beginFill(0xCCCCFF, 0.1);
            mainState.graphics.drawCircle(sprite.x, sprite.y, 80);
            mainState.graphics.endFill();
        }

        if (number >= 4) {
            mainState.graphics.lineStyle(2, 0x9999FF, 0.5);
            mainState.graphics.beginFill(0xBBBBFF, 0.1);
            mainState.graphics.drawCircle(sprite.x, sprite.y, 65);
            mainState.graphics.endFill();
        }

        if (number >= 3) {
            mainState.graphics.lineStyle(2, 0x7777FF, 0.5);
            mainState.graphics.beginFill(0xBBBBFF, 0.1);
            mainState.graphics.drawCircle(sprite.x, sprite.y, 50);
            mainState.graphics.endFill();
        }

        if (number >= 2) {
            mainState.graphics.lineStyle(2, 0x5555FF, 0.5);
            mainState.graphics.beginFill(0xBBBBFF, 0.1);
            mainState.graphics.drawCircle(sprite.x, sprite.y, 35);
            mainState.graphics.endFill();
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
        this.explosions.forEachDead(function(item){
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
        this.labelMessage.setText(message);
        game.time.events.add(Phaser.Timer.SECOND * 6, this.clearMessage, this).autoDestroy = true;
    },

    clearMessage: function()
    {
        this.labelMessage.setText('');
    },

    translatePixelCoordinatesToGridCoordinates: function(x, y)
    {
        x = Math.floor(x / this.squareWidth);
        y = Math.floor(y / this.squareWidth);

        return [x, y];
    },

    translateGridCoordinatesToPixelCoordinates: function(x, y)
    {
        x = Math.floor(x * this.squareWidth);
        y = Math.floor(y * this.squareWidth);

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

        if (this.layers.hasOwnProperty('walkable')) {
            this.walkableLayer = this.map.createLayer('walkable');
            this.backgrounds.add(this.walkableLayer);
        }

        this.collisionLayer = this.map.createLayer('collision');
        this.backgrounds.add(this.collisionLayer);

        game.physics.arcade.enable(this.collisionLayer);

        this.initiateEasyStar();
    },

    initiateEasyStar: function()
    {

        var collisionLayer = this.getCollisionLayer();

        // Begin async pathfinding plugin instance

        var tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
        this.pathfinding = this.game.plugins.add(Rendlesham.Pathfinding, collisionLayer.data, [-1], tile_dimensions);
        this.pathfinding.easy_star.setIterationsPerCalculation(1000);

        // End async pathfinding plugin instance


        // Begin sync instance
        this.easyStarSync = new EasyStar.js();

        var world_grid = collisionLayer.data;
        var acceptable_tiles = [-1];
        var tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);

        this.grid_dimensions = {row: world_grid.length, column: world_grid[0].length};

        grid_indices = [];
        for (grid_row = 0; grid_row < world_grid.length; grid_row += 1) {
            grid_indices[grid_row] = [];
            for (grid_column = 0; grid_column < world_grid[grid_row].length; grid_column += 1) {
                grid_indices[grid_row][grid_column] = world_grid[grid_row][grid_column].index;
            }
        }

        this.easyStarSync.setGrid(grid_indices);
        this.easyStarSync.setAcceptableTiles(acceptable_tiles);
        this.easyStarSync.enableSync();
        // End sync instance

    },

    getCollisionLayer: function()
    {

        var collisionLayer;

        for (var i in this.map.layers) {
            if (this.map.layers.hasOwnProperty(i)) {
                if (this.map.layers[i].name == 'collision') {
                    collisionLayer = this.map.layers[i];
                }
            }
        }

        return collisionLayer;

    },

    loadUser: function()
    {

        if (localStorage.getItem(this.name)) {
            this.user = JSON.parse(localStorage.getItem(this.name));
        } else {
            this.user = {
                levelsComplete: [],
                items: {}
            }
            this.save();
        }

    },

    save: function()
    {
        localStorage.setItem(this.name, JSON.stringify(this.user));

    },

    untargetAll: function()
    {
        this.attackers.forEachAlive(function(item) {
            if (item.targeted) {
                item.untarget();
            }
        });
        this.obstacles.forEachAlive(function(item) {
            if (item.targeted) {
                item.untarget();
            }
        });

    },

    goFullScreen: function()
    {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.startFullScreen(false);
    },

    toggleFullScreen: function()
    {
        if (game.scale.isFullScreen)  {
            game.scale.stopFullScreen();
        } else {
            this.goFullScreen();
        }
    },

    getCurrentLevel: function()
    {
        return window['level' + this.level];
    },

    scheduleAttackersWave: function(attackerClassName, waveNumber, s, duration, gap, startOffset)
    {

        if (!startOffset) {
            startOffset = 0;
        }

        var start = s + startOffset;
        var end = start + duration;

        var i;

        for (i = start; i < end; i += gap) {

            this.spawnAttackerDelayed(attackerClassName, i, waveNumber);

        }

    },

    positionCamera: function()
    {
        var x = (this.map.widthInPixels - game.width) / 2;
        var y = (this.map.heightInPixels - game.height) / 2;

        game.camera.x = x;
        game.camera.y = y;

    },
    
    generateSpawnAttackerPixelCoordinates: function()
    {
        return mainState.translateGridCoordinatesToPixelCoordinates(
            window['level' + mainState.level].entryXGrid,
            window['level' + mainState.level].entryYGrid
        );
        
    },

    addItem: function(itemName)
    {

        try {
            if (!this.user.items) {
                this.user.items = {};
            }

            if (!this.user.items[itemName]) {
                this.user.items[itemName] = 1;
            } else {
                this.user.items[itemName] ++;
            }

            this.save();
        }
        catch (err) {
            console.log(err);
        }

    },

    hasItem: function(itemName)
    {
        if (this.user.hasOwnProperty('items') && this.user.items.hasOwnProperty('itemName')  && this.user.items.hasOwnProperty('itemName') >= 1) {
            return true;
        }

        return false;
    },

    addGlobalAdditionalCostTile: function(x, y, coordinateType, cost)
    {

        if (!this.globalAdditionalCostTiles) {
            this.globalAdditionalCostTiles = [];
        }

        if (!cost) {
            cost = 9999;
        }

        if (coordinateType && coordinateType == 'pixels') {
            var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            x = gridCoordinates[0];
            y = gridCoordinates[1];
        }

        this.globalAdditionalCostTiles.push([
            x,
            y,
            cost
        ]);

        this.setAllAttackerPathNeedsRegenerating();
    },

    setAllAttackerPathNeedsRegenerating: function()
    {
        this.attackers.forEachAlive(function(attacker){
            attacker.pathNeedsRegenerating = true;
        });
    },

    addGlobalImpassablePoint: function(x, y, coordinateType)
    {
        if (coordinateType && coordinateType == 'pixels') {
            var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            x = gridCoordinates[0];
            y = gridCoordinates[1];
        }

        this.pathfinding.easy_star.avoidAdditionalPoint(x, y);
        this.easyStarSync.avoidAdditionalPoint(x, y);

        this.setAllAttackerPathNeedsRegenerating();

    },

    removeGlobalImpassablePoint: function(x, y)
    {

        this.pathfinding.easy_star.stopAvoidingAdditionalPoint(x, y);
        this.easyStarSync.stopAvoidingAdditionalPoint(x, y);

        this.setAllAttackerPathNeedsRegenerating();


    },

    wouldObstaclePlacementBlockPath: function(x, y, coordinateType)
    {


        if (coordinateType && coordinateType == 'pixels') {
            var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            x = gridCoordinates[0];
            y = gridCoordinates[1];
        }

        this.addGlobalImpassablePoint(x, y, 'grid');

        this.easyStarSync.findPath(
            this.getEntryXGrid(),
            this.getEntryYGrid(),
            this.getGoalXGrid(),
            this.getGoalYGrid(),
            this.wouldObstaclePlacementBlockPathCallbackHandler
        );

        this.easyStarSync.calculate();

        this.removeGlobalImpassablePoint(x, y);

        if (wouldObstaclePlacementBlockPathResult === null) {
            return true;
        } else {
            return false;
        }

    },

    wouldObstaclePlacementBlockPathCallbackHandler: function(path)
    {
        wouldObstaclePlacementBlockPathResult = path;
    },

    getEntryXGrid: function()
    {
        return window['level' + this.level].entryXGrid;
    },

    getEntryYGrid: function()
    {
        return window['level' + this.level].entryYGrid;
    },

    getGoalXGrid: function()
    {
        return window['level' + this.level].goalXGrid;
    },

    getGoalYGrid: function()
    {
        return window['level' + this.level].goalYGrid;
    },

    pixelsNearestTileTopLeftCoordinates: function(x, y)
    {
        return [
            Math.round(x / this.squareWidth) * this.squareWidth,
            Math.round(y / this.squareWidth) * this.squareWidth
        ];
    },

    countObstaclesWithCoinsValue: function()
    {
        i = 0;

        this.obstacles.forEachAlive(function(obstacle){
            if (obstacle.coinsValue >= 1) {
                i++;
            }
        });

        return i;

    }

};