class Zone extends GameState
{
    preload()
    {
        super.preload();
    }

    init(zoneName = 'EAST_ANGLIA')
    {
        if (ZONE_INFO.hasOwnProperty(zoneName))
        {
            this.zone = ZONE_INFO[zoneName];
        }
        else
        {
            throw {
                'code': 85001,
                'description': 'Zone ' + zoneName + ' invalid. '
            };
        }

        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        this.game.kineticScrolling.configure({
            kineticMovement: false,
            verticalScroll: true,
            verticalWheel: false,
            horizontalWheel: false
        });

        this.keyInput = '';
    }

    create()
    {
        super.create();
        this.zoneMap = this.game.add.tileSprite(0, 0, 1400, 700, this.zone.ZONE_BACKGROUND_FILENAME);
        this.game.backgrounds.add(this.zoneMap);

        this.game.world.setBounds(0, 0, this.zoneMap.width, this.zoneMap.height);

        this.loadUser();
        this.checkUser();

        this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

        this.levels = {
            1: {
                x: this.game.width * .1,
                y: this.game.height * .15
            },
            2: {
                x: this.game.width * .3,
                y: this.game.height * .2
            },
            3: {
                x: this.game.width * .5,
                y: this.game.height * .175
            },
            4: {
                x: this.game.width * .7,
                y: this.game.height * .225
            },
            5: {
                x: this.game.width * .85,
                y: this.game.height * .45
            },
            6: {
                x: this.game.width * .7,
                y: this.game.height * .55
            },
            7: {
                x: this.game.width * .525,
                y: this.game.height * .425
            },
            8: {
                x: this.game.width * .375,
                y: this.game.height * .6
            },
            9: {
                x: this.game.width * .25,
                y: this.game.height * .7
            },
            10: {
                x: this.game.width * .18,
                y: this.game.height * .95
            },
            11: {
                x: this.game.width * .05,
                y: this.game.height * .975
            },
            12: {
                x: this.game.width * .275,
                y: this.game.height * 1.15
            },
            13: {
                x: this.game.width * .45,
                y: this.game.height * 1.15
            },
            14: {
                x: this.game.width * .6,
                y: this.game.height * 1.25
            },
            15: {
                x: this.game.width * .725,
                y: this.game.height * 1.2
            },
            16: {
                x: this.game.width * .85,
                y: this.game.height * 1.05
            },
            17: {
                x: this.game.width * .925,
                y: this.game.height * 1.3
            }
        };

        this.lastLevel = Object.keys(this.zone.LEVEL_ORDERING).length;

        this.drawLinesBetweenLevels();

        for (let i = 1; i <= this.lastLevel; i++)
        {
            this['level' + i + 'Button'] = this.game.add.button(
                this.levels[i].x,
                this.levels[i].y,
                this.zone.LEVEL_BUTTON_GRAPHIC,
                this.clickLevelButton,
                this
            );

            this['level' + i + 'Button'].levelNumber = i;
            this['level' + i + 'Button'].levelName = ZONE_INFO[this.zone.NAME].LEVEL_ORDERING[i];

            this['level' + i + 'Button'].onDownSound = this.sounds.metalClick;

            this['level' + i + 'Button'].onInputDown.add(
                this.levelButtonClickEffect,
                this,
                0,
                'level' + i + 'Button'
            );

            if (!this.isLevelUnlocked(i))
            {
                this['level' + i + 'Button'].tint = 0x333333;
                this['level' + i + 'Button'].input.useHandCursor = false;
            }

            this.writeLevelText(i);
            this.addLevelStars(i);
        }

        this.addButtonTextLink('nextZoneLink', 'Next', 20, 'smallDark', 10, this.game.camera.height - 40, 'right', 'nextZone');

        this.titleText = this.game.add.bitmapText(
            500,
            this.game.height * .01,
            this.game.globals.bitmapFontName,
            this.zone.TITLE,
            28
        );
        this.titleText.x = (this.game.width * .5) - (this.titleText.width * .5);
        this.titleText.alpha = .5;

        if (this.user.zones && this.user.zones[this.zone.NAME])
        {
            this.game.camera.x = this.user.zones[this.zone.NAME].cameraX || 0;
            this.game.camera.y = this.user.zones[this.zone.NAME].cameraY || 0;
        }
        else
        {
            if (!this.user.zones)
            {
                this.user.zones = {};
            }
            if (!this.user.zones[this.zone.NAME])
            {
                this.user.zones[this.zone.NAME] = {};
            }
        }

        // Listen for keyboard presses
        this.game.input.keyboard.onPressCallback = function (input) { this.keyPress(input); }.bind(this);

        this.gameOverBackground = this.game.add.tileSprite(0, 0, this.game.camera.width, this.game.camera.height, 'gameOverBackground');
        this.gameOverBackground.fixedToCamera = true;
        this.gameOverBackground.alpha = 0;

        this.setupSounds();

        this.game.kineticScrolling.start();

        this.flashIntoState();

    }

    levelButtonClickEffect(levelButton)
    {
        let scale = .8;

        let originalButtonWidth = levelButton.width;
        let originalButtonHeight = levelButton.height;
        let changedButtonWidth = originalButtonWidth * scale;
        let changedButtonHeight = originalButtonHeight * scale;

        // Tween button scale
        this.game.add.tween(levelButton.scale).to(
            {
                x: scale,
                y: scale
            },
            this.game.globals.fadeOutOfStateMs,
            Phaser.Easing.Back.Out,
            true,
            0
        );

        // Tween button location
        let toX = levelButton.x + ((originalButtonWidth - changedButtonWidth) * .5);
        let toY = levelButton.y + ((originalButtonHeight - changedButtonHeight) * .5);
        this.game.add.tween(levelButton).to(
            {
                x: toX,
                y: toY
            },
            this.game.globals.fadeOutOfStateMs,
            Phaser.Easing.Back.Out,
            true,
            0
        );
    }

    shutdown()
    {
        this.user.zones[this.zone.NAME].cameraX = this.game.camera.x;
        this.user.zones[this.zone.NAME].cameraY = this.game.camera.y;
        this.save();
    }

    clickLevelButton(levelButton)
    {
        let levelNumber = levelButton.levelNumber;

        if (!this.isLevelUnlocked(levelNumber))
        {
            return false;
        }

        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(this.game.globals.interStateBackgroundColor, this.game.globals.fadeOutOfStateMs, true);
        this.game.camera.onFadeComplete.add(
            this.goToLevelOptions,
            this,
            0,
            levelNumber
        );
    }

    goToLevelOptions(levelNumber)
    {
        let obj = {
            zoneName: this.zone.NAME,
            levelNumber
        };
        this.game.state.start('levelOptions', true, true, obj);
    }

    writeLevelText(levelNumber)
    {
        let x = this.levels[levelNumber].x + 16;
        let y = this.levels[levelNumber].y - 19;

        this['level' + levelNumber + 'Text'] = this.game.add.bitmapText(
            x,
            y,
            this.game.globals.bitmapFontName,
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

        let levelName = ZONE_INFO[this.zone.NAME].LEVEL_ORDERING[levelNumber];

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

            let star = this.game.add.sprite(x, y, spriteName);
            star.scale.setTo(.1, .1);

            x += 20;
        }
    }

    drawLinesBetweenLevels()
    {
        let graphics = this.game.add.graphics(0, 0);

        graphics.lineStyle(3, 0x886666, 1);

        for (let i = 1; i <= this.lastLevel; i++)
        {
            let level = this.getLevelFromZoneAndNumber(this.zone.NAME, i);

            if (level && level.hasOwnProperty('previousLevelName'))
            {
                let previousLevelNumber = this.getLevelNumberFromZoneAndName(this.zone.NAME, level.previousLevelName);

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
        this.game.state.start('zone', true, true, this.zone.NEXT_ZONE_NAME);
    }

    keyPress(character)
    {
        if (!this.keyInput)
        {
            this.keyInput = '';
        }
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
        this.game.add.tween(
            this.gameOverBackground,
            this.game
        )
        .to(
            { alpha: 1 },
            Phaser.Timer.SECOND * seconds,
            Phaser.Easing.Linear.None,
            true
        );
        this.game.time.events.add(
            Phaser.Timer.SECOND * seconds,
            this.restartState,
            this,
            ''
        ).autoDestroy = true
    }

    restartState()
    {
        this.game.state.start('zone', true, true, this.zone.NAME);
    }
}