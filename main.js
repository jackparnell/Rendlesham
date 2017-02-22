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

    init: function(levelNumber)
    {
        this.level = levelNumber;
    },

    create: function()
    {

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
        this.attackers = game.add.group();
        this.characters = game.add.group();
        this.obstacles = game.add.group();
        this.weapons = game.add.group();
        this.explosions = game.add.group();
        this.crosshairs = game.add.group();
        this.bullets = game.add.group();
        this.overlays = game.add.group();
        this.finishedItems = game.add.group();

        this.initiateLabels();
        this.initiateLoops();

        game.input.onDown.add(this.placeTower, this);


        this.gameOverBackground = this.game.add.tileSprite(0, 0, game.width, game.height, 'gameOverBackground');
        this.gameOverBackground.alpha = 0;
        this.overlays.add(this.gameOverBackground);

        this.mode = 'place';

        this.startLevel();

        this.attackersSpawnedCount = 0;

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

            if (!this.pendingLevelCompleted && this.getCurrentLevel().completed()) {
                this.levelCompleted();
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

        this.titlesYCoordinate = game.camera.y + 10;
        this.valuesYCoordinate = game.camera.y + 30;
        this.notificationYCoordinate = game.camera.y + 50;

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
        this.messageYCoordinate = game.camera.y + (game.height - this.squareWidth + 2);

        this.labelMessage = game.add.text(this.messageXCoordinate, this.messageYCoordinate, '', this.labelStyle);

        this.indicatorMessageXCoordinate = game.width * .6;
        this.indicatorMessageYCoordinate = game.camera.y + (game.height - this.squareWidth + 8);

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

        var item = new window[className](this.game, x, y);

        this.attackers.add(item);
    },
    
    spawnAttackerDelayed: function(className, seconds, waveNumber, x, y)
    {
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
        var item = new window[className](game, x, y);
        this.towers.add(item);
    },

    spawnExplosion: function(x, y, tint) {
        
        var explosion = game.add.sprite(x, y, 'explosion');

        this.explosions.add(explosion);

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
    },

    levelCompleted: function()
    {
        this.pendingLevelCompleted = true;

        this.displayMessage('Level ' + this.level + ' completed!');
        this.labelIndicatorMessage.text = '';

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

        this.levelCompleteStyle = { font: "48px Ubuntu", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" };

        this.levelCompleteText = game.add.text(game.width * .5, game.height * .23, 'Level ' + this.level + ' complete!', this.levelCompleteStyle);
        this.levelCompleteText.setTextBounds(0, 0, 1, 1);

        // Begin stars
        var completionStars = window['level' + this.level].calculateCompletionStars();

        var x = (game.width * .5) - 180;
        var y = game.height * .38;

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

                if (this.doesAttackerExistAtPosition(x, y)) {
                    var item = this.getAttackerAtPosition(x, y);
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

        if (this.isPositionOnPathway(x, y)) {
            return false;
        }

        if (window['level' + this.level].towerPlacementForbiddenRows) {
            var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            var gridY = gridCoordinates[1];

            if (window['level' + this.level].towerPlacementForbiddenRows.indexOf(gridY) != -1) {
                return false;
            }
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

        $('p').css('opacity', '0.01');

        console.log('Starting level ' + this.level);
        this.allAttackersDispatched = false;
        this.pendingLevelCompleted = false;

        this.clearMap();
        this.setupMap();
        this.positionCamera();

        window['level' + this.level].begin();

        // Set coins to the startingCoins value from the level
        this.coins = window['level' + this.level].startingCoins;

        // Set lives to the startingLives value from the level
        this.lives = window['level' + this.level].startingLives;

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

        this.attackers.callAll('die');
        this.obstacles.callAll('die');

        // Oddness of code below is intentional. Towers get destroyed instead of killed,
        // causing array index issues, meaning die() doesn't get called on all elements.
        // Keep calling until all are gone.
        while (this.towers.length >= 1) {
            this.towers.callAll('die');
        }

        this.bullets.callAll('kill');

        this.crosshairs.callAll('kill');
        this.explosions.callAll('kill');
        this.finishedItems.callAll('kill');

        if (this.levelCompleteText) {
            this.levelCompleteText.destroy();
        }
        if (this.nextLevelButton) {
            this.nextLevelButton.destroy();
        }
        this.gameOverBackground.alpha = 0;

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

        if (!this.game.device.desktop) {
            return;
        }

        if (this.pendingLevelCompleted) {
            return;
        }

        this.graphics = game.add.graphics(0, 0);

        var x = Math.floor(game.input.x / this.squareWidth) * this.squareWidth;
        var y = Math.floor(game.input.y / this.squareWidth) * this.squareWidth;

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

        this.labelIndicatorMessage.text = indicatorMessage;

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
        var y = (this.map.heightInPixels - game.height) / 2;

        game.camera.y = y;

    }

};