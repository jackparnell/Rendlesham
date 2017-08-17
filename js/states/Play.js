class Play extends LevelGameState
{
    preload()
    {
        super.preload();
        this.guid = guid();
        this.loadTransylvanianFiles();
    }

    create()
    {
        super.create();

        /*
         this.game.time.advancedTiming = true;
         */

        this.game.time.desiredFps = 60;
        this.game.forceSingleUpdate = false;

        // Set the physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.noHealthBars = false;

        // this.game.add.plugin(Phaser.Plugin.Debug);

        this.loadUser();
        this.checkUser();

        this.game.globals.turn = 0;
        this.coins = 0;
        this.lives = 999;
        this.score = 0;
        this.towerSelected = 'Gun';
        this.hasCheated = false;
        this.keyInput = '';
        this.quickTweenMs = 200;
        this.quickTweenFromScale = .1;

        this.game.timerEvents = [];

        window.onkeydown = function()
        {
            // Press P
            if (this.game.input.keyboard.event.keyCode === 80)
            {
                this.game.state.states.play.togglePauseScreen();
            }
            // Press F
            if (this.game.input.keyboard.event.keyCode === 70)
            {
                // Not currently fully working
                // game.state.states.play.toggleFastForward();
            }
        };

        this.setupLevelGroups();

        this.initiateLoops();

        if (this.canScroll())
        {

            this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

            let verticalScroll = this.level.verticalScroll;
            let horizontalScroll = this.level.horizontalScroll;

            this.game.kineticScrolling.configure({
                kineticMovement: false,
                verticalScroll: verticalScroll,
                horizontalMovement: horizontalScroll,
                verticalWheel: verticalScroll,
                horizontalWheel: horizontalScroll
            });

            this.game.kineticScrolling.start();

            // this.game.input.onUp.add(this.userInput, this);
            this.game.input.onDown.add(this.userInput, this);
        }
        else
        {
            this.game.input.onDown.add(this.userInput, this);
        }

        this.gameOverBackground = this.game.add.tileSprite(0, 0, this.game.camera.width, this.game.camera.height, 'gameOverBackground');
        this.gameOverBackground.fixedToCamera = true;
        this.gameOverBackground.alpha = 0;

        this.game.overlays.add(this.gameOverBackground);

        this.game.target = {};

        // Listen for keyboard presses
        this.game.input.keyboard.onPressCallback = function (input) { this.keyPress(input); }.bind(this);

        this.startLevel();

        this.attackersSpawnedCount = 0;
        this.towersSpawnedCount = 0;

        this.game.fastForwardMode = false;
        this.pauseScreenOpen = false;

        this.flashIntoState();
    }

    bulletHitImpassable(bullet, impassable)
    {
        bullet.kill();
    }

    update()
    {
        try {

            // console.log(game.time.elapsedMS);
            // console.log(1 / game.time.elapsedMS);

            this.game.globals.turn += 1;

            let bullets = this.getBulletsAlive();

            if (this.impassableTiles && this.impassableTiles.length)
            {
                for (let i = 0; i < bullets.length; i++)
                {
                    let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(bullets[i].x, bullets[i].y);
                    let gridPositionString = gridCoordinates[0] + '_' + gridCoordinates[1];
                    if (this.impassableTiles.indexOf(gridPositionString) !== -1)
                    {
                        bullets[i].kill();
                    }
                }
            }

            // this.performanceModifier = game.time.elapsed / 16.66;

            // Begin bullet heat-seeking
            if (!this.preparingForGameOver)
            {
                for (let i = 0; i < bullets.length; i++)
                {
                    let bullet = bullets[i];
                    if (bullet.target && bullet.target.alive && bullet.target.body)
                    {
                        let midPoint = this.getMidPointBetweenSprites(bullet, bullet.target);
                        let moveX = Math.cos(this.game.math.degToRad(midPoint.angle)) * bullet.speed;
                        let moveY = Math.sin(this.game.math.degToRad(midPoint.angle)) * bullet.speed;
                        bullet.body.velocity.set(moveX, moveY);
                    }
                    else if (this.level.bulletsCanOnlyHitTarget)
                    {
                        // If bullet has no target and in level where bulletsCanOnlyHitTarget, kill it
                        bullet.kill();
                    }
                }
            }
            // End bullet heat-seeking

            if (this.lives < 1)
            {
                this.noLivesLeft();
            }

            this.updateNotifications();
            this.drawIndicators();

            for (let i = 1; i <= this.waveNumber; i++)
            {
                this.checkIfWaveHasBeenBeaten(i);
            }

            if (!this.pendingLevelCompleted && this.checkLevelCompleted())
            {
                this.levelCompleted();
            }

            if (this.towerPlacementViewOpen)
            {
                this.updateTowerPlacementView();
            }


            if (this.canScroll() && this.introductionRunning)
            {
                if (this.level.horizontalScroll && !this.level.verticalScroll)
                {
                    this.positionCameraY();
                }
            }

        }
        catch (err)
        {
            console.log(err);
        }
    }

    noLivesLeft()
    {
        if (this.preparingForGameOver)
        {
            return;
        }

        this.preparingForGameOver = true;

        if (this.mode === 'endless')
        {
            this.handleScore();
        }

        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(0x000000, 4000, false);
        this.game.camera.onFadeComplete.add(this.gameOver, this);

        try
        {
            this.attackers.callAll('prepareForGameOver');
            this.towers.callAll('prepareForGameOver');
            this.characters.callAll('prepareForGameOver');
            this.ZapGroup.callAll('prepareForGameOver');
        }
        catch (err) {
            console.log('Error preparing sprites for game over. ');
            console.log(err);
        }
    }

    gameOver()
    {
        this.stats.result = 'gameOver';
        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelId,
            mode: this.mode,
            score: this.score,
            waveReached: this.waveNumber
        };
        this.game.state.start('gameOver', true, true, obj);
    }

    initiateLoops()
    {
        if (this.loopsInitiated) {
            // Loops already initiated
            return;
        }

        // game.time.events.loop(9000, this.cleanUp, this);

        if (!this.canScroll())
        {
            this.game.time.events.loop(6000, this.positionCamera, this);
        }

        this.loopsInitiated = true;
    }

    removeNotification(containerArrayName, guid)
    {
        let index = this[containerArrayName].indexOf(guid);
        if (index > -1)
        {
            this[containerArrayName].splice(index, 1);
        }
    }

    destroyLabels()
    {
        let labelPropertyNames = [
            'labelCoinsTitle',
            'labelCoins',
            'labelLivesTitle',
            'labelLives',
            'labelScoreTitle',
            'labelScore',
            'labelMessage',
            'labelIndicatorMessage'
        ];

        labelPropertyNames.forEach(function(labelPropertyName)
        {
            if (this[labelPropertyName]) {
                this[labelPropertyName].destroy();
            }
        }, this);
    }

    initiateLabels()
    {
        this.destroyLabels();

        let titleTint = 0xDDDDDD;
        let valueTint = 0xFFFFFF;
        switch(this.level.theme) {
            case 'snow':
                titleTint = 0x666666;
                valueTint = 0x333333;
                break;
        }

        this.titlesYCoordinate = 5;
        this.valuesYCoordinate = 21;
        this.notificationYCoordinate = 49;

        this.labelCoinsXCoordinate = 10;

        this.labelCoinsTitle = this.game.add.bitmapText(this.labelCoinsXCoordinate, this.titlesYCoordinate, this.game.globals.bitmapFontName, 'Coins', 16);
        this.labelCoinsTitle.tint = titleTint;
        this.labelCoinsTitle.fixedToCamera = true;

        this.labelCoins = this.game.add.bitmapText(this.labelCoinsXCoordinate, this.valuesYCoordinate, this.game.globals.bitmapFontName, this.coins, 28);
        this.labelCoins.tint = valueTint;
        this.labelCoins.fixedToCamera = true;
        this.labelCoinsNotifications = [];

        // Begin lives
        this.labelLivesXCoordinate = 75;

        this.labelLivesTitle = this.game.add.bitmapText(this.labelLivesXCoordinate, this.titlesYCoordinate, this.game.globals.bitmapFontName, 'Lives', 16);
        this.labelLivesTitle.tint = titleTint;
        this.labelLivesTitle.fixedToCamera = true;

        this.labelLives = this.game.add.bitmapText(this.labelLivesXCoordinate + 12, this.valuesYCoordinate, this.game.globals.bitmapFontName, this.lives, 28);
        this.labelLives.tint = valueTint;
        this.labelLives.fixedToCamera = true;
        this.labelLivesNotifications = [];
        // End lives

        // Begin score
        this.labelScoreXCoordinate = 600;

        this.labelScoreTitle = this.game.add.bitmapText(this.labelScoreXCoordinate, this.titlesYCoordinate, this.game.globals.bitmapFontName, 'Score', 16);
        this.labelScoreTitle.tint = titleTint;
        this.labelScoreTitle.fixedToCamera = true;

        this.labelScore = this.game.add.bitmapText(this.labelScoreXCoordinate + 12, this.valuesYCoordinate, this.game.globals.bitmapFontName, this.score, 28);
        this.labelScore.tint = valueTint;
        this.labelScore.fixedToCamera = true;
        this.labelScoreNotifications = [];
        // End score

        // Begin current wave
        this.labelCurrentWaveXCoordinate = this.labelScoreXCoordinate - 60;

        this.labelCurrentWaveTitle = this.game.add.bitmapText(this.labelCurrentWaveXCoordinate, this.titlesYCoordinate, this.game.globals.bitmapFontName, 'Wave', 16);
        this.labelCurrentWaveTitle.tint = titleTint;
        this.labelCurrentWaveTitle.fixedToCamera = true;

        this.labelCurrentWave = this.game.add.bitmapText(this.labelCurrentWaveXCoordinate - 5, this.valuesYCoordinate, this.game.globals.bitmapFontName, this.waveNumber, 28);
        this.labelCurrentWave.tint = valueTint;
        this.labelCurrentWave.fixedToCamera = true;

        this.updateCurrentWaveLabel();
        // End current wave

        this.messageXCoordinate = 10;
        this.messageYCoordinate = this.game.height - 33;

        this.labelMessage = this.game.add.bitmapText(this.messageXCoordinate, this.messageYCoordinate, this.game.globals.bitmapFontName, '', 24);
        this.labelMessage.tint = valueTint;
        this.labelMessage.fixedToCamera = true;

        this.indicatorMessageXCoordinate = this.game.width * .6;
        this.indicatorMessageYCoordinate = this.game.height - 27;

        this.labelIndicatorMessage = this.game.add.bitmapText(this.indicatorMessageXCoordinate, this.indicatorMessageYCoordinate, this.game.globals.bitmapFontName, '', 18);
        this.labelIndicatorMessage.tint = valueTint;
        this.labelIndicatorMessage.fixedToCamera = true;


        // Set coins to the startingCoins value from the level
        this.coins = this.level.startingCoins;
        this.updateCoins();

        // Set lives to the startingLives value from the level
        this.lives = this.level.startingLives;
        this.updateLives();

        this.score = 0;
        this.updateScore();
    }

    changeCoins(amount, notificationSpawnX, notificationSpawnY)
    {
        if (isNaN(amount))
        {
            return false;
        }

        this.previousCoins = this.coins;
        this.coins += amount;

        let displayAmount = amount;
        if (amount >= 1)
        {
            displayAmount = '+' + displayAmount;
        }

        this.updateCoins();
        this.notification('coins', displayAmount, notificationSpawnX, notificationSpawnY);

        if (
            this.previousCoins < 50 && this.coins >= 50
            ||
            this.previousCoins < 100 && this.coins >= 100
            ||
            this.previousCoins < 150 && this.coins >= 150
        ) {
            this.refreshTowerInfoIfOpen();
            this.refreshTowerPlacementViewIfOpen();
        }
    }

    updateCoins()
    {
        if (!this.hasOwnProperty('labelCoins'))
        {
            return false;
        }
        if (this.hasOwnProperty('previousCoins') && this.previousCoins.toString().length !== this.coins.toString().length)
        {
            this.labelCoins.fixedToCamera = false;
            if (this.coins >= 100)
            {
                this.labelCoins.x = this.labelCoinsXCoordinate;
            }
            else if (this.coins >= 10)
            {
                this.labelCoins.x = this.labelCoinsXCoordinate + 6;
            }
            else
            {
                this.labelCoins.x = this.labelCoinsXCoordinate + 12;
            }
            this.labelCoins.y = this.valuesYCoordinate;
            this.labelCoins.fixedToCamera = true;
        }
        this.labelCoins.setText(this.coins);
        return true;
    }

    updateLives()
    {
        this.labelLives.setText(this.lives);
    }

    updateScore()
    {
        if (this.hasOwnProperty('previousScore') && this.previousScore.toString().length !== this.score.toString().length)
        {
            this.labelScore.fixedToCamera = false;
            if (this.score >= 1000)
            {
                this.labelScore.x = this.labelScoreXCoordinate - 6;
            }
            else if (this.score >= 100)
            {
                this.labelScore.x = this.labelScoreXCoordinate;
            }
            else if (this.score >= 10)
            {
                this.labelScore.x = this.labelScoreXCoordinate + 6;
            }
            else
            {
                this.labelScore.x = this.labelScoreXCoordinate + 12;
            }
            this.labelScore.y = this.valuesYCoordinate;
            this.labelScore.fixedToCamera = true;
        }
        this.labelScore.setText(this.score);
    }

    updateCurrentWaveLabel()
    {
        if (typeof this.waveNumber === 'undefined')
        {
            return;
        }

        let currentWaveText = this.waveNumber || 1;
        if (this.mode !== 'endless' && typeof this.totalWaves !== 'undefined' && this.totalWaves < 99)
        {
            currentWaveText += '/' + this.totalWaves;
        }

        this.labelCurrentWave.fixedToCamera = false;
        if (currentWaveText.length >= 5) {
            this.labelCurrentWave.x = this.labelCurrentWaveXCoordinate - 18;
        }
        else if (currentWaveText.length === 4)
        {
            this.labelCurrentWave.x = this.labelCurrentWaveXCoordinate - 10;
        }
        else if (currentWaveText.length === 3)
        {
            this.labelCurrentWave.x = this.labelCurrentWaveXCoordinate - 4;
        }
        else if (currentWaveText.length === 2)
        {
            this.labelCurrentWave.x = this.labelCurrentWaveXCoordinate + 2;
        }
        else
        {
            this.labelCurrentWave.x = this.labelCurrentWaveXCoordinate + 8;
        }
        this.labelCurrentWave.y = this.valuesYCoordinate;
        this.labelCurrentWave.fixedToCamera = true;

        this.labelCurrentWave.setText(currentWaveText);
    }

    changeLives(amount, notificationSpawnX, notificationSpawnY)
    {
        if (isNaN(amount))
        {
            return false;
        }
        this.lives += amount;

        let displayAmount = amount;
        if (amount >= 1)
        {
            displayAmount = '+' + displayAmount;
        }

        this.updateLives();
        this.notification('lives', displayAmount, notificationSpawnX, notificationSpawnY);

        // Record in stats
        this.stats['wave' + this.waveNumber].lives += amount;

        if (this.lives === 0)
        {
            this.playSound('nes13');
        }
        else if (amount <= -1)
        {
            this.playSound('nes15');
        }

        if (this.nathan)
        {
            this.nathan.drawForceFields();
        }
    }

    changeScore(amount, notificationSpawnX, notificationSpawnY)
    {
        if (isNaN(amount))
        {
            return false;
        }
        this.previousScore = this.score;
        this.score += amount;

        let displayAmount = amount;
        if (amount >= 1)
        {
            displayAmount = '+' + displayAmount;
        }

        this.updateScore();
        this.notification('score', displayAmount, notificationSpawnX, notificationSpawnY);
    }

    notification(statisticName, changeText, spawnX, spawnY)
    {
        if (this.clearingMap)
        {
            return;
        }

        if (changeText === 0)
        {
            return;
        }

        let statisticNameUcFirst = statisticName[0].toUpperCase() + statisticName.substr(1);

        let xCoordinateName = 'label' + statisticNameUcFirst + 'XCoordinate';
        let notificationsArrayName = 'label' + statisticNameUcFirst + 'Notifications';

        if (!spawnX || !spawnY)
        {
            spawnX = this[xCoordinateName];
            spawnY = this.notificationYCoordinate + 100;
        }
        else
        {
            spawnX -= this.game.camera.x;
            spawnY -= this.game.camera.y;
        }

        let textName = guid();

        let y = this.notificationYCoordinate;

        y += this[notificationsArrayName].length * 15;

        let x = this[xCoordinateName] + 10;

        this[textName] = this.game.add.bitmapText(x, y, this.game.globals.bitmapFontName, changeText, 16);

        this[textName].fixedToCamera = true;
        this[textName].alpha = 0;

        if (changeText >= 1)
        {
            this[textName].tint = 0x33FF33;
        }
        else if (changeText <= -1)
        {
            this[textName].tint = 0xFF0000;
        }
        else
        {
            // White
        }

        this[notificationsArrayName].push(textName);

        this.game.add.tween(this[textName]).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
        this.game.add.tween(this[textName].cameraOffset).from( { x: spawnX, y: spawnY }, 500, Phaser.Easing.Linear.None, true);

        this.game.time.events.add(
            Phaser.Timer.SECOND * 2.25,
            function() {
                game.add.tween(this[textName]).to({alpha: 0}, 750, Phaser.Easing.Linear.None, true);
            },
            this
        ).autoDestroy = true;

        this.game.time.events.add(
            Phaser.Timer.SECOND * 3,
            function() {
                this[textName].destroy()
            },
            this
        ).autoDestroy = true;

        this.game.time.events.add(
            Phaser.Timer.SECOND * 2.5,
            function() {
                this.removeNotification(notificationsArrayName, textName)
            },
            this
        ).autoDestroy = true;
    }

    updateNotifications()
    {
        let notificationArrayNames = [
            'labelCoinsNotifications',
            'labelLivesNotifications',
            'labelScoreNotifications'
        ];

        for (let j = 0; j < notificationArrayNames.length; ++j)
        {
            let notificationArrayName = notificationArrayNames[j];

            if (this[notificationArrayName] instanceof Array)
            {
                for (let i = 0; i < this[notificationArrayName].length; ++i)
                {
                    let y = Math.round(this.notificationYCoordinate + (i * 15));
                    let text = this[this[notificationArrayName][i]];
                    if (text.cameraOffset.y > y)
                    {
                        text.cameraOffset.y -= .5;
                    }
                }
            }
        }
    }

    togglePause()
    {
        if (this.game.paused)
        {
            this.unpause();
        }
        else
        {
            this.pause(true);
        }
    }

    pause(showText)
    {
        this.game.paused = true;

        if (showText) {
            this.pausedText = this.game.add.text(
                this.game.width * 0.5,
                this.game.height * 0.5,
                '-Paused-',
                this.healthStyle
            );
            this.pausedText.anchor.set(0.5, 0.5);
        }

        this.closeTowerPlacementView(false);
    }

    unpause()
    {
        this.game.paused = false;

        if (this.pausedText)
        {
            this.pausedText.destroy();
        }
    }

    /**
     * Spawn an attacker of a supplied className.
     *
     * @param {string} className
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    spawnAttacker(className, x, y)
    {
        if (this.preparingForGameOver)
        {
            return false;
        }

        if (!x || !y) {
            let coordinates = this.generateSpawnAttackerPixelCoordinates();
            x = coordinates[0];
            y = coordinates[1];
        }

        this.attackersSpawnedCount ++;

        let reusable = {};

        this.attackers.forEachDead(function(attacker) {
            if (reusable.guid)
            {
                return;
            }
            if (attacker.constructor.name === className)
            {
                reusable = attacker;
            }
        }, this);

        if (typeof reusable.reuse === 'function')
        {
            reusable.reuse();
        }
        else
        {
            let item = new window[className](this.game, x, y);
            this.attackers.add(item);
        }

        return true;
    }

    spawnAttackerDelayed(className, seconds, waveNumber, x, y)
    {

        // Very slightly delay first attacker, to allow objects which may affect
        // attacker path to be generated first.
        if (seconds === 0)
        {
            seconds = 0.05;
        }

        this.game.timerEvents.push(
            this.game.time.events.add(
                Phaser.Timer.SECOND * seconds,
                this.spawnAttacker,
                this,
                className
            ).autoDestroy = true
        );
    }

    spawnObstacle(className, x, y, coordinateType)
    {
        if (coordinateType && coordinateType === 'grid')
        {
            let coordinates = this.translateGridCoordinatesToPixelCoordinates(x, y);
            x = coordinates[0];
            y = coordinates[1];
        }

        let item = new window[className](this.game, x, y);
        this.obstacles.add(item);
    }

    spawnCharacter(className, x, y, coordinateType)
    {
        if (coordinateType && coordinateType === 'grid')
        {
            let coordinates = this.translateGridCoordinatesToPixelCoordinates(x, y);
            x = coordinates[0] + this.halfSquareWidth;
            y = coordinates[1] + this.halfSquareWidth;
        }

        let item = new window[className](this.game, x, y);
        this.characters.add(item);

        return item;
    }

    /**
     * Spawn a tower of a supplied className.
     *
     * @param {string} className
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    spawnTower(className, x, y)
    {
        if (this.preparingForGameOver)
        {
            return false;
        }

        this.towersSpawnedCount ++;

        let reusable = {};

        this.towers.forEachDead(function(tower) {
            if (reusable.guid)
            {
                return;
            }
            if (tower.constructor.name === className)
            {
                reusable = tower;
            }
        }, this);

        if (typeof reusable.reuse === 'function')
        {
            reusable.reuse(x, y);
        }
        else
        {
            let item = new window[className](this.game, x, y);
            this.towers.add(item);
        }

        this.playSound('metalLatch');

        return true;
    }

    spawnExplosion(x, y, tint, angle)
    {
        let obj;
        let group = this.explosions;

        obj = group.getFirstDead();

        if (obj)
        {
            obj.reuse(x, y);
        }
        else
        {
            obj = new Explosion(this.game, x, y);
            group.add(obj);
        }

        if (tint)
        {
            obj.setTint(tint);
        }

        if (angle)
        {
            obj.setAngle(angle);
        }
    }

    spawnZap(x, y, tint, angle)
    {
        let obj;
        let group = this.ZapGroup;

        obj = group.getFirstDead();

        if (obj)
        {
            obj.reuse(x, y);
        }
        else
        {
            obj = new Zap(this.game, x, y);
            group.add(obj);
        }

        if (tint)
        {
            obj.setTint(tint);
        }

        if (angle)
        {
            obj.setAngle(angle);
        }
    }

    render()
    {
        // game.debug.body(this.test);

        // this.game.debug.body(this.reco);

        /*
         this.game.bullets.forEachAlive(function(item){
         game.debug.body(item);
         });

         this.obstacles.forEachAlive(function(item){
         game.debug.body(item);
         });
         */

        /*
         this.attackers.forEachAlive(function(item){
         game.debug.body(item);
         });

         var bullets = this.getBulletsAlive();
         bullets.forEach(function(item){
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
    }

    pathAdditionalCostTiles(attacker)
    {
        if (typeof this.level.pathAdditionalCostTiles === 'function')
        {
            return this.level.pathAdditionalCostTiles(attacker);
        }
        return this.globalAdditionalCostTiles;
    }

    checkLevelCompleted()
    {
        if (typeof this.level.completed === 'function')
        {
            return this.level.completed();
        }
        if (!this.allAttackersDispatched)
        {
            return false;
        }
        return !(this.attackers.countLiving() >= 1);
    }

    levelCompleted()
    {
        this.pendingLevelCompleted = true;
        this.stats.result = 'completed';

        this.displayMessage('Level ' + this.levelId + ' completed!');
        this.labelIndicatorMessage.setText('');

        this.user.levelsComplete[this.levelId] = true;
        this.user.levelsComplete[this.level.name] = true;

        if (!this.user.levelCompletions)
        {
            this.user.levelCompletions = {};
        }
        if (!this.user.levelCompletions[this.mode])
        {
            this.user.levelCompletions[this.mode] = {};
        }
        this.user.levelCompletions[this.mode][this.level.name] = true;

        // Begin stars
        if (!this.user.levelStars)
        {
            this.user.levelStars = {};
        }

        let completionStars = this.calculateCompletionStars();

        if (!this.user.levelStars[this.level.name] || this.user.levelStars[this.level.name] < completionStars)
        {
            this.user.levelStars[this.level.name] = completionStars;
        }

        if (!this.user.levelStars[this.mode])
        {
            this.user.levelStars[this.mode] = {};
        }

        if (!this.user.levelStars[this.mode][this.level.name] || this.user.levelStars[this.mode][this.level.name] < completionStars)
        {
            this.user.levelStars[this.mode][this.level.name] = completionStars;
        }
        // End stars

        this.handleScore();

        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.levelCompletedScreen, this).autoDestroy = true;
    }

    handleScore()
    {
        if (this.hasCheated)
        {
            return false;
        }
        if (!this.user.levelHighScores)
        {
            this.user.levelHighScores = {};
        }
        if (!this.user.levelHighScores[this.level.name] || this.user.levelHighScores[this.level.name] < this.score)
        {
            this.user.levelHighScores[this.level.name] = this.score;
        }
        if (!this.user.levelHighScores[this.mode])
        {
            this.user.levelHighScores[this.mode] = {};
        }
        if (!this.user.levelHighScores[this.mode][this.level.name] || this.user.levelHighScores[this.mode][this.level.name] < this.score)
        {
            this.user.levelHighScores[this.mode][this.level.name] = this.score;
        }
        this.save();
        return true;
    }

    levelCompletedScreen()
    {
        this.levelCompletedScreenOpen = true;

        this.destroyUserInterfaceButtons();
        this.closeTowerInfo();
        this.closeTowerPlacementView();

        this.gameOverBackground.alpha = .5;

        this.levelCompleteText = this.game.add.bitmapText(
            this.game.camera.width * .5,
            this.game.height * .13,
            this.game.globals.bitmapFontName,
            'Level ' + this.levelId + ' complete!',
            58
        );
        this.levelCompleteText.x = (this.game.camera.width * .5) - (this.levelCompleteText.width * .5);
        this.levelCompleteText.fixedToCamera = true;

        // Begin stars
        let completionStars = this.calculateCompletionStars();

        let x = (this.game.camera.width * .5) - 180;
        let y = (this.game.height * .32);

        let starSpriteName;

        for (let i = 1; i <= 3; i++)
        {
            if (i <= completionStars)
            {
                starSpriteName = 'starYellow';
            }
            else
            {
                starSpriteName = 'starCharcoal';
            }

            let star = this.game.add.sprite(x, y, starSpriteName);
            star.fixedToCamera = true;

            this.finishedItems.add(star);

            star.scale.setTo(.55, .55);
            x += 120;
        }
        // End stars

        // Begin score text
        if (!this.hasCheated)
        {
            this.scoreText = this.game.add.bitmapText(
                this.game.camera.width * .5,
                this.game.height * .61,
                this.game.globals.bitmapFontName,
                'Score: ' + this.score,
                24
            );
            this.scoreText.tint = 0xCCCCCC;
            this.scoreText.x = (this.game.camera.width * .5) - (this.scoreText.width * .5);
            this.scoreText.fixedToCamera = true;
        }
        // End score text


        this.addButtonTextLink('nextLevelLink', 'Play Next Level', 40, 'forestGreen', 0, this.game.height * .7, 'center', 'nextLevelLinkButtonClick');

        this.addButtonTextLink('exitToTitle', 'Exit to Title', 20, 'smallWideDark', 10, this.game.camera.height - 42, 'left', 'goToTitleScreenButtonClick');

        this.addButtonTextLink('replayLevel', 'Replay Level', 20, 'smallWideDark', 10, this.game.camera.height - 42, 'right', 'restartLevelButtonClick');
    }

    nextLevelLinkButtonClick()
    {
        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(this.game.globals.interStateBackgroundColor, this.game.globals.fadeOutOfStateMs, true);
        this.game.camera.onFadeComplete.add(this.nextLevel, this);
    }

    nextLevel()
    {
        this.levelId ++;

        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelId,
            mode: this.mode
        };

        this.game.state.start('play', true, true, obj);

        return true;
    }

    userInput()
    {
        if (this.pauseScreenOpen || this.levelCompletedScreenOpen || this.introductionRunning)
        {
            return false;
        }

        try
        {
            if (this.pauseButton.input.pointerOver())
            {
                return;
            }

            if (this.towerInfoOpen)
            {
                if (this.upgradeTowerButton.input.pointerOver())
                {
                    return;
                }
                if (this.sellTowerButton.input.pointerOver())
                {
                    return;
                }

                this.closeTowerInfo();
                return;
            }

            if (this.towerPlacementViewOpen)
            {

                if (this.GunTowerButton && this.GunTowerButton.input.pointerOver())
                {
                    return;
                }
                if (this.FreezerTowerButton && this.FreezerTowerButton.input.pointerOver())
                {
                    return;
                }
                if (this.LaserTowerButton && this.LaserTowerButton.input.pointerOver())
                {
                    return;
                }
                this.closeTowerPlacementView();
                return;

            }

            let x = Math.floor((this.game.input.x + this.game.camera.x) / this.squareWidth) * this.squareWidth + this.halfSquareWidth;
            let y = Math.floor((this.game.input.y + this.game.camera.y) / this.squareWidth) * this.squareWidth + this.halfSquareWidth;

            if (x === 0)
            {
                x = 1;
            }
            if (y === 0)
            {
                y = 1;
            }

            let action = '';

            if (this.isTowerPlacementAppropriateAtPosition(x, y))
            {
                action = 'add';
            }
            else if (this.doesTowerExistAtPosition(x, y))
            {
                action = 'towerInfo';
            }
            else if (this.doesAttackerExistAtPosition(x - this.halfSquareWidth, y - this.halfSquareWidth))
            {
                action = 'target';
            }
            else if (this.doesObstacleExistAtPosition(x, y))
            {
                action = 'target';
            }
            else
            {
                this.notPossible();
                return false;
            }

            switch (action)
            {
                case 'add':
                    this.openTowerPlacementView(x, y, 'pixels');
                    this.playSound('bookOpen');
                    break;
                case 'towerInfo':
                    let tower = this.getTowerAtPosition(x, y);
                    this.openTowerInfo(tower);
                    this.playSound('bookOpen');
                    break;
                case 'target':

                    let item;

                    if (this.doesAttackerExistAtPosition(x - this.halfSquareWidth, y - this.halfSquareWidth)) {
                        item = this.getAttackerAtPosition(x - this.halfSquareWidth, y - this.halfSquareWidth);
                    } else if (this.doesObstacleExistAtPosition(x, y)) {
                        item = this.getObstacleAtPosition(x, y);
                    }

                    item.targetToggle();

                    break;
            }

            return true;
        }
        catch (err)
        {
            console.log('Exception resulting from userInput.');
            console.log(err);
        }
    }

    isTowerPlacementAppropriateAtPosition(x, y)
    {
        if (!this.isPositionOnScreen(x, y))
        {
            return false;
        }

        if (!this.isPositionOnGrid(x, y))
        {
            return false;
        }

        if (this.doesTowerExistAtPosition(x, y))
        {
            return false;
        }

        if (this.doesObstacleExistAtPosition(x, y))
        {
            return false;
        }

        if (this.isPositionOnPathway(x, y) && !this.level.canPlaceTowerOnPathway)
        {
            return false;
        }

        if (this.isPositionOnLayer(x, y, 'lava'))
        {
            return false;
        }

        if (this.isPositionOnLayer(x, y, 'impassable'))
        {
            return false;
        }

        let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        let gridX = gridCoordinates[0];
        let gridY = gridCoordinates[1];

        if (this.level.towerPlacementForbiddenRows)
        {
            if (this.level.towerPlacementForbiddenRows.indexOf(gridY) !== -1)
            {
                return false;
            }
        }
        if (this.level.towerPlacementForbiddenColumns)
        {
            if (this.level.towerPlacementForbiddenColumns.indexOf(gridX) !== -1)
            {
                return false;
            }
        }

        return !(this.wouldObstaclePlacementBlockPath(x, y, 'pixels'));
    }

    isTowerUpgradeAppropriateAtPosition(x, y)
    {
        let tower = this.getTowerAtPosition(x, y);
        return (tower && tower.upgradable());
    }

    isTowerSaleAppropriateAtPosition(x, y)
    {
        let tower = this.getTowerAtPosition(x, y);
        return (tower && tower.getSellValue());
    }

    isPositionOnScreen(x, y)
    {
        if (x < this.game.camera.x || x >= this.game.width + this.game.camera.x)
        {
            return false;
        }
        return !(y < this.game.camera.y || y >= this.game.height + this.game.camera.y);
    }

    isPositionOnGrid(x, y)
    {
        let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        let gridX = gridCoordinates[0];
        let gridY = gridCoordinates[1];
        if (gridX > (this.map.width-1))
        {
            return false;
        }
        return !(gridY > (this.map.height-1));
    }

    /**
     * Checks whether a tower exists at supplied x and y coordinates.
     *
     * @param x
     * @param y
     * @returns {boolean}
     */
    doesTowerExistAtPosition(x, y)
    {
        return !!this.getTowerAtPosition(x, y);
    }

    getTowerAtPosition(x, y)
    {
        let towerAtPosition;

        let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        let gridX = gridCoordinates[0];
        let gridY = gridCoordinates[1];

        this.towers.forEachAlive(function(tower){
            if (gridX === tower.gridX && gridY === tower.gridY) {
                towerAtPosition = tower;
            }
        });

        return towerAtPosition;
    }

    /**
     * Checks whether an obstacle exists at supplied x and y coordinates.
     *
     * @param x
     * @param y
     * @returns {boolean}
     */
    doesObstacleExistAtPosition(x, y)
    {
        return !!this.getObstacleAtPosition(x, y);
    }

    getObstacleAtPosition(x, y)
    {
        let obstacleAtPosition;

        let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        let gridX = gridCoordinates[0];
        let gridY = gridCoordinates[1];

        this.obstacles.forEachAlive(function(obstacles){
            if (gridX === obstacles.gridX && gridY === obstacles.gridY) {
                obstacleAtPosition = obstacles;
            }
        });

        return obstacleAtPosition;
    }

    /**
     * Checks whether an attacker exists at supplied x and y coordinates.
     *
     * @param x
     * @param y
     * @returns {boolean}
     */
    doesAttackerExistAtPosition(x, y)
    {
        return !!this.getAttackerAtPosition(x, y);
    }

    getAttackerAtPosition(x, y)
    {
        let placementRectangle = new Phaser.Rectangle(x-8, y-8, 16, 16);

        let attackerAtPosition;

        this.attackers.forEachAlive(function(attacker){
            if (Phaser.Rectangle.intersects(attacker.getBounds(), placementRectangle)) {
                attackerAtPosition = attacker;
            }
        });

        return attackerAtPosition;
    }

    /**
     * Checks whether a supplied position is on the pathway or not.
     *
     * @param x
     * @param y
     * @returns {boolean}
     */
    isPositionOnPathway(x, y)
    {
        return !(this.isPositionOnLayer(x, y, 'collision'));
    }

    /**
     * Checks whether a supplied position is on a supplied layer or not.
     *
     * @param x
     * @param y
     * @param {string} layerName
     * @returns {boolean}
     */
    isPositionOnLayer(x, y, layerName)
    {
        if (!this.layers[layerName])
        {
            return false;
        }

        let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
        let gridX = gridCoordinates[0];
        let gridY = gridCoordinates[1];

        if (!this.layers[layerName].layer.data[gridY] || !this.layers[layerName].layer.data[gridY][gridX])
        {
            return false;
        }

        let index = this.layers[layerName].layer.data[gridY][gridX].index;

        return (index >= 1);
    }

    startLevel()
    {
        this.allAttackersDispatched = false;
        this.pendingLevelCompleted = false;
        this.levelCompletedScreenOpen = false;
        this.preparingForGameOver = false;
        this.towerClassesUsed = [];
        this.wavesBeaten = [];
        this.wavesStarted = [];
        this.allAttackersDispatchedForWaves = [];

        this.cleanUp();
        this.clearMap();
        this.setupMap();
        this.initiateEasyStar();
        this.spawnLevelObstacles();
        this.positionCamera();

        if (typeof this.level.begin === 'function')
        {
            this.level.begin();
        }

        this.startingObstaclesWithCoinsValue = this.countObstaclesWithCoinsValue();

        if (typeof this.level.introduction === 'function')
        {
            this.introductionRunning = true;
            this.level.introduction();
        }
        else
        {
            this.initiateLabels();
            this.addUserInterfaceButtons();
            this.scheduleLevelEvents();
        }

        this.initiateStats();
    }

    initiateStats()
    {
        if (!this.totalWaves)
        {
            throw {
                'code': 20006,
                'description': 'Property totalWaves missing or invalid. '
            };
        }

        this.stats = {
            userGuid: this.user.guid,
            zoneName: this.zoneName,
            levelName: this.level.name,
            version: this.game.globals.version,
            mode: this.mode,
            result: 'inProgress'
        };

        this.statsDefaults = {
            lives: 0,
            lowestStepsToGoal: 999,
            furthestAirAdvancement: 999999
        };

        for (let i = 1; i <= this.totalWaves; i++)
        {
            this.stats['wave' + i] = {
                lives: this.statsDefaults.lives,
                lowestStepsToGoal: this.statsDefaults.lowestStepsToGoal,
                furthestAirAdvancement: this.statsDefaults.furthestAirAdvancement
            };
        }
    }

    scheduleLevelEvents()
    {
        // Begin level wave scheduling
        let s = 0;
        let waveNumber = 0;

        switch (this.mode) {
            case 'endless':
                this.totalWaves = 299;
                break;
            case 'epic':
                this.totalWaves = this.initialWavesCount * 2;
                break;
            case 'classic':
            default:
                this.totalWaves = this.initialWavesCount;
        }

        let i = this.initialWavesCount + 1;
        while (i <= this.totalWaves)
        {
            this.generateWave(i);
            i++;
        }

        /*
         i = 0;
         while (i <= this.totalWaves) {
         console.log(i + ': ' + this.calculateWaveHealthModifier(i));
         i++;
         }
         */

        if (this.level.distinctWaves)
        {
            this.game.timerEvents.push(
                this.game.time.events.add(
                    Phaser.Timer.SECOND * 1.5,
                    this.startWave,
                    this,
                    1
                ).autoDestroy = true
            );
        }
        else
        {
            for (let wave in this.level.waveInfo)
            {
                waveNumber ++;

                this.game.timerEvents.push(
                    this.game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        this.startWave,
                        this,
                        waveNumber
                    ).autoDestroy = true
                );

                s += this.level.waveInfo[wave].duration;
            }
            this.game.timerEvents.push(
                this.game.time.events.add(
                    Phaser.Timer.SECOND * s,
                    this.lastWaveDispatched,
                    this
                )
            );
        }
        // End level wave scheduling
    }

    scheduleWaveEvents(wave, waveNumber, s)
    {
        if (!this.distinctWaves)
        {
            this.game.timerEvents.push(
                this.game.time.events.add(
                    Phaser.Timer.SECOND * s,
                    this.startWave,
                    this,
                    waveNumber
                ).autoDestroy = true
            );
        }

        if (typeof wave.createEvents === 'function')
        {
            wave.createEvents(s);
        }

        let lastAttackerOfWaveSeconds = 0;

        if (wave.attacks)
        {
            wave.attacks.forEach(function(attack)
            {
                this.scheduleAttackersWave(
                    attack.className,
                    waveNumber,
                    s,
                    attack.duration,
                    attack.gap,
                    attack.delay
                );

                let lastAttackerSeconds = attack.duration + attack.delay;

                if (lastAttackerSeconds > lastAttackerOfWaveSeconds)
                {
                    lastAttackerOfWaveSeconds = lastAttackerSeconds;
                }
            }, this);
        }

        this.game.timerEvents.push(
            this.game.time.events.add(
                Phaser.Timer.SECOND * (s+lastAttackerOfWaveSeconds),
                this.lastWaveAttackerDispatched,
                this
            )
        );

        if (this.totalWaves === waveNumber)
        {
            this.game.timerEvents.push(
                this.game.time.events.add(
                    Phaser.Timer.SECOND * (s+lastAttackerOfWaveSeconds),
                    this.lastWaveDispatched,
                    this
                )
            );
        }
    }

    startWave(waveNumber, checkAlreadyStarted=true)
    {
        if (checkAlreadyStarted && this.wavesStarted.indexOf(waveNumber) !== -1)
        {
            // Wave already started
            return;
        }

        if (this.preparingForGameOver)
        {
            // Don't start a wave if preparingForGameOver
            return;
        }

        this.wavesStarted.push(waveNumber);

        this.waveNumber = waveNumber;

        let message = '';

        if (waveNumber === 1)
        {
            message += 'Level ' + this.levelId + ' ';
            if (this.mode !== 'classic')
            {
                message += ucfirst(this.mode) + ' Mode ';
            }
        }

        message += 'Wave ' + this.waveNumber;

        this.displayMessage(message);

        this.updateCurrentWaveLabel();

        this.scheduleWaveEvents(this.level.waveInfo['wave' + waveNumber], waveNumber, 0.5);
    }

    clearMap()
    {
        this.clearingMap = true;

        this.attackers.callAll('die');
        this.obstacles.callAll('die');

        // Oddness of code below is intentional. Towers get destroyed instead of killed,
        // causing array index issues, meaning die() doesn't get called on all elements.
        // Keep calling until all are gone.
        while (this.towers.countLiving() >= 1)
        {
            this.towers.callAll('die');
        }

        this.game.bullets.callAll('kill');
        this.game.healthBars.callAll('kill');

        this.crosshairs.callAll('kill');
        this.explosions.callAll('kill');
        this.ZapGroup.callAll('kill');
        this.characters.callAll('kill');
        this.finishedItems.callAll('kill');

        let objectsToDestroy = [
            'levelCompleteText',
            'nextLevelLink',
            'scoreText',
            'nextLevelLinkButton'
        ];

        objectsToDestroy.forEach(function(objectName)
        {
            if (this[objectName]) {
                this[objectName].destroy();
            }
        }, this);

        this.gameOverBackground.alpha = 0;

        this.clearTimedEvents();

        this.globalAdditionalCostTiles = [];
        if (this.pathfinding)
        {
            this.pathfinding.easy_star.removeAllAdditionalPointCosts();
            this.pathfinding.easy_star.stopAvoidingAllAdditionalPoints();
        }
        if (this.easyStarSync)
        {
            this.easyStarSync.removeAllAdditionalPointCosts();
            this.easyStarSync.stopAvoidingAllAdditionalPoints();
        }

        this.destroyUserInterfaceButtons();

        this.clearingMap = false;
    }

    clearTimedEvents()
    {
        this.game.time.removeAll();
    }

    drawIndicators()
    {
        if (this.graphics)
        {
            this.graphics.destroy();
        }

        if (!this.game.device.desktop)
        {
            return;
        }

        if (this.pendingLevelCompleted)
        {
            return;
        }

        if (this.introductionRunning)
        {
            return;
        }

        let buttonsForEffect = ['pauseButton', 'sellTowerButton'];

        if (this.coinsSufficientToUpgradeCurrentTower())
        {
            buttonsForEffect.push('upgradeTowerButton');
        }

        let cancelIndicators = false;

        buttonsForEffect.forEach(function(name)
        {
            if (this[name]) {
                if (this[name].input.pointerOver()) {
                    this[name].alpha = .8;
                    cancelIndicators = true;
                } else {
                    this[name].alpha = .5;
                }
            }
        }, this);

        if (cancelIndicators)
        {
            return;
        }

        if (this.pauseButton.input.pointerOver())
        {
            this.pauseButton.alpha = .8;
            return;
        }
        else
        {
            this.pauseButton.alpha = .5;
        }

        if (this.towerInfoOpen)
        {
            return;
        }
        if (this.towerPlacementViewOpen)
        {
            return;
        }

        this.graphics = this.game.add.graphics(0, 0);

        let x = Math.floor((this.game.input.x + this.game.camera.x) / this.squareWidth) * this.squareWidth;
        let y = Math.floor((this.game.input.y + this.game.camera.y) / this.squareWidth) * this.squareWidth;

        let inappropriateColor = 0xFF8888;
        let notEnoughCoinsColor = 0xFFFF88;
        let upgradeColor = 0x33FFFF;
        let borderColor;
        let indicatorMessage = '';

        if (this.lives < 1)
        {
            borderColor = 0x000000;

            if (this.nathan) {
                indicatorMessage = 'Nathan has been captured.';
            } else {
                indicatorMessage = 'You were defeated.';
            }
        }
        else if (this.isTowerPlacementAppropriateAtPosition(x, y))
        {
            let cheapestTowerCost = this.getCheapestTowerCost();

            if (this.coins >= this.getCheapestTowerCost())
            {
                borderColor = 0x00FF00;
                indicatorMessage = 'Place tower here from ' + this.game.globals.currencyString + cheapestTowerCost;
            }
            else
            {
                borderColor = notEnoughCoinsColor;
                indicatorMessage = 'Need ' + this.game.globals.currencyString + cheapestTowerCost + ' for a tower.';
            }
        }
        else if (this.isTowerUpgradeAppropriateAtPosition(x, y))
        {
            if (this.coinsSufficientToUpgradeCurrentTower()) {
                borderColor = upgradeColor;
            } else {
                borderColor = notEnoughCoinsColor;
            }
            indicatorMessage = 'Click tower for options.';
        }
        else if (this.doesAttackerExistAtPosition(x, y))
        {
            borderColor = 0xFF8800;
            indicatorMessage = 'Target this attacker.';
        }
        else if (this.doesObstacleExistAtPosition(x, y))
        {
            borderColor = 0xFF8800;
            indicatorMessage = 'Target this obstacle.';
        }
        else
        {
            borderColor = inappropriateColor;
            indicatorMessage = '';
        }

        if (this.labelIndicatorMessage)
        {
            this.labelIndicatorMessage.setText(indicatorMessage);
        }

        this.graphics.lineStyle(2, borderColor, 1);
        this.graphics.drawRect(x, y, this.squareWidth, this.squareWidth);

        if (this.doesTowerExistAtPosition(x, y))
        {
            let tower = this.getTowerAtPosition(x, y);

            if (tower.weapon1)
            {
                this.graphics.lineStyle(2, 0x88FF88, 0.5);
                this.graphics.beginFill(0x88FF88, 0.2);
                this.graphics.drawCircle(tower.x, tower.y, tower.weapon1.rangeInPixels*2);
                this.graphics.endFill();

                if (tower.upgradable())
                {
                    this.graphics.lineStyle(2, upgradeColor, 0.5);
                    this.graphics.drawCircle(tower.x, tower.y, tower.calculateRangeInPixels(tower.grade+1)*2);
                    this.graphics.endFill();
                }
            }
        }
    }

    /**
     * Draw a force field with a supplied number of layers around a supplied sprite.
     *
     * @param {GameSprite} sprite
     * @param {int} number
     */
    drawForceFields(sprite, number)
    {
        if (this.forceFieldGraphics)
        {
            this.forceFieldGraphics.destroy();
        }

        this.forceFieldGraphics = this.game.add.graphics(0, 0);

        let minimumDiameter = 32;
        let diameterGap = 10;

        let lineAlpha = .4;
        let fillAlpha = .08;

        if (number >= 5)
        {
            this.forceFieldGraphics.lineStyle(2, 0xBBBBFF, lineAlpha);
            this.forceFieldGraphics.beginFill(0xCCCCFF, fillAlpha);
            this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, minimumDiameter + (diameterGap * 3));
            this.forceFieldGraphics.endFill();
        }

        if (number >= 4)
        {
            this.forceFieldGraphics.lineStyle(2, 0x9999FF, lineAlpha);
            this.forceFieldGraphics.beginFill(0xBBBBFF, fillAlpha);
            this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, minimumDiameter + (diameterGap * 2));
            this.forceFieldGraphics.endFill();
        }

        if (number >= 3)
        {
            this.forceFieldGraphics.lineStyle(2, 0x7777FF, lineAlpha);
            this.forceFieldGraphics.beginFill(0xBBBBFF, fillAlpha);
            this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, minimumDiameter + diameterGap);
            this.forceFieldGraphics.endFill();
        }

        if (number >= 2)
        {
            this.forceFieldGraphics.lineStyle(2, 0x5555FF, lineAlpha);
            this.forceFieldGraphics.beginFill(0xBBBBFF, fillAlpha);
            this.forceFieldGraphics.drawCircle(sprite.x, sprite.y, minimumDiameter);
            this.forceFieldGraphics.endFill();
        }
    }

    coinsSufficientForTowerPlacement()
    {
        return !(this.coins < window[this.towerSelected].cost);
    }

    coinsSufficientToUpgradeCurrentTower()
    {
        if (!this.currentTower  || typeof this.currentTower.getUpgradeCost !== 'function')
        {
            return false;
        }
        return !(this.coins < this.currentTower.getUpgradeCost());
    }

    cleanUp()
    {
        // Code based on an article at http://davidp.net/phaser-sprite-destroy/

        let aCleanup = [];

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

        let i = aCleanup.length - 1;
        while(i > -1)
        {
            let getItem = aCleanup[i];
            getItem.destroy();
            i--;
        }
    }

    lastWaveAttackerDispatched(waveNumber)
    {
        if (!waveNumber)
        {
            waveNumber = this.waveNumber;
        }
        this.allAttackersDispatchedForWaves.push(waveNumber);
    }

    /**
     * Have all attackers in a wave been defeated?
     *
     * @returns {boolean}
     */
    checkIfWaveHasBeenBeaten(waveNumber)
    {
        if (this.wavesBeaten.indexOf(waveNumber) !== -1)
        {
            return true;
        }

        if (this.allAttackersDispatchedForWaves.indexOf(waveNumber) === -1)
        {
            return false;
        }

        if (this.level.distinctWaves)
        {
            if (this.attackers.countLiving() >= 1)
            {
                return false;
            }
        }
        else
        {
            let anyLivingAttackersInWave = false;
            this.attackers.forEachAlive(function(attacker) {
                if (attacker.waveNumber === waveNumber)
                {
                    anyLivingAttackersInWave = true;
                }
            });

            if (anyLivingAttackersInWave)
            {
                return false;
            }
        }


        this.waveBeaten(waveNumber);

        return true;
    }

    waveBeaten(waveNumber)
    {
        this.wavesBeaten.push(waveNumber);

        if (this.totalWaves === waveNumber)
        {
            return;
        }

        if (this.level.distinctWaves)
        {
            let nextWaveNumber = waveNumber + 1;
            this.game.timerEvents.push(
                this.game.time.events.add(
                    Phaser.Timer.SECOND * 1.5,
                    this.startWave,
                    this,
                    nextWaveNumber
                ).autoDestroy = true
            );
        }

        this.obstacles.callAll('onWaveBeaten');
    }

    lastWaveDispatched()
    {
        this.allAttackersDispatched = true;
    }

    displayMessage(message)
    {
        this.labelMessage.setText(message);
        this.game.time.events.add(Phaser.Timer.SECOND * 6, this.clearMessage, this).autoDestroy = true;
    }

    clearMessage()
    {
        this.labelMessage.setText('');
    }

    initiateEasyStar()
    {
        let collisionLayer = this.getCollisionLayer();

        let tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);

        // Begin async pathfinding plugin instance

        this.pathfinding = this.game.plugins.add(Rendlesham.Pathfinding, collisionLayer.data, [-1], tile_dimensions);
        this.pathfinding.easy_star.setIterationsPerCalculation(1000);

        // End async pathfinding plugin instance

        // Begin sync instance
        this.easyStarSync = new EasyStar.js();

        let world_grid = collisionLayer.data;
        let acceptable_tiles = [-1];

        this.grid_dimensions = {row: world_grid.length, column: world_grid[0].length};

        let grid_indices = [];
        for (let grid_row = 0; grid_row < world_grid.length; grid_row += 1)
        {
            grid_indices[grid_row] = [];
            for (let grid_column = 0; grid_column < world_grid[grid_row].length; grid_column += 1)
            {
                grid_indices[grid_row][grid_column] = world_grid[grid_row][grid_column].index;
            }
        }

        this.easyStarSync.setGrid(grid_indices);
        this.easyStarSync.setAcceptableTiles(acceptable_tiles);
        this.easyStarSync.enableSync();
        // End sync instance
    }

    getCollisionLayer()
    {
        let collisionLayer;

        for (let i in this.map.layers)
        {
            if (this.map.layers.hasOwnProperty(i))
            {
                if (this.map.layers[i].name === 'collision')
                {
                    collisionLayer = this.map.layers[i];
                }
            }
        }

        return collisionLayer;
    }

    /**
     * Untarget all sprites.
     */
    untargetAll()
    {
        this.attackers.callAll('untarget');
        this.obstacles.callAll('untarget');
        this.noTarget();
    }

    toggleFullScreen()
    {
        if (this.game.scale.isFullScreen)
        {
            this.game.scale.stopFullScreen();
        }
        else
        {
            this.goFullScreen();
        }
    }

    scheduleAttackersWave(attackerClassName, waveNumber, s, duration, gap, startOffset)
    {
        if (!startOffset)
        {
            startOffset = 0;
        }

        let start = s + startOffset;
        let end = start + duration;

        let i;

        for (i = start; i < end; i += gap)
        {
            this.spawnAttackerDelayed(attackerClassName, i, waveNumber);
        }
    }

    generateSpawnAttackerPixelCoordinates()
    {
        let coordinates = this.translateGridCoordinatesToPixelCoordinates(
            this.level.entryXGrid,
            this.level.entryYGrid
        );
        let x = coordinates[0];
        let y = coordinates[1];

        if (this.level.entryXGrid >= 20)
        {
            x += this.squareWidth - 1;
            y += this.halfSquareWidth;
        }
        if (this.level.entryYGrid >= 10)
        {
            x += this.halfSquareWidth;
            y += this.squareWidth - 1;
        }

        return [x, y];
    }

    addItem(itemName)
    {
        try
        {
            if (!this.user.items)
            {
                this.user.items = {};
            }

            if (!this.user.items[itemName])
            {
                this.user.items[itemName] = 1;
            }
            else
            {
                this.user.items[itemName] ++;
            }

            this.save();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    hasItem(itemName)
    {
        return (
            this.user.hasOwnProperty('items')
            &&
            this.user.items.hasOwnProperty('itemName')
            &&
            this.user.items.hasOwnProperty('itemName') >= 1
        );
    }

    addGlobalAdditionalCostTile(x, y, coordinateType, cost)
    {
        if (!this.globalAdditionalCostTiles)
        {
            this.globalAdditionalCostTiles = [];
        }

        if (!cost)
        {
            cost = 9999;
        }

        if (coordinateType && coordinateType === 'pixels')
        {
            let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            x = gridCoordinates[0];
            y = gridCoordinates[1];
        }

        this.globalAdditionalCostTiles.push([
            x,
            y,
            cost
        ]);

        this.setAllAttackerPathNeedsRegenerating();
    }

    setAllAttackerPathNeedsRegenerating()
    {
        if (!this.level.canPlaceTowerOnPathway && !this.bully)
        {
            return false;
        }

        this.attackers.forEachAlive(function(attacker){
            attacker.pathNeedsRegenerating = true;
        });
    }

    addGlobalImpassablePoint(x, y, coordinateType)
    {
        if (coordinateType && coordinateType === 'pixels')
        {
            let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            x = gridCoordinates[0];
            y = gridCoordinates[1];
        }

        this.pathfinding.easy_star.avoidAdditionalPoint(x, y);
        this.easyStarSync.avoidAdditionalPoint(x, y);

        this.setAllAttackerPathNeedsRegenerating();
    }

    removeGlobalImpassablePoint(x, y)
    {
        this.pathfinding.easy_star.stopAvoidingAdditionalPoint(x, y);
        this.easyStarSync.stopAvoidingAdditionalPoint(x, y);

        this.setAllAttackerPathNeedsRegenerating();
    }

    wouldObstaclePlacementBlockPath(x, y, coordinateType)
    {
        if (!this.level.canPlaceTowerOnPathway)
        {
            return false;
        }

        if (coordinateType && coordinateType === 'pixels')
        {
            let gridCoordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
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

        return (this.game.wouldObstaclePlacementBlockPathResult === null);
    }

    wouldObstaclePlacementBlockPathCallbackHandler(path)
    {
        // Just game, not this.game
        game.wouldObstaclePlacementBlockPathResult = path;
    }

    getEntryXGrid()
    {
        return this.level.entryXGrid;
    }

    getEntryYGrid()
    {
        return this.level.entryYGrid;
    }

    getGoalXGrid()
    {
        if (!this.level.goalXGrid)
        {
            this.generateGoal();
        }
        return this.level.goalXGrid;
    }

    getGoalYGrid()
    {
        if (!this.level.goalXGrid)
        {
            this.generateGoal();
        }
        return this.level.goalYGrid;
    }

    generateGoal()
    {
        let gridX;
        let gridY;
        if (this.nathan)
        {
            gridX = this.nathan.gridX;
            gridY = this.nathan.gridY;
        }
        this.level.goalXGrid = gridX;
        this.level.goalYGrid = gridY;
    }

    countObstaclesWithCoinsValue()
    {
        let i = 0;
        this.obstacles.forEachAlive(function(obstacle){
            if (obstacle.coinsValue >= 1) {
                i++;
            }
        });
        return i;
    }

    setTarget(sprite)
    {
        this.game.target = sprite;
    }

    noTarget()
    {
        this.game.target = {};
    }

    addUserInterfaceButtons()
    {
        this.pauseButton = this.game.add.button(this.game.camera.width - 42, 7, 'pauseDark', this.openPauseScreen, this);
        this.pauseButton.fixedToCamera = true;
        this.pauseButton.inputEnabled = true;
        this.pauseButton.alpha = .5;
        this.pauseButton.onDownSound = this.sounds.metalClick;
    }

    destroyUserInterfaceButtons()
    {
        let buttonsToDestroy = ['pauseButton'];
        buttonsToDestroy.forEach(function(buttonName)
        {
            if (this[buttonName]) {
                this[buttonName].destroy();
            }
        }, this);
    }

    togglePauseScreen()
    {
        if (this.pauseScreenOpen)
        {
            this.closePauseScreen();
        }
        else
        {
            this.openPauseScreen();
        }
    }

    openPauseScreen()
    {
        if (this.pauseScreenOpen)
        {
            return false;
        }

        if (this.graphics)
        {
            this.graphics.destroy();
        }

        this.destroyAllForceFieldGraphics();

        this.closeTowerInfo(false);
        this.closeTowerPlacementView(false);
        this.game.kineticScrolling.stop();

        this.pauseScreenOpen = true;

        this.gameOverBackground.alpha = .5;

        this.addButtonTextLink('resume', 'Resume', 46, 'forestGreen', 0, this.game.height * .21, 'center', 'closePauseScreen');

        this.addButtonTextLink('restart', 'Restart Level', 46, 'forestGreen', 0, this.game.height * .46, 'center', 'restartLevelButtonClick');

        this.addButtonTextLink('exit', 'Exit', 46, 'forestGreen', 0, this.game.height * .71, 'center', 'goToTitleScreenButtonClick');

        this.destroyUserInterfaceButtons();

        // Slightly delay actual pausing as the fixedToCamera/cameraOffset stuff in addButtonTextLink() doesn't work when paused.
        this.game.timerEvents.push(
            this.game.time.events.add(
                Phaser.Timer.SECOND * 0.05,
                this.pause,
                this,
                false
            ).autoDestroy = true
        );

        return true;
    }

    closePauseScreen()
    {
        let buttonsToDestroy = ['resume', 'restart', 'exit'];

        buttonsToDestroy.forEach(function(name) {
            if (this[name]) {
                this[name].destroy();
            }
            if (this[name + 'Button']) {
                this[name + 'Button'].destroy();
            }
        }, this);

        this.gameOverBackground.alpha = 0;

        this.pauseScreenOpen = false;

        this.game.kineticScrolling.start();

        this.drawAllForceFieldGraphics();

        this.addUserInterfaceButtons();

        this.unpause();
    }

    restartLevelButtonClick()
    {
        this.unpause();
        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(this.game.globals.interStateBackgroundColor, this.game.globals.fadeOutOfStateMs, true);
        this.game.camera.onFadeComplete.add(this.restartLevel, this);
    }

    restartLevel()
    {
        if (this.stats.result !== 'completed')
        {
            this.stats.result = 'restart';
        }
        this.closePauseScreen();
        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelId,
            mode: this.mode
        };
        this.game.state.start('play', true, true, obj);
    }

    goToTitleScreenButtonClick()
    {
        if (this.stats.result !== 'completed')
        {
            this.stats.result = 'exit';
        }
        this.unpause();
        this.fadeOutToState('titleScreen');
    }

    getBully()
    {
        let bully;
        this.characters.forEachAlive(function(character) {
            if (character.constructor.name === 'Bully') {
                bully = character;
            }
        }, this);
        return bully;
    }

    openTowerInfo(tower, useTween = true)
    {
        if (this.towerInfoOpen)
        {
            this.closeTowerInfo();
        }

        this.towerInfoOpen = true;
        this.currentTower = tower;

        let buttonsToDestroy = ['upgradeTowerButton', 'sellTowerButton'];

        buttonsToDestroy.forEach(function(buttonName) {
            if (this[buttonName]) {
                this[buttonName].destroy();
            }
        }, this);

        let buttonDisplayScale = 1.5;

        if (tower.sellable())
        {
            this.sellTowerButton = this.game.add.button(tower.x , tower.y, 'poundDark', this.sellCurrentTower, this);
            this.sellTowerButton.inputEnabled = true;
            this.sellTowerButton.alpha = .5;
            this.sellTowerButton.anchor.set(0.5, 0.5);
            this.sellTowerButton.scale.setTo(buttonDisplayScale, buttonDisplayScale);
            this.sellTowerButton.x = tower.x - 39;

            this.sellTowerText = this.game.add.bitmapText(this.sellTowerButton.x, this.sellTowerButton.y, this.game.globals.bitmapFontName, this.game.globals.currencyString + this.currentTower.getSellValue(), 16);
            this.sellTowerText.x = this.sellTowerButton.x - (this.sellTowerText.width * .5);
            this.sellTowerText.y = this.sellTowerButton.y + (this.sellTowerButton.height * .5);
        }

        let upgradeTowerTextString = '';

        if (tower.upgradable())
        {
            this.upgradeTowerButton = this.game.add.button(tower.x, tower.y, 'upDark', this.upgradeCurrentTower, this);

            if (this.coinsSufficientToUpgradeCurrentTower())
            {
                this.upgradeTowerButton.inputEnabled = true;
            }
            else
            {
                this.upgradeTowerButton.inputEnabled = false;
                this.upgradeTowerButton.tint = 0x880000;
            }

            this.upgradeTowerButton.alpha = .5;
            this.upgradeTowerButton.anchor.set(0.5, 0.5);
            this.upgradeTowerButton.scale.setTo(buttonDisplayScale, buttonDisplayScale);

            this.labelIndicatorMessage.setText('Upgrade or sell tower.');

            upgradeTowerTextString = this.game.globals.currencyString + this.currentTower.getUpgradeCost();
        }
        else
        {
            this.upgradeTowerButton = this.game.add.button(tower.x, tower.y, 'maxDark', this.notPossible, this);
            this.upgradeTowerButton.inputEnabled = false;
            this.upgradeTowerButton.alpha = .5;
            this.upgradeTowerButton.anchor.set(0.5, 0.5);
            this.upgradeTowerButton.scale.setTo(buttonDisplayScale, buttonDisplayScale);

            this.labelIndicatorMessage.setText('Tower is at maximum grade.');
        }
        this.upgradeTowerButton.x = tower.x + 39;
        this.upgradeTowerText = this.game.add.bitmapText(this.upgradeTowerButton.x, this.upgradeTowerButton.y, this.game.globals.bitmapFontName, upgradeTowerTextString, 16);

        if (this.upgradeTowerText)
        {
            this.upgradeTowerText.x = this.upgradeTowerButton.x - (this.upgradeTowerText.width * .5);
            this.upgradeTowerText.y = this.upgradeTowerButton.y + (this.upgradeTowerButton.height * .5);
        }

        if (tower.weapon1)
        {

            this.towerInfoOpenRangeGraphics = this.game.add.graphics(0, 0);

            this.towerInfoOpenRangeGraphics.lineStyle(2, 0x88FF88, 0.5);
            this.towerInfoOpenRangeGraphics.beginFill(0x88FF88, 0.2);
            this.towerInfoOpenRangeGraphics.drawCircle(tower.x, tower.y, tower.weapon1.rangeInPixels*2);
            this.towerInfoOpenRangeGraphics.endFill();

            if (tower.upgradable())
            {
                this.towerInfoOpenRangeGraphics.lineStyle(2, 0x33FFFF, 0.5);
                this.towerInfoOpenRangeGraphics.drawCircle(tower.x, tower.y, tower.weapon1.rangeInPixels*2);
                this.towerInfoOpenRangeGraphics.endFill();
            }
        }

        if (useTween)
        {
            this.upgradeTowerButton.scale.setTo(this.quickTweenFromScale, this.quickTweenFromScale);
            this.game.add.tween(this.upgradeTowerButton.scale).to({ x: buttonDisplayScale, y: buttonDisplayScale }, this.quickTweenMs, Phaser.Easing.Back.Out, true, 0);
            this.sellTowerButton.scale.setTo(this.quickTweenFromScale, this.quickTweenFromScale);
            this.game.add.tween(this.sellTowerButton.scale).to({ x: buttonDisplayScale, y: buttonDisplayScale }, this.quickTweenMs, Phaser.Easing.Back.Out, true, 0);
        }
        else
        {
            this.upgradeTowerButton.scale.setTo(buttonDisplayScale, buttonDisplayScale);
            this.sellTowerButton.scale.setTo(buttonDisplayScale, buttonDisplayScale);
        }
    }

    closeTowerInfo(useTween = true)
    {
        this.currentTower = {};

        let buttonsToDestroy = ['upgradeTowerButton', 'sellTowerButton'];

        if (useTween)
        {
            this.tweenOutAndDestroy(buttonsToDestroy);
        }
        else
        {
            buttonsToDestroy.forEach(function(buttonName)
            {
                if (this[buttonName]) {
                    this[buttonName].destroy();
                }
            }, this);
        }

        let textToDestroy = ['upgradeTowerText', 'sellTowerText'];

        textToDestroy.forEach(function(textName) {
            if (this[textName]) {
                this[textName].destroy();
            }
        }, this);

        if (this.towerInfoOpenRangeGraphics)
        {
            this.towerInfoOpenRangeGraphics.destroy();
        }

        this.labelIndicatorMessage.setText('');

        this.towerInfoOpen = false;
    }

    sellCurrentTower()
    {
        this.currentTower.sell();
        this.playSound('handleCoins');
        this.closeTowerInfo();
    }

    upgradeCurrentTower()
    {
        if (this.coinsSufficientToUpgradeCurrentTower())
        {
            this.currentTower.upgradeAtCost();
            this.playSound('metalClick');
        }
        this.refreshTowerInfo();
    }

    refreshTowerInfo(useTween = true)
    {
        let tower = this.currentTower;
        this.closeTowerInfo(false);
        this.openTowerInfo(tower, useTween);
    }

    refreshTowerInfoIfOpen()
    {
        if (this.towerInfoOpen)
        {
            this.refreshTowerInfo(false);
        }
    }

    openTowerPlacementView(x, y, coordinateType, useTween = true)
    {
        if (this.towerPlacementViewOpen)
        {
            this.closeTowerPlacementView();
        }

        this.towerPlacementViewOpen = true;

        let gridX = x;
        let gridY = y;

        if (coordinateType && coordinateType === 'grid')
        {
            let coordinates = this.translateGridCoordinatesToPixelCoordinates(x, y);
            x = coordinates[0];
            y = coordinates[1];
        }
        else
        {
            let coordinates = this.translatePixelCoordinatesToGridCoordinates(x, y);
            gridX = coordinates[0];
            gridY = coordinates[1];
        }

        this.currentGridPosition = {
            x: x,
            y: y,
            gridX: gridX,
            gridY: gridY
        };

        this.towerPlacementViewGraphics = this.game.add.graphics(0, 0);

        this.towerPlacementViewGraphics.lineStyle(2, 0x00FF00, 1);
        this.towerPlacementViewGraphics.drawRect(x - this.squareWidth*.5, y - this.squareWidth*.5, this.squareWidth, this.squareWidth);

        let buttonsToDestroy = [];

        buttonsToDestroy.forEach(function(buttonName) {
            if (this[buttonName])
            {
                this[buttonName].destroy();
            }
        }, this);

        let towerClassNames = this.getTowerClassNames();

        let backdropButtonWidth = 52;
        let halfBackdropButtonWidth = backdropButtonWidth * .5;
        let buttonGap = 2;
        let xOffset = -(towerClassNames.length-1) * (halfBackdropButtonWidth + (buttonGap * .5));
        let yOffset = -halfBackdropButtonWidth;

        if (this.currentGridPosition.x + xOffset < this.game.camera.x)
        {
            xOffset = -this.currentGridPosition.x + this.game.camera.x + halfBackdropButtonWidth;
        }
        if (this.currentGridPosition.x + (halfBackdropButtonWidth * towerClassNames.length) > (this.game.camera.x + this.game.camera.width + 5))
        {
            xOffset = -(backdropButtonWidth+buttonGap) * (towerClassNames.length-1);
        }

        towerClassNames.forEach(function(towerClassName) {

            let backdropButtonName = towerClassName + 'TowerButtonBackdrop';
            let buttonName = towerClassName + 'TowerButton';
            let textInfoName = towerClassName + 'TowerButtonInfo';

            let functionName = 'placeTowerAtCost';

            // Backdrop button start
            this[backdropButtonName] = this.game.add.button(
                this.currentGridPosition.x + xOffset,
                this.currentGridPosition.y + yOffset,
                'blankDark',
                this[functionName],
                this
            );
            this[backdropButtonName].towerClassName = towerClassName;
            this[backdropButtonName].inputEnabled = true;
            this[backdropButtonName].alpha = .5;
            this[backdropButtonName].anchor.set(0.5, 0.5);

            if (useTween)
            {
                this[backdropButtonName].scale.setTo(this.quickTweenFromScale, this.quickTweenFromScale);
                this.game.add.tween(this[backdropButtonName].scale).to({ x: 1.5, y: 1.5 }, this.quickTweenMs, Phaser.Easing.Back.Out, true, 0);
            }
            else
            {
                this[backdropButtonName].scale.setTo(1.5, 1.5);
            }

            // Backdrop button end

            // Sprite-based button and cost text start
            this[buttonName] = this.game.add.button(
                this.currentGridPosition.x + xOffset,
                this.currentGridPosition.y + yOffset,
                towerClassName + 'SpriteSheet',
                this[functionName],
                this
            );
            this[buttonName].towerClassName = towerClassName;
            this[buttonName].inputEnabled = true;
            this[buttonName].alpha = .6;
            this[buttonName].anchor.set(.5, .5);

            // Scale to .75 initially to allow positioning of textInfoName based on intended size.
            // Will rescale to this.quickTweenFromScale, then tween to .75 a few lines down from here
            this[buttonName].scale.setTo(.75, .75);

            let cost = window[towerClassName].cost;

            this[textInfoName] = this.game.add.bitmapText(
                this[buttonName].x,
                this[buttonName].y  + yOffset + (this[buttonName].height * .7),
                this.game.globals.bitmapFontName,
                this.game.globals.currencyString + cost,
                16
            );

            this[textInfoName].x = this[textInfoName].x - (this[textInfoName].width * .5);

            if (useTween)
            {
                this[buttonName].scale.setTo(this.quickTweenFromScale, this.quickTweenFromScale);
                this.game.add.tween(this[buttonName].scale).to({ x: .75, y: .75 }, this.quickTweenMs, Phaser.Easing.Back.Out, true, 0);
            }
            else
            {
                this[buttonName].scale.setTo(.75, .75);
            }
            // Sprite-based button and cost text end

            if (this.coins < cost)
            {
                this[textInfoName].tint = 0xFF0000;
                this[buttonName].inputEnabled = false;
                this[backdropButtonName].inputEnabled = false;
            }

            xOffset += backdropButtonWidth + buttonGap;

        }, this);

        this.labelIndicatorMessage.setText('Select tower to place here.');
    }

    closeTowerPlacementView(useTween = true)
    {
        this.currentGridPosition = {};

        let buttonsToDestroy = [];

        let towerClassNames = this.getTowerClassNames();

        towerClassNames.forEach(function(towerClassName)
        {
            buttonsToDestroy.push(towerClassName + 'TowerButtonBackdrop');
            buttonsToDestroy.push(towerClassName + 'TowerButton');
        });

        if (useTween)
        {
            this.tweenOutAndDestroy(buttonsToDestroy);
        }
        else
        {
            buttonsToDestroy.forEach(function(buttonName)
            {
                if (this[buttonName])
                {
                    this[buttonName].destroy();
                }
            }, this);
        }

        let textToDestroy = [];

        towerClassNames.forEach(function(towerClassName)
        {
            textToDestroy.push(towerClassName + 'TowerButtonInfo');
        });

        textToDestroy.forEach(function(textName)
        {
            if (this[textName]) {
                this[textName].destroy();
            }
        }, this);

        if (this.towerPlacementViewGraphics)
        {
            this.towerPlacementViewGraphics.destroy();
        }

        this.labelIndicatorMessage.setText('');

        this.towerPlacementViewOpen = false;
    }

    refreshTowerPlacementView(useTween = true)
    {
        if (!this.currentGridPosition || !this.currentGridPosition.x || !this.currentGridPosition.y)
        {
            return false;
        }

        let x = this.currentGridPosition.x;
        let y = this.currentGridPosition.y;

        this.closeTowerPlacementView(false);
        this.openTowerPlacementView(x, y, 'pixels', useTween);

        return true;
    }

    refreshTowerPlacementViewIfOpen()
    {
        if (this.towerPlacementViewOpen)
        {
            this.refreshTowerPlacementView(false);
        }
    }

    updateTowerPlacementView()
    {
        this.getTowerClassNames().forEach(function(towerClassName) {
            let buttonName = towerClassName + 'TowerButton';
            let backdropButtonName = towerClassName + 'TowerButtonBackdrop';
            if (
                this[buttonName] && this[buttonName].input.pointerOver()
                ||
                this[backdropButtonName] && this[backdropButtonName].input.pointerOver()
            ) {
                this[backdropButtonName].alpha = .8;
            }
            else
            {
                this[backdropButtonName].alpha = .5;
            }
        }, this);
    }

    /**
     * Tween to zero scale and then destroy each element in an array of supplied objects.
     *
     * @param {Array} objects
     */
    tweenOutAndDestroy(objects)
    {
        objects.forEach(function(objectName)
        {
            if (!this.hasOwnProperty(objectName))
            {
                throw {
                    'code': 20001,
                    'description': 'Object ' + objectName + ' not found. '
                };
            }

            if (!this[objectName].hasOwnProperty('scale'))
            {
                throw {
                    'code': 20002,
                    'description': 'Object ' + objectName + ' does not have scale property. '
                };
            }

            // Tween to zero scale
            this.game.add.tween(
                this[objectName].scale
            ).to(
                {
                    x: 0,
                    y: 0
                },
                this.quickTweenMs,
                Phaser.Easing.Back.Out,
                true,
                0
            );

            // Destroy at same time tween ends
            this.game.time.events.add(
                this.quickTweenMs,
                function () {
                    this[objectName].destroy()
                },
                this
            ).autoDestroy = true;

        }, this);
    }

    /**
     * Place a tower at the currently selected grid position, at cost.
     *
     * @param {Phaser.Button} buttonClicked
     * @returns {boolean}
     */
    placeTowerAtCost(buttonClicked)
    {
        if (typeof buttonClicked !== 'object')
        {
            throw {
                'code': 20003,
                'description': 'Type of buttonClicked is not an object. '
            };
        }

        if (!buttonClicked.hasOwnProperty('towerClassName'))
        {
            throw {
                'code': 20004,
                'description': 'Button clicked missing towerClassName property. '
            };
        }

        let towerClassName = buttonClicked.towerClassName;

        let availableTowerClassNames = this.getTowerClassNames();

        if (availableTowerClassNames.indexOf(towerClassName) === -1)
        {
            throw {
                'code': 20005,
                'description': 'The towerClassName ' + towerClassName + ' is not available. '
            };
        }

        this.towerSelected = towerClassName;

        let cost = window[this.towerSelected].cost;

        if (!this.coinsSufficientForTowerPlacement())
        {
            return false;
        }

        let x = this.currentGridPosition.x;
        let y = this.currentGridPosition.y;

        if (!this.isTowerPlacementAppropriateAtPosition(x, y))
        {
            return false;
        }

        if (this.spawnTower(this.towerSelected, x, y))
        {
            this.changeCoins(-cost, x, y);
            this.addTowerClassUsed(towerClassName, x, y);
        }

        this.closeTowerPlacementView();

        return true;
    }

    getCheapestTowerCost()
    {
        let towerClassNames = this.getTowerClassNames();
        let cheapestTowerCost = 9999;

        towerClassNames.forEach(function(towerClassName) {
            if (window[towerClassName].cost < cheapestTowerCost)
            {
                cheapestTowerCost = window[towerClassName].cost;
            }
        });

        return cheapestTowerCost;
    }

    getMidPointBetweenSprites(spriteA, spriteB)
    {
        let x = Math.round((spriteA.body.x + spriteB.body.x) / 2);
        let y = Math.round((spriteA.body.y + spriteB.body.y) / 2);
        let angle = Math.atan2(spriteB.body.y - spriteA.body.y, spriteB.body.x - spriteA.body.x ) * (180/Math.PI);
        return {
            x: x,
            y: y,
            angle: angle
        }
    }

    addTowerClassUsed(towerClassName, notificationX, notificationY)
    {
        if (this.towerClassesUsed.indexOf(towerClassName) === -1)
        {
            this.towerClassesUsed.push(towerClassName);
            let additionalTowerClassScoreBonus = 50 * this.towerClassesUsed.length;
            this.changeScore(additionalTowerClassScoreBonus, notificationX, notificationY);
        }
    }

    /**
     * Generate wave information for a supplied waveNumber.
     *
     * @param waveNumber
     * @returns {boolean}
     */
    generateWave(waveNumber)
    {
        if (waveNumber <= this.initialWavesCount)
        {
            return false;
        }

        let sourceWaveNumber = (waveNumber % this.initialWavesCount) || this.initialWavesCount;

        let difficultyMultiplier = Math.floor(waveNumber / this.initialWavesCount) + 1;

        let sourceWave = this.level.waveInfo['wave' + sourceWaveNumber];

        let generatedWave = {
            duration: sourceWave.duration * difficultyMultiplier,
            attacks: []
        };

        if (sourceWave.attacks)
        {
            sourceWave.attacks.forEach(function(attack)
            {
                let delay = attack.delay;

                if (attack.delay >= 3)
                {
                    delay *= difficultyMultiplier;
                }

                let generatedAttack = {
                    className: attack.className,
                    duration: attack.duration * difficultyMultiplier,
                    gap: attack.gap,
                    delay: delay
                };

                generatedWave.attacks.push(generatedAttack);
            });
        }

        this.level.waveInfo['wave' + waveNumber] = generatedWave;

        return true;
    }

    getBulletsAlive()
    {
        let bullets = [];
        this.towers.forEach(function(tower)
        {
            if (tower.weapon1)
            {
                tower.weapon1.bullets.forEachAlive(function (bullet)
                {
                    bullets.push(bullet);
                });
            }
        }, this);
        return bullets;
    }

    calculateCompletionStars()
    {
        if (this.hasCheated)
        {
            return 0;
        }
        if (typeof this.level.calculateCompletionStars === 'function')
        {
            return this.level.calculateCompletionStars();
        }
        let stars = 1;
        if (this.lives === this.level.startingLives)
        {
            stars ++;
        }
        if (this.countObstaclesWithCoinsValue() <= this.startingObstaclesWithCoinsValue * .4)
        {
            stars ++;
        }
        return stars;
    }

    /**
     * @param waveNumber
     * @returns {number}
     */
    calculateFirepowerAtWave(waveNumber)
    {
        let firepower = this.level.startingCoins || 0;
        let i = 0;
        for (let wave in this.level.waveInfo)
        {
            i++;
            if (i >= waveNumber)
            {
                break;
            }
            if (this.level.waveInfo[wave].attacks)
            {
                this.level.waveInfo[wave].attacks.forEach(function(attack)
                {
                    let coinsValue = window[attack.className].coinsValue || 5;
                    let quantity = Math.floor(attack.duration / attack.gap);
                    firepower += (coinsValue * quantity);
                });
            }
        }
        return firepower;
    }

    suggestAttackProperties(waveNumber, attackerClassName)
    {
        let firepower = this.calculateFirepowerAtWave(waveNumber);
        let attackerHealth = window[attackerClassName].defaultHealth * this.calculateWaveHealthModifier(waveNumber);
        // TODO
    }

    calculateWaveHealthModifier(waveNumber)
    {
        let modifier;
        let x = waveNumber - 1;
        if (this.level.hasOwnProperty('waveHealthCubicA'))
        {
            let a = this.level.waveHealthCubicA;
            let b = this.level.waveHealthCubicB || 0;
            let c = this.level.waveHealthCubicC || 0;
            let d = this.level.waveHealthCubicD || 1;
            modifier = Math.pow((a * x), 3) + Math.pow((b * x), 2) + (c * x) + d;
        }
        else if (this.level.hasOwnProperty('waveHealthQuadraticA'))
        {
            let a = this.level.waveHealthQuadraticA;
            let b = this.level.waveHealthQuadraticB || 0;
            let c = this.level.waveHealthQuadraticC || 1;
            modifier = Math.pow((a * x), 2) + (b * x) + c;
        }
        else
        {
            let waveHealthModifier = this.level.waveHealthModifier || .2;
            modifier =  (1 - waveHealthModifier) + (waveNumber * waveHealthModifier);
        }
        return modifier;
    }

    keyPress(character)
    {
        this.keyInput += character;
        this.checkForCode();
    }

    checkForCode()
    {
        let lastSix = this.keyInput.substr(this.keyInput.length - 6);
        switch (lastSix)
        {
            case '528572':
                this.changeCoins(9999);
                this.cheated();
                break;
            case '529313':
                this.changeLives(99);
                this.cheated();
                break;
            default:
                // Go to wave
                if (this.level.distinctWaves && lastSix > 198000 && lastSix <= (198000 + this.totalWaves))
                {
                    let goToWaveNumber = parseInt(lastSix.substr(lastSix.length - 2));
                    this.cheated();
                    this.clearTimedEvents();
                    this.attackers.callAll('vanish');
                    this.wavesStarted = [];
                    this.startWave(goToWaveNumber, false);
                }
        }
    }

    cheated()
    {
        this.hasCheated = true;
        this.labelScore.tint = 0xCC3333;
    }

    toggleFastForward()
    {
        if (this.game.time.slowMotion === 1)
        {
            this.game.fastForwardMode = true;
            this.game.time.slowMotion = 1/3;
            this.game.time.desiredFps = 20;
        }
        else
        {
            this.game.fastForwardMode = false;
            this.game.time.slowMotion = 1;
            this.game.time.desiredFps = 60;
        }

        // The fireRate property of weapons needs updating for all towers.
        this.towers.callAll('calculateSpecs');
    }

    shutdown()
    {
        this.handleStats();
        this.save();
    }

    canScroll()
    {
        return (this.level.hasOwnProperty('mapScroll') && this.level.mapScroll === true) ;
    }

    /*
    handleDrag()
    {
        if (!this.canScroll())
        {
            return false;
        }

        // Based on forum post at http://www.html5gamedevs.com/topic/9814-move-camera-by-dragging-the-world-floor/
        if (this.game.input.activePointer.isDown)
        {
            if (this.game.origDragPoint)
            {
                // move the camera by the amount the mouse has moved since last update
                this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
            }
            // set new drag origin to current position
            this.game.origDragPoint = this.game.input.activePointer.position.clone();
        }
        else
        {
            this.game.origDragPoint = null;
        }

        return true;
    }

    isDrag() {
        // Based on forum post at http://www.html5gamedevs.com/topic/7879-how-to-differentiate-between-click-and-drag/
        let distanceFromLastUp = Phaser.Math.distance(
            this.game.input.activePointer.positionDown.x,
            this.game.input.activePointer.positionDown.y,
            this.game.input.activePointer.x,
            this.game.input.activePointer.y
        );
        return (distanceFromLastUp !== 0);
    }
    */

    introductionComplete()
    {
        this.game.camera.follow(null);
        if (this.reco)
        {
            this.reco.die();
        }
        this.introductionRunning = false;
        this.initiateLabels();
        this.addUserInterfaceButtons();
        this.scheduleLevelEvents();
        this.initiateStats();
    }

    destroyAllForceFieldGraphics()
    {
        if (this.forceFieldGraphics)
        {
            this.forceFieldGraphics.destroy();
        }
    }

    drawAllForceFieldGraphics()
    {
        if (this.nathan)
        {
            this.nathan.drawForceFields();
        }
    }

    levelToRightAndBackIntroduction()
    {
        let offset = this.game.camera.width * .25;
        this.reco = new Reco(
            game,
            offset,
            (this.map.heightInPixels * .5) - this.halfSquareWidth
        );
        this.characters.add(this.reco);

        this.game.camera.follow(this.reco, Phaser.Camera.FOLLOW_LOCKON, .1, 0);

        let leftToRightTween = this.game.add.tween(this.reco).to(
            {
                x: this.game.world.width - offset
            },
            3000,
            Phaser.Easing.Linear.None
        );
        let rightToLeftTween = this.game.add.tween(this.reco).to(
            {
                x: offset
            },
            3000,
            Phaser.Easing.Linear.None
        );
        rightToLeftTween.onComplete.add(
            this.introductionComplete,
            this
        );
        leftToRightTween.chain(rightToLeftTween);
        leftToRightTween.start();
    }

    handleStats()
    {
        // Do nothing with stats if cheated
        if (this.hasCheated)
        {
            return false;
        }

        // Remove waves not reached and values unchanged from default
        for (let i = 1; i <= this.totalWaves; i++)
        {
            if (i > this.waveNumber)
            {
                delete this.stats['wave' + i];
                continue;
            }

            if (this.stats['wave' + i].lives === this.statsDefaults.lives)
            {
                delete this.stats['wave' + i].lives;
            }
            if (this.stats['wave' + i].lowestStepsToGoal === this.statsDefaults.lowestStepsToGoal)
            {
                delete this.stats['wave' + i].lowestStepsToGoal;
            }
            if (this.stats['wave' + i].furthestAirAdvancement === this.statsDefaults.furthestAirAdvancement)
            {
                delete this.stats['wave' + i].furthestAirAdvancement;
            }
        }

        // AJAX request to API which records stats. Fire and forget.
        $.ajax({
            url: this.game.globals.apiUrl + 'api.php',
            method: 'POST',
            data: {
                stats: this.stats
            },
            dataType: 'jsonp'
        });

    }
}
