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

        loadMainFiles();

    },

    init: function(levelNumber)
    {
        this.levelId = levelNumber;
    },

    create: function()
    {

        /*
        game.time.advancedTiming = true;
        game.time.desiredFps = 60;
        */

        game.forceSingleUpdate = true;

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width * .5, game.height * .5, game.width * 2, game.height * 2);

            this.goFullScreen();
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game = game;

        this.game.noHealthBars = false;

        // this.game.add.plugin(Phaser.Plugin.Debug);

        this.loadUser();

        this.turn = 0;
        this.coins = 0;
        this.lives = 999;
        this.score = 0;
        this.towerSelected = 'Gun';
        this.squareWidth = 35;
        this.halfSquareWidth = this.squareWidth * .5;

        if (!this.levelId) {
            this.levelId = 1;
        }


        window.onkeydown = function() {
            // Press P
            if (game.input.keyboard.event.keyCode == 80) {
                mainState.togglePauseScreen();
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

        this.fetchLevelInfo();

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
        this.game.healthBars = game.add.group();
        this.game.bullets = game.add.group();
        this.overlays = game.add.group();
        this.finishedItems = game.add.group();

        this.linkBackgrounds = game.add.group();
        this.texts = game.add.group();

        this.initiateLoops();

        game.input.onDown.add(this.placeTower, this);


        this.gameOverBackground = this.game.add.tileSprite(0, 0, game.camera.width, game.camera.height, 'gameOverBackground');
        this.gameOverBackground.fixedToCamera = true;
        this.gameOverBackground.alpha = 0;

        this.overlays.add(this.gameOverBackground);

        this.mode = 'place';

        this.game.target = {};

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

            this.updateNotifications();
            this.drawIndicators();

            if (!this.pendingLevelCompleted && this.level.completed()) {
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
        this.characters.callAll('prepareForGameOver');

    },

    gameOver: function()
    {
        game.state.start('gameOver', true, true, this.levelId);
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

        // game.time.events.loop(9000, this.cleanUp, this);

        game.time.events.loop(5000, this.positionCamera, this);

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
            'labelScoreTitle',
            'labelScore',
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

        switch(this.level.theme) {
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

        // Begin lives
        this.labelLivesXCoordinate = game.camera.x + 75;

        this.labelLivesTitle = game.add.bitmapText(this.labelLivesXCoordinate, this.titlesYCoordinate, bitmapFontName, 'Lives', 16);
        this.labelLivesTitle.tint = titleTint;

        this.labelLives = game.add.bitmapText(this.labelLivesXCoordinate + 12, this.valuesYCoordinate, bitmapFontName, this.lives, 28);
        this.labelLives.tint = valueTint;
        this.labelLivesNotifications = [];
        // End lives

        // Begin score
        this.labelScoreXCoordinate = game.camera.width - 60;

        this.labelScoreTitle = game.add.bitmapText(this.labelScoreXCoordinate, this.titlesYCoordinate, bitmapFontName, 'Score', 16);
        this.labelScoreTitle.tint = titleTint;

        this.labelScore = game.add.bitmapText(this.labelScoreXCoordinate + 12, this.valuesYCoordinate, bitmapFontName, this.score, 28);
        this.labelScore.tint = valueTint;
        this.labelScoreNotifications = [];
        // End score

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

        this.updateCoins();
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

    updateScore: function()
    {
        if (this.score >= 1000) {
            this.labelScore.x = this.labelScoreXCoordinate - 6;
        } else if (this.score >= 100) {
            this.labelScore.x = this.labelScoreXCoordinate;
        } else if (this.score >= 10) {
            this.labelScore.x = this.labelScoreXCoordinate + 6;
        } else {
            this.labelScore.x = this.labelScoreXCoordinate + 12;
        }

        this.labelScore.setText(this.score);
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

        this.updateLives();
        this.notification('lives', displayAmount, notificationSpawnX, notificationSpawnY);

        if (this.nathan) {
            this.nathan.drawForceFields();
        }

    },

    changeScore: function(amount, notificationSpawnX, notificationSpawnY)
    {
        if (isNaN(amount)) {
            return false;
        }
        this.score += amount;

        if (amount >= 1) {
            var displayAmount = '+' + amount;
        } else {
            var displayAmount = amount;
        }

        this.updateScore();
        this.notification('score', displayAmount, notificationSpawnX, notificationSpawnY);
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
            'labelLivesNotifications',
            'labelScoreNotifications'
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
            this.pause(true);
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

    pause: function(showText)
    {
        game.paused = true;

        if (showText) {
            this.pausedText = game.add.text(game.width * 0.5, game.height * 0.5, '-Paused-', this.healthStyle);
            this.pausedText.anchor.set(0.5, 0.5);
        }

    },

    unpause: function()
    {
        game.paused = false;

        if (this.pausedText) {
            this.pausedText.destroy();
        }
    },

    spawnAttacker: function(className, x, y)
    {
        if (!x) {

            if (this.level.entryYGrid) {
                var gridX = this.level.entryXGrid;
                x = (gridX * this.squareWidth) + (this.squareWidth-1);
            } else {
                x = this.game.width - 5;
            }

        }
        if (!y) {

            if (this.level.entryYGrid) {
                var gridY = this.level.entryYGrid;
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

        var level = this.level;

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

        this.map.createFromObjects('objects', 108, 'nathan', 0, true, false, this.characters, Nathan, true);
        this.nathan = this.characters.getFirstAlive();
        this.nathan.drawForceFields();

        this.map.createFromObjects('objects', 120, 'bully', 0, true, false, this.characters, Bully, true);
        this.bully = this.getBully();

    },

    spawnCharacter: function(className, x, y, coordinateType)
    {

        if (coordinateType && coordinateType == 'grid') {
            var coordinates = mainState.translateGridCoordinatesToPixelCoordinates(x, y);
            x = coordinates[0] + this.halfSquareWidth;
            y = coordinates[1] + this.halfSquareWidth;
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

        var explosion;

        explosion = this.explosions.getFirstDead();

        if (explosion) {
            explosion.reuse(x, y);
        } else {
            explosion = new Explosion(this.game, x, y);
            this.explosions.add(explosion);
        }

        if (tint) {
            explosion.setTint(tint);
        }

    },

    render: function()
    {
        // game.debug.body(this.test);

        /*
        this.game.bullets.forEachAlive(function(item){
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

        // game.debug.text(this.game.bullets.countLiving() + ' / ' + this.game.bullets.countDead(), game.width - 50, 30)

        // game.debug.text(this.explosions.countLiving() + ' / ' + this.explosions.countDead(), game.width - 100, 80)

        // game.debug.text(game.time.fps, game.width - 50, 30)

    },

    levelCompleted: function()
    {
        this.pendingLevelCompleted = true;

        this.displayMessage('Level ' + this.levelId + ' completed!');
        this.labelIndicatorMessage.setText('');

        this.user.levelsComplete[this.levelId] = true;

        // Begin stars
        if (!this.user.levelStars) {
            this.user.levelStars = {};
        }

        var completionStars = this.level.calculateCompletionStars();

        if (!this.user.levelStars[this.levelId] || this.user.levelStars[this.levelId] < completionStars) {
            this.user.levelStars[this.levelId] = completionStars;
        }

        if (!this.user.levelStars[this.level.name] || this.user.levelStars[this.level.name] < completionStars) {
            this.user.levelStars[this.level.name] = completionStars;
        }
        // End stars

        // Begin score
        if (!this.user.levelHighScores) {
            this.user.levelHighScores = {};
        }

        if (!this.user.levelHighScores[this.level.name] || this.user.levelHighScores[this.level.name] < this.score) {
            this.user.levelHighScores[this.level.name] = this.score;
        }
        // End score

        this.save();

        game.time.events.add(Phaser.Timer.SECOND * 5, this.levelCompletedScreen, this).autoDestroy = true;

    },

    levelCompletedScreen: function()
    {

        this.gameOverBackground.alpha = .5;

        this.levelCompleteText = game.add.bitmapText(
            game.camera.width * .5,
            game.height * .16,
            bitmapFontName,
            'Level ' + this.levelId + ' complete!',
            58
        );
        this.levelCompleteText.x = game.world.centerX - (this.levelCompleteText.width * .5);
        this.levelCompleteText.fixedToCamera = true;

        // Begin stars
        var completionStars = this.level.calculateCompletionStars();

        var x = (game.width * .5) - 180;
        var y = (game.height * .36);

        var starSpriteName;

        for (i = 1; i <= 3; i++) {

            if (i <= completionStars) {
                starSpriteName = 'starYellow';
            } else {
                starSpriteName = 'starCharcoal';
            }

            var star = game.add.sprite(x, y, starSpriteName);
            star.fixedToCamera = true;

            this.finishedItems.add(star);

            star.scale.setTo(.55, .55);
            x += 120;
        }
        // End stars

        // Begin score text
        this.scoreText = game.add.bitmapText(
            game.camera.width * .5,
            game.height * .68,
            bitmapFontName,
            'Score: ' + this.score,
            24
        );
        this.scoreText.tint = 0xCCCCCC;
        this.scoreText.x = (game.camera.width * .5) - (this.scoreText.width * .5);
        this.scoreText.fixedToCamera = true;
        // End score text

        // Begin next level link
        this.nextLevelLink = game.add.bitmapText(
            game.camera.width * .5,
            game.height * .8,
            bitmapFontName,
            'Play Next Level',
            40
        );
        this.nextLevelLink.x = (game.camera.width * .5) - (this.nextLevelLink.width * .5);
        this.nextLevelLink.fixedToCamera = true;

        this.nextLevelLinkButton = game.add.button(
            game.world.centerX - 80,
            this.nextLevelLink.y,
            'forestGreen',
            this.nextLevel,
            this
        );
        this.linkBackgrounds.add(this.nextLevelLinkButton);
        this.nextLevelLinkButton.x = (game.camera.width * .5) - (this.nextLevelLinkButton.width * .5);
        this.nextLevelLinkButton.y = this.nextLevelLink.y - 11;
        this.nextLevelLinkButton.fixedToCamera = true;
        // End next level link


    },


    nextLevel: function()
    {

        this.levelId ++;

        game.state.start('main', true, true, this.levelId);

        return true;
    },

    placeTower: function()
    {
        if (this.pauseScreenOpen) {
            return false;
        }

        if (this.pauseButton.input.pointerOver()) {
            return;
        }

        if (this.towerInfoOpen) {

            if (this.upgradeTowerButton.input.pointerOver()) {
                return;
            }
            if (this.sellTowerButton.input.pointerOver()) {
                return;
            }

            this.closeTowerInfo();
            return;
        }

        var cost = window[this.towerSelected].cost;

        var x = Math.floor((game.input.x + game.camera.x) / this.squareWidth) * this.squareWidth + this.halfSquareWidth;
        var y = Math.floor((game.input.y + game.camera.y) / this.squareWidth) * this.squareWidth + this.halfSquareWidth;

        if (x == 0) {
            x = 1;
        }
        if (y == 0) {
            y = 1;
        }


        var action = '';

        if (this.isTowerPlacementAppropriateAtPosition(x, y)) {
            action = 'add';
        } else if (this.doesTowerExistAtPosition(x, y)) {
            action = 'towerInfo';
        } else if (this.doesAttackerExistAtPosition(x - this.halfSquareWidth, y - this.halfSquareWidth)) {
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
            case 'towerInfo':

                var tower = this.getTowerAtPosition(x, y);
                this.openTowerInfo(tower);

                break;
            case 'target':

                if (this.doesAttackerExistAtPosition(x - this.halfSquareWidth, y - this.halfSquareWidth)) {
                    var item = this.getAttackerAtPosition(x - this.halfSquareWidth, y - this.halfSquareWidth);
                } else if (this.doesObstacleExistAtPosition(x, y)) {
                    var item = this.getObstacleAtPosition(x, y);
                }

                item.targetToggle();

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

        if (this.isPositionOnPathway(x, y) && !this.level.canPlaceTowerOnPathway) {
             return false;
        }

        if (this.level.towerPlacementForbiddenRows) {
            var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            var gridY = gridCoordinates[1];

            if (this.level.towerPlacementForbiddenRows.indexOf(gridY) != -1) {
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

    fetchLevelInfo: function()
    {
        this.level = window[levelOrdering.eastAnglia[this.levelId]]
        return this.level;
    },

    startLevel: function()
    {

        $('p').css('opacity', '0.01');

        this.fetchLevelInfo();

        this.allAttackersDispatched = false;
        this.pendingLevelCompleted = false;

        this.cleanUp();
        this.clearMap();
        this.setupMap();
        this.spawnLevelObstacles();
        this.positionCamera();
        this.initiateLabels();
        this.addUserInterfaceButtons();

        this.level.begin();

        // Set coins to the startingCoins value from the level
        this.coins = this.level.startingCoins;
        this.updateCoins();

        // Set lives to the startingLives value from the level
        this.lives = this.level.startingLives;
        this.updateLives();

        this.score = 0;
        this.updateScore();

        this.startingObstaclesWithCoinsValue = this.countObstaclesWithCoinsValue();

    },

    startWave: function(waveNumber)
    {

        this.waveNumber = waveNumber;

        var message = '';

        if (waveNumber == 1) {
            message = 'Level ' + this.levelId + ' ';
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

        this.game.bullets.callAll('kill');
        this.game.healthBars.callAll('kill');

        this.crosshairs.callAll('kill');
        this.explosions.callAll('kill');
        this.characters.callAll('kill');
        this.finishedItems.callAll('kill');

        var objectsToDestroy = [
            'levelCompleteText',
            'nextLevelLink',
            'scoreText',
            'nextLevelLinkButton'
        ];

        objectsToDestroy.forEach(function(objectName) {
            if (mainState[objectName]) {
                mainState[objectName].destroy();
            }
        });

        this.gameOverBackground.alpha = 0;

        this.clearTimedEvents();

        this.globalAdditionalCostTiles = [];
        if (this.pathfinding) {
            this.pathfinding.easy_star.removeAllAdditionalPointCosts();
            this.pathfinding.easy_star.stopAvoidingAllAdditionalPoints();
        }
        if (this.easyStarSync) {
            this.easyStarSync.removeAllAdditionalPointCosts();
            this.easyStarSync.stopAvoidingAllAdditionalPoints();
        }

        this.destroyUserInterfaceButtons();

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

        var buttonsForEffect = ['pauseButton', 'upgradeTowerButton', 'sellTowerButton'];


        var cancelIndicators = false;

        buttonsForEffect.forEach(function(name) {
            if (mainState[name]) {
                if (mainState[name].input.pointerOver()) {
                    mainState[name].alpha = .8;
                    cancelIndicators = true;
                } else {
                    mainState[name].alpha = .5;
                }
            }
        });

        if (cancelIndicators) {
            return;
        }


        if (this.pauseButton.input.pointerOver()) {
            this.pauseButton.alpha = .8;
            return;
        } else {
            this.pauseButton.alpha = .5;
        }

        if (this.towerInfoOpen) {
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

        if (this.labelIndicatorMessage) {
            this.labelIndicatorMessage.setText(indicatorMessage);
        }

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

    }


};

mainState.drawForceFields = function(sprite, number)
{
    if (this.forceFieldGraphics) {
        this.forceFieldGraphics.destroy();
    }

    this.forceFieldGraphics = game.add.graphics(0, 0);

    if (number >= 5) {
        this.forceFieldGraphics.lineStyle(2, 0xBBBBFF, 0.5);
        this.forceFieldGraphics.beginFill(0xCCCCFF, 0.1);
        this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, 80);
        this.forceFieldGraphics.endFill();
    }

    if (number >= 4) {
        this.forceFieldGraphics.lineStyle(2, 0x9999FF, 0.5);
        this.forceFieldGraphics.beginFill(0xBBBBFF, 0.1);
        this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, 65);
        this.forceFieldGraphics.endFill();
    }

    if (number >= 3) {
        this.forceFieldGraphics.lineStyle(2, 0x7777FF, 0.5);
        this.forceFieldGraphics.beginFill(0xBBBBFF, 0.1);
        this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, 50);
        this.forceFieldGraphics.endFill();
    }

    if (number >= 2) {
        this.forceFieldGraphics.lineStyle(2, 0x5555FF, 0.5);
        this.forceFieldGraphics.beginFill(0xBBBBFF, 0.1);
        this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, 35);
        this.forceFieldGraphics.endFill();
    }
};

mainState.coinsSufficientForTowerPlacement = function()
{
    if (this.coins < window[this.towerSelected].cost) {
        return false;
    }

    return true;
};

mainState.coinsSufficientForTowerUpgrade = function()
{
    if (this.coins < window[this.towerSelected].cost) {
        return false;
    }

    return true;
};


mainState.cleanUp = function()
{
    // Code based on an article at http://davidp.net/phaser-sprite-destroy/

    var aCleanup = [];

    this.attackers.forEachDead(function(item){
        aCleanup.push(item);
    }, this);
    this.towers.forEachDead(function(item){
        aCleanup.push(item);
    }, this);
    this.game.bullets.forEachDead(function(item){
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
};

mainState.lastWaveDispatched = function()
{
    this.allAttackersDispatched = true;
};

mainState.displayMessage = function(message)
{
    this.labelMessage.setText(message);
    game.time.events.add(Phaser.Timer.SECOND * 6, this.clearMessage, this).autoDestroy = true;
};

mainState.clearMessage = function()
{
    this.labelMessage.setText('');
};

mainState.translatePixelCoordinatesToGridCoordinates = function(x, y)
{
    x = Math.floor(x / this.squareWidth);
    y = Math.floor(y / this.squareWidth);

    return [x, y];
};

mainState.translateGridCoordinatesToPixelCoordinates = function(x, y)
{
    x = Math.floor(x * this.squareWidth);
    y = Math.floor(y * this.squareWidth);

    return [x, y];
};

mainState.setupMap = function()
{
    if (!this.level.mapName) {
        throw 'Level mapName not found';
    }

    this.map = game.add.tilemap(this.level.mapName);
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
};

mainState.initiateEasyStar = function()
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
};

mainState.getCollisionLayer = function()
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
};

mainState.loadUser = function()
{
    if (localStorage.getItem(this.name)) {
        this.user = JSON.parse(localStorage.getItem(this.name));
    } else {
        this.user = newUser;
        this.save();
    }
};

mainState.save = function()
{
    localStorage.setItem(this.name, JSON.stringify(this.user));
};

mainState.untargetAll = function()
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

    this.noTarget();
};

mainState.goFullScreen = function()
{
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.startFullScreen(false);
};

mainState.toggleFullScreen = function()
{
    if (game.scale.isFullScreen)  {
        game.scale.stopFullScreen();
    } else {
        this.goFullScreen();
    }
};

mainState.scheduleAttackersWave = function(attackerClassName, waveNumber, s, duration, gap, startOffset)
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
};

mainState.positionCamera = function()
{
    if (!this.map) {
        throw 'Map not initiated.';
    }

    var x = (this.map.widthInPixels - game.width) * .5;
    var y = (this.map.heightInPixels - game.height) * .5;

    game.camera.x = x;
    game.camera.y = y;
};

mainState.generateSpawnAttackerPixelCoordinates = function()
{
    return mainState.translateGridCoordinatesToPixelCoordinates(
        this.level.entryXGrid,
        this.level.entryYGrid
    );
};

mainState.addItem = function(itemName)
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
};

mainState.hasItem = function(itemName)
{
    if (this.user.hasOwnProperty('items') && this.user.items.hasOwnProperty('itemName')  && this.user.items.hasOwnProperty('itemName') >= 1) {
        return true;
    }

    return false;
};

mainState.addGlobalAdditionalCostTile = function(x, y, coordinateType, cost)
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
};

mainState.setAllAttackerPathNeedsRegenerating = function()
{
    if (!this.level.canPlaceTowerOnPathway && !this.bully) {
        return false;
    }

    this.attackers.forEachAlive(function(attacker){
        attacker.pathNeedsRegenerating = true;
    });
};

mainState.addGlobalImpassablePoint = function(x, y, coordinateType)
{
    if (coordinateType && coordinateType == 'pixels') {
        var gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        x = gridCoordinates[0];
        y = gridCoordinates[1];
    }

    this.pathfinding.easy_star.avoidAdditionalPoint(x, y);
    this.easyStarSync.avoidAdditionalPoint(x, y);

    this.setAllAttackerPathNeedsRegenerating();
};

mainState.removeGlobalImpassablePoint = function(x, y)
{
    this.pathfinding.easy_star.stopAvoidingAdditionalPoint(x, y);
    this.easyStarSync.stopAvoidingAdditionalPoint(x, y);

    this.setAllAttackerPathNeedsRegenerating();
};

mainState.wouldObstaclePlacementBlockPath = function(x, y, coordinateType)
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
};

mainState.wouldObstaclePlacementBlockPathCallbackHandler = function(path)
{
    wouldObstaclePlacementBlockPathResult = path;
};

mainState.getEntryXGrid = function()
{
    return this.level.entryXGrid;
};

mainState.getEntryYGrid = function()
{
    return this.level.entryYGrid;
};

mainState.getGoalXGrid = function()
{
    return this.level.goalXGrid;
};

mainState.getGoalYGrid = function()
{
    return this.level.goalYGrid;
};

mainState.pixelsNearestTileTopLeftCoordinates = function(x, y)
{
    return [
        Math.round(x / this.squareWidth) * this.squareWidth,
        Math.round(y / this.squareWidth) * this.squareWidth
    ];
};

mainState.countObstaclesWithCoinsValue = function()
{
    var i = 0;

    this.obstacles.forEachAlive(function(obstacle){
        if (obstacle.coinsValue >= 1) {
            i++;
        }
    });

    return i;
};

mainState.setTarget = function(sprite)
{
    this.game.target = sprite;
};

mainState.noTarget = function()
{
    this.game.target = {};
};

mainState.addUserInterfaceButtons = function()
{
    this.pauseButton = game.add.button(game.camera.width - 42, 7, 'pauseDark', this.openPauseScreen, this);
    this.pauseButton.fixedToCamera = true;
    this.pauseButton.inputEnabled = true;
    this.pauseButton.alpha = .5;
};

mainState.destroyUserInterfaceButtons = function()
{
    var buttonsToDestroy = ['pauseButton'];

    buttonsToDestroy.forEach(function(buttonName) {
        if (mainState[buttonName]) {
            mainState[buttonName].destroy();
        }
    });
};

mainState.togglePauseScreen = function()
{
    if (this.pauseScreenOpen) {
        this.closePauseScreen();
    } else {
        this.openPauseScreen();
    }
};

mainState.openPauseScreen = function()
{
    if (this.pauseScreenOpen) {
        return false;
    }

    if (this.graphics) {
        this.graphics.destroy();
    }

    this.pause(false);

    this.pauseScreenOpen = true;

    this.gameOverBackground.alpha = .5;

    this.addButtonTextLink('resume', 'Resume', 46, 'forestGreen', 0, game.height * .21, 'center', 'closePauseScreen');

    this.addButtonTextLink('restart', 'Restart Level', 46, 'forestGreen', 0, game.height * .46, 'center', 'restartLevel');

    this.addButtonTextLink('exit', 'Exit', 46, 'forestGreen', 0, game.height * .71, 'center', 'goToTitleScreen');

    return true;

};

mainState.closePauseScreen = function()
{
    var buttonsToDestroy = ['resume', 'restart', 'exit'];

    buttonsToDestroy.forEach(function(name) {
        if (mainState[name]) {
            mainState[name].destroy();
        }
        if (mainState[name + 'Button']) {
            mainState[name + 'Button'].destroy();
        }
    });

    this.gameOverBackground.alpha = 0;

    this.pauseScreenOpen = false;

    this.unpause();
};

mainState.restartLevel = function()
{
    this.closePauseScreen();
    game.state.start('main', true, true, this.levelId);
};

mainState.addButtonTextLink = Rendlesham.gameState.prototype.addButtonTextLink;
mainState.changeGameState = Rendlesham.gameState.prototype.changeGameState;

mainState.goToTitleScreen = function()
{
    this.closePauseScreen();
    this.changeGameState('titleScreen');
};

mainState.getBully = function()
{
    var bully;

    this.characters.forEachAlive(function(character) {
        if (character.constructor.name == 'Bully') {
            bully = character;
        }
    }, this);

    return bully;
};

mainState.openTowerInfo = function(tower)
{

    if (this.towerInfoOpen) {
        this.closeTowerInfo();
    }

    this.towerInfoOpen = true;
    this.currentTower = tower;

    var buttonsToDestroy = ['upgradeTowerButton', 'sellTowerButton'];

    buttonsToDestroy.forEach(function(buttonName) {
        if (mainState[buttonName]) {
            mainState[buttonName].destroy();
        }
    });

    if (tower.upgradable()) {
        this.upgradeTowerButton = game.add.button(tower.x - 35, tower.y, 'upDark', this.upgradeCurrentTower, this);
        this.upgradeTowerButton.inputEnabled = true;
        this.upgradeTowerButton.alpha = .5;
        this.upgradeTowerButton.anchor.set(0.5, 0.5);

    }

    if (tower.sellable()) {
        this.sellTowerButton = game.add.button(tower.x + 35, tower.y, 'closeDark', this.sellCurrentTower, this);
        this.sellTowerButton.inputEnabled = true;
        this.sellTowerButton.alpha = .5;
        this.sellTowerButton.anchor.set(0.5, 0.5);
    }


    if (tower.weapon1) {

        this.towerInfoOpenRangeGraphics = game.add.graphics(0, 0);

        this.towerInfoOpenRangeGraphics.lineStyle(2, 0x88FF88, 0.5);
        this.towerInfoOpenRangeGraphics.beginFill(0x88FF88, 0.2);
        this.towerInfoOpenRangeGraphics.drawCircle(tower.x, tower.y, tower.calculateBulletKillDistance(tower.grade)*2);
        this.towerInfoOpenRangeGraphics.endFill();

        if (tower.upgradable()) {
            this.towerInfoOpenRangeGraphics.lineStyle(2, 0x33FFFF, 0.5);
            this.towerInfoOpenRangeGraphics.drawCircle(tower.x, tower.y, tower.calculateBulletKillDistance(tower.grade+1)*2);
            this.towerInfoOpenRangeGraphics.endFill();
        }

    }

};

mainState.closeTowerInfo = function()
{

    this.currentTower = {};

    var buttonsToDestroy = ['upgradeTowerButton', 'sellTowerButton'];

    buttonsToDestroy.forEach(function(buttonName) {
        if (mainState[buttonName]) {
            mainState[buttonName].destroy();
        }
    });

    if (this.towerInfoOpenRangeGraphics) {
        this.towerInfoOpenRangeGraphics.destroy();
    }

    this.towerInfoOpen = false;

};

mainState.sellCurrentTower = function()
{
    this.currentTower.sell();
    this.closeTowerInfo();
};

mainState.upgradeCurrentTower = function()
{
    if (this.coinsSufficientForTowerUpgrade()) {
        this.currentTower.upgradeAtCost();
    }

    this.refreshTowerInfo();
};

mainState.refreshTowerInfo = function()
{
    var tower = this.currentTower;
    this.closeTowerInfo();
    this.openTowerInfo(tower);
};