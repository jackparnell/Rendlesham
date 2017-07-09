class Zone extends GameState
{
    preload()
    {
        this.backgrounds = game.add.group();
        this.name = 'rendlesham';
        this.linkBackgrounds = game.add.group();
        this.texts = game.add.group();

        this.loadMainFiles();
    }

    init(zoneName)
    {
        this.zoneName = zoneName || 'EAST_ANGLIA';

        this.zone = ZONE_INFO[zoneName];

        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        this.game.kineticScrolling.configure({
            kineticMovement: false,
            verticalScroll: true,
            verticalWheel: true
        });

        this.keyInput = '';
    }

    create()
    {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop === false)
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.zoneMap = this.game.add.tileSprite(0, 0, 1400, 700, this.zone.ZONE_BACKGROUND_FILENAME);
        this.backgrounds.add(this.zoneMap);

        this.game.world.setBounds(0, 0, this.zoneMap.width, this.zoneMap.height);

        this.loadUser();
        this.checkUser();

        this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

        this.levels = {
            1: {
                x: game.width * .1,
                y: game.height * .15
            },
            2: {
                x: game.width * .3,
                y: game.height * .2
            },
            3: {
                x: game.width * .5,
                y: game.height * .175
            },
            4: {
                x: game.width * .7,
                y: game.height * .225
            },
            5: {
                x: game.width * .85,
                y: game.height * .45
            },
            6: {
                x: game.width * .7,
                y: game.height * .55
            },
            7: {
                x: game.width * .525,
                y: game.height * .425
            },
            8: {
                x: game.width * .375,
                y: game.height * .6
            },
            9: {
                x: game.width * .25,
                y: game.height * .7
            },
            10: {
                x: game.width * .18,
                y: game.height * .95
            },
            11: {
                x: game.width * .05,
                y: game.height * .975
            },
            12: {
                x: game.width * .275,
                y: game.height * 1.15
            },
            13: {
                x: game.width * .45,
                y: game.height * 1.15
            },
            14: {
                x: game.width * .6,
                y: game.height * 1.25
            },
            15: {
                x: game.width * .725,
                y: game.height * 1.2
            },
            16: {
                x: game.width * .85,
                y: game.height * 1.05
            }
            /*
             ,
             17: {
             x: game.width * .925,
             y: game.height * 1.3
             }
             */
        };

        this.lastLevel = Object.keys(this.zone.LEVEL_ORDERING).length;

        this.drawLinesBetweenLevels();

        for (let i = 1; i <= this.lastLevel; i++)
        {
            this['level' + i + 'Button'] = game.add.button(
                this.levels[i].x,
                this.levels[i].y,
                this.zone.LEVEL_BUTTON_GRAPHIC,
                this.clickLevelButton,
                this
            );

            this['level' + i + 'Button'].levelNumber = i;
            this['level' + i + 'Button'].levelName = ZONE_INFO[this.zoneName].LEVEL_ORDERING[i];

            if (!this.isLevelUnlocked(i))
            {
                this['level' + i + 'Button'].tint = 0x333333;
                this['level' + i + 'Button'].input.useHandCursor = false;
            }

            this.writeLevelText(i);
            this.addLevelStars(i);
        }

        this.addButtonTextLink('nextZoneLink', 'Next', 20, 'smallDark', 10, game.camera.height - 40, 'right', 'nextZone');

        this.titleText = game.add.bitmapText(500, game.height * .01, bitmapFontName, this.zone.TITLE, 28);
        this.titleText.x = (game.width * .5) - (this.titleText.width * .5);
        this.titleText.alpha = .5;

        if (this.user.zones && this.user.zones[this.zoneName])
        {
            this.game.camera.x = this.user.zones[this.zoneName].cameraX || 0;
            this.game.camera.y = this.user.zones[this.zoneName].cameraY || 0;
        }
        else
        {
            if (!this.user.zones)
            {
                this.user.zones = {};
            }
            if (!this.user.zones[this.zoneName])
            {
                this.user.zones[this.zoneName] = {};
            }
        }

        // Capturing of code entry
        this.key0 = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        this.key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        this.key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        this.key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        this.key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
        this.key7 = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
        this.key8 = game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
        this.key9 = game.input.keyboard.addKey(Phaser.Keyboard.NINE);
        for (let i = 0; i <= 9; ++i)
        {
            this['key' + i].onDown.add(this.keyPress, this);
        }


        this.gameOverBackground = this.game.add.tileSprite(0, 0, game.camera.width, game.camera.height, 'gameOverBackground');
        this.gameOverBackground.fixedToCamera = true;
        this.gameOverBackground.alpha = 0;

        this.setupSounds();

        this.game.kineticScrolling.start();
    }

    shutdown()
    {
        this.user.zones[this.zoneName].cameraX = game.camera.x;
        this.user.zones[this.zoneName].cameraY = game.camera.y;
        this.save();
    }

    clickLevelButton(levelButton)
    {
        let levelNumber = levelButton.levelNumber;

        if (!this.isLevelUnlocked(levelNumber))
        {
            return false;
        }

        game.state.start('levelOptions', true, true, levelNumber, this.zoneName);
    }

    isLevelUnlocked(levelNumber)
    {
        if (levelNumber === 1)
        {
            return true;
        }
        if (this.user.cheats && this.user.cheats.unlockAllLevels)
        {
            return true;
        }
        let level = this.getLevelFromZoneAndNumber(this.zoneName, levelNumber);
        return (level && level.hasOwnProperty('previousLevelName') && this.hasUserCompletedLevel(level.previousLevelName));
    }

    hasUserCompletedLevel(levelName)
    {
        let completed = false;

        let modes = ['classic', 'epic', 'endless'];

        for (let i = 0; i < modes.length; i++) {
            if (this.user.levelCompletions[modes[i]][levelName]) {
                completed = true;
            }
        }

        let levelNumber = this.getLevelNumberFromZoneAndName(this.zoneName, levelName);
        if (this.zoneName === 'EAST_ANGLIA' && this.user.levelsComplete[levelNumber]) {
            return true;
        }

        return completed;
    }

    writeLevelText(levelNumber)
    {
        let x = this.levels[levelNumber].x + 16;
        let y = this.levels[levelNumber].y - 19;

        this['level' + levelNumber + 'Text'] = game.add.bitmapText(
            x,
            y,
            bitmapFontName,
            'Level ' + levelNumber,
            18
        );
        this['level' + levelNumber + 'Text'].x = x - (this['level' + levelNumber + 'Text'].width * .5);
    }

    addLevelStars(levelNumber)
    {
        if (!this.isLevelUnlocked(levelNumber)) {
            return;
        }

        let levelName = ZONE_INFO[this.zoneName].LEVEL_ORDERING[levelNumber];

        let stars = this.user.levelStars[levelName] || 0;

        let x = this.levels[levelNumber].x - 13;
        let y = this.levels[levelNumber].y + 35;

        let spriteName;

        for (let i = 1; i <= 3; i++)
        {

            if (i <= stars)
            {
                spriteName = 'starYellow';
            }
            else
            {
                spriteName = 'starCharcoal';
            }

            let star = game.add.sprite(x, y, spriteName);
            star.scale.setTo(.1, .1);

            x += 20;
        }
    }

    drawLinesBetweenLevels()
    {
        let graphics = game.add.graphics(0, 0);

        graphics.lineStyle(3, 0x886666, 1);

        for (let i = 1; i <= this.lastLevel; i++)
        {
            let level = this.getLevelFromZoneAndNumber(this.zoneName, i);

            if (level && level.hasOwnProperty('previousLevelName'))
            {
                let previousLevelNumber = this.getLevelNumberFromZoneAndName(this.zoneName, level.previousLevelName);

                if (previousLevelNumber)
                {
                    let startX = this.levels[i].x + 16;
                    let startY = this.levels[i].y + 16;

                    graphics.moveTo(
                        Math.round(startX),
                        Math.round(startY)
                    );

                    let finishX = this.levels[previousLevelNumber].x + 16;
                    let finishY = this.levels[previousLevelNumber].y + 16;

                    graphics.lineTo(
                        Math.round(finishX),
                        Math.round(finishY)
                    );
                }
            }
        }
    }

    nextZone()
    {
        game.state.start('zone', true, true, this.zone.NEXT_ZONE_NAME);
    }

    keyPress(key)
    {
        let character = String.fromCharCode(key.keyCode);
        this.keyInput += character;
        this.checkForCode();
    }

    checkForCode()
    {
        let lastFour = this.keyInput.substr(this.keyInput.length - 4);
        switch (lastFour)
        {
            case '1980':
                this.unlockAllLevels();
                break;
            case '2017':
                this.clearCheats();
                break;
        }
    }

    unlockAllLevels()
    {
        this.addCheat('unlockAllLevels', true);
    }

    addCheat(key, value)
    {
        if (!this.user.cheats)
        {
            this.user.cheats = {};
        }
        this.user.cheats[key] = value;
        this.playSound('nes13');
        console.log('Cheat: ' + key + ': ' + value + ' ');

        this.fadeToRestartState(1.5);
    }

    clearCheats()
    {
        this.user.cheats = {};
        this.fadeToRestartState(1.5);
    }

    fadeToRestartState(seconds)
    {
        game.add.tween(
            this.gameOverBackground,
            this.game
        )
        .to(
            { alpha: 1 },
            Phaser.Timer.SECOND * seconds,
            Phaser.Easing.Linear.None,
            true
        );
        game.time.events.add(
            Phaser.Timer.SECOND * seconds,
            this.restartState,
            this,
            ''
        ).autoDestroy = true
    }

    restartState()
    {
        game.state.start('zone', true, true, this.zoneName);
    }
}