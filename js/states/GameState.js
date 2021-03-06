class GameState extends Phaser.State
{
    preload()
    {
        this.loadMainFiles();
    }

    create()
    {
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        this.handleScaling();
        this.setupSounds();
        this.game.backgrounds = this.game.add.group();
        this.game.linkBackgrounds = this.game.add.group();
        this.game.texts = this.game.add.group();
        this.manageDom();
    }

    loadUser()
    {
        if (localStorage.getItem(this.game.globals.applicationName))
        {
            this.user = JSON.parse(localStorage.getItem(this.game.globals.applicationName));
        }
        else
        {
            this.user = {
                levelsComplete: [],
                items: {},
                levelStars: {},
                levelHighScores: {},
                cheats: {}
            };
            this.save();
        }
    }

    save()
    {
        localStorage.setItem(this.game.globals.applicationName, JSON.stringify(this.user));
    }

    checkUser()
    {
        if (!this.user.hasOwnProperty('guid'))
        {
            this.user.guid = guid();
        }

        // Array
        if (!this.user.levelsComplete)
        {
            this.user.levelsComplete = [];
        }

        if (!this.user.objectsSeen)
        {
            this.user.objectsSeen = [];
        }

        let records = ['items', 'levelCompletions', 'levelStars', 'levelHighScores'];
        let modes = ['classic', 'epic', 'endless'];

        for (let i = 0; i < records.length; ++i)
        {
            if (!this.user[records[i]]) {
                this.user[records[i]] = {};
            }

            for (let j = 0; j < modes.length; ++j)
            {
                if (!this.user[records[i]][modes[j]]) {
                    this.user[records[i]][modes[j]] = {};
                }
            }
        }

        if (!this.user.zones) {
            this.user.zones = {};
        }

        for (let zoneName in ZONE_INFO) {
            if (ZONE_INFO.hasOwnProperty(zoneName)) {
                if (!this.user.zones[zoneName]) {
                    this.user.zones[zoneName] = {};
                }
            }
        }

        this.save();
    }

    downloadSave()
    {
        let filename = this.game.globals.applicationName + '.sav';
        let blob = new Blob([btoa(JSON.stringify(this.user))], {type: 'text/plain;charset=utf-8;'});
        if (window.navigator.msSaveOrOpenBlob)
        {
            window.navigator.msSaveBlob(blob, filename);
        }
        else
        {
            let elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    changeGameState(stateName = 'titleScreen')
    {
        this.game.state.start(stateName);
    }

    addButtonTextLink(name, text, fontSize, buttonImage, x, y, horizontal, clickFunctionName, textColor = 0xFFFFFF, soundName = 'metalClick')
    {
        // Begin button
        let buttonName = name + 'Button';

        this[buttonName] = this.game.add.button(
            0,
            0,
            buttonImage,
            this[clickFunctionName],
            this
        );
        this.game.linkBackgrounds.add(this[buttonName]);

        this[buttonName].name = name;

        if (clickFunctionName !== 'notPossible')
        {
            this[buttonName].onInputDown.add(
                this.buttonTextLinkClickEffect,
                this,
                0,
                name
            );
            this[buttonName].onDownSound = this.sounds[soundName];
        }

        if (horizontal === 'right')
        {
            x = this.game.width - this[buttonName].width - x;
        }
        else if (horizontal === 'center')
        {
            x = (this.game.width * .5) - (this[buttonName].width * .5);
        }

        this[buttonName].fixedToCamera = true;
        this[buttonName].cameraOffset.setTo(x, y);
        // End button

        // Begin text
        this[name] = this.game.add.bitmapText(
            0,
            0,
            this.game.globals.bitmapFontName,
            text,
            fontSize
        );
        this.game.texts.add(this[name]);

        this[name].tint = textColor;

        let xOffset = (this[buttonName].width - this[name].width) * .5;
        x = this[buttonName].cameraOffset.x + xOffset;

        let yOffset = (this[buttonName].height - this[name].height) * .38;
        y = this[buttonName].cameraOffset.y + yOffset;

        this[name].fixedToCamera = true;
        this[name].cameraOffset.setTo(x, y);
        // End text

    }

    buttonTextLinkClickEffect(name)
    {
        if (typeof name === 'object' && name.hasOwnProperty('name'))
        {
            name = name.name;
        }
        if (!name)
        {
            throw {
                'code': 78402,
                'description': 'Name not found in buttonTextLinkClickEffect().'
            };
        }

        let scale = .9;
        let originalButtonWidth = this[name + 'Button'].width;
        let originalButtonHeight = this[name + 'Button'].height;
        let originalTextWidth = this[name].width;
        let originalTextHeight = this[name].height;

        let changedButtonWidth = originalButtonWidth * scale;
        let changedButtonHeight = originalButtonHeight * scale;
        let changedTextWidth = originalTextWidth * scale;
        let changedTextHeight = originalTextHeight * scale;

        // Tween text scale
        this.game.add.tween(this[name].scale).to(
            {
                x: scale,
                y: scale
            },
            this.game.globals.fadeOutOfStateMs,
            Phaser.Easing.Back.Out,
            true,
            0
        );

        // Tween text camera offset
        let textToX = this[name].cameraOffset.x + ((originalTextWidth - changedTextWidth) * .5);
        let textToY = this[name].cameraOffset.y + ((originalTextHeight - changedTextHeight) * .5);
        this.game.add.tween(this[name].cameraOffset).to(
            {
                x: textToX,
                y: textToY
            },
            this.game.globals.fadeOutOfStateMs,
            Phaser.Easing.Back.Out,
            true,
            0
        );

        // Tween button scale
        this.game.add.tween(this[name + 'Button'].scale).to(
            {
                x: scale,
                y: scale
            },
            this.game.globals.fadeOutOfStateMs,
            Phaser.Easing.Back.Out,
            true,
            0
        );

        // Tween button camera offset
        let buttonToX = this[name + 'Button'].cameraOffset.x + ((originalButtonWidth - changedButtonWidth) * .5);
        let buttonToY = this[name + 'Button'].cameraOffset.y + ((originalButtonHeight - changedButtonHeight) * .5);
        this.game.add.tween(this[name + 'Button'].cameraOffset).to(
            {
                x: buttonToX,
                y: buttonToY
            },
            this.game.globals.fadeOutOfStateMs,
            Phaser.Easing.Back.Out,
            true,
            0
        );

    }

    /**
     * Add a property to a buttonTextLink.
     *
     * @param {string} name
     * @param {string} key
     * @param {string} value
     */
    buttonTextLinkAddProperty(name, key, value)
    {
        this[name][key] = value;
        this[name + 'Button'][key] = value;
    }

    goToTitleScreen()
    {
        this.fadeOutToState('titleScreen');
    }

    loadMainFiles(forceReload = false)
    {
        if (!forceReload && this.game.cache.checkImageKey('gameOverBackground'))
        {
            return;
        }

        for (let zoneName in ZONE_INFO)
        {
            if (ZONE_INFO.hasOwnProperty(zoneName))
            {
                this.game.load.image(ZONE_INFO[zoneName].ZONE_FILENAME, 'assets/backgrounds/' + ZONE_INFO[zoneName].ZONE_FILENAME + '.png');
            }
        }

        // Background files
        let backgroundFiles = [
            'gameOverBackground', 'flyToEarth', 'navigateToEarth', 'shipBreaking', 'touchMushroom'
        ];
        for (let i = 0; i < backgroundFiles.length; i++)
        {
            this.game.load.image(backgroundFiles[i], 'assets/backgrounds/' + backgroundFiles[i] + '.png');
        }

        this.game.load.image('forestGreen', 'assets/buttons/forestGreen.png');
        this.game.load.image('locked', 'assets/buttons/locked.png');
        this.game.load.image('smallDark', 'assets/buttons/smallDark.png');
        this.game.load.image('smallWideDark', 'assets/buttons/smallWideDark.png');
        this.game.load.image('starCharcoal', 'assets/sprites/decorations/StarCharcoal.png');
        this.game.load.image('starYellow', 'assets/sprites/decorations/StarYellow.png');
        this.game.load.image('ufo', 'assets/sprites/decorations/Ufo.png');

        this.game.load.image('pauseDark', 'assets/buttons/pause-dark.png');
        this.game.load.image('upDark', 'assets/buttons/up-dark.png');
        this.game.load.image('closeDark', 'assets/buttons/close-dark.png');
        this.game.load.image('binDark', 'assets/buttons/bin-dark.png');
        this.game.load.image('maxDark', 'assets/buttons/max-dark.png');
        this.game.load.image('poundDark', 'assets/buttons/pound-dark.png');
        this.game.load.image('blankDark', 'assets/buttons/blank-dark.png');

        this.game.load.spritesheet('explosion', 'assets/sprites/decorations/Explosion.png', 32, 32, 6);
        this.game.load.spritesheet('crosshair', 'assets/sprites/decorations/Crosshair.png', 42, 42, 1);
        this.game.load.spritesheet('healthBar', 'assets/sprites/decorations/HealthBar.png', 20, 5, 21);
        this.game.load.spritesheet('Zap', 'assets/sprites/decorations/Zap.png', 32, 32, 3);
        this.game.load.spritesheet('Cross', 'assets/sprites/decorations/Cross.png', 32, 32, 1);

        this.game.load.spritesheet('Bullet', 'assets/sprites/weapons/Bullet.png', 64, 64, 3);
        this.game.load.spritesheet('IceLance', 'assets/sprites/weapons/IceLance.png', 32, 32, 3);
        this.game.load.spritesheet('RedLaser', 'assets/sprites/weapons/RedLaser.png', 32, 32, 3);

        this.game.load.spritesheet('Aquila', 'assets/sprites/attackers/Aquila.png', 32, 32, 1);
        this.game.load.spritesheet('Dibley', 'assets/sprites/attackers/Dibley.png', 32, 32, 1);
        this.game.load.spritesheet('Drone', 'assets/sprites/attackers/Drone.png', 32, 32, 1);
        this.game.load.spritesheet('Mib', 'assets/sprites/attackers/Mib.png', 32, 32, 9);
        this.game.load.spritesheet('Oscar', 'assets/sprites/attackers/Oscar.png', 32, 32, 9);
        this.game.load.spritesheet('Roger', 'assets/sprites/attackers/Roger.png', 32, 32, 9);

        this.game.load.spritesheet('Nathan', 'assets/sprites/characters/Nathan.png', 35, 35, 1);
        this.game.load.spritesheet('Bully', 'assets/sprites/characters/Bully.png', 35, 35, 1);
        this.game.load.spritesheet('Reco', 'assets/sprites/characters/Reco.png', 35, 35, 1);

        this.game.load.spritesheet('Gun', 'assets/sprites/towers/Gun.png', 64, 64, 3);
        this.game.load.spritesheet('Freezer', 'assets/sprites/towers/Freezer.png', 64, 64, 3);
        this.game.load.spritesheet('Laser', 'assets/sprites/towers/Laser.png', 64, 64, 3);

        this.game.load.spritesheet('GunSpriteSheet', 'assets/sprites/towers/Gun.png', 64, 64, 3);
        this.game.load.spritesheet('FreezerSpriteSheet', 'assets/sprites/towers/Freezer.png', 64, 64, 3);
        this.game.load.spritesheet('LaserSpriteSheet', 'assets/sprites/towers/Laser.png', 64, 64, 3);

        this.game.load.spritesheet('BigBush', 'assets/sprites/obstacles/bigBush.png', 35, 35, 1);
        this.game.load.spritesheet('BigBushAutumn', 'assets/sprites/obstacles/bigBushAutumn.png', 35, 35, 1);
        this.game.load.spritesheet('Bulrush', 'assets/sprites/obstacles/Bulrush.png', 35, 35, 1);
        this.game.load.spritesheet('Crate', 'assets/sprites/obstacles/Crate.png', 35, 35, 1);
        this.game.load.spritesheet('SmallBush', 'assets/sprites/obstacles/smallBush.png', 35, 35, 1);
        this.game.load.spritesheet('Rock', 'assets/sprites/obstacles/Rock.png', 35, 35, 1);
        this.game.load.spritesheet('Snowman', 'assets/sprites/obstacles/Snowman.png', 35, 35, 1);
        this.game.load.spritesheet('SnowyPine', 'assets/sprites/obstacles/SnowyPine.png', 35, 35, 1);
        this.game.load.spritesheet('PinkCrystal', 'assets/sprites/obstacles/PinkCrystal.png', 35, 35, 1);
        this.game.load.spritesheet('PurpleRock', 'assets/sprites/obstacles/PurpleRock.png', 35, 35, 1);
        this.game.load.spritesheet('TombstoneLeft', 'assets/sprites/obstacles/TombstoneLeft.png', 35, 35, 1);
        this.game.load.spritesheet('TombstoneRight', 'assets/sprites/obstacles/TombstoneRight.png', 35, 35, 1);

        this.game.load.spritesheet('TallBrownMushroom', 'assets/sprites/obstacles/TallBrownMushroom.png', 35, 35, 2);
        this.game.load.spritesheet('TallGreyMushroom', 'assets/sprites/obstacles/TallGreyMushroom.png', 35, 35, 1);
        this.game.load.spritesheet('TallRedMushroom', 'assets/sprites/obstacles/TallRedMushroom.png', 35, 35, 1);
        this.game.load.spritesheet('Pumpkin', 'assets/sprites/obstacles/Pumpkin.png', 35, 35, 1);
        this.game.load.spritesheet('Puffball', 'assets/sprites/obstacles/Puffball.png', 32, 32, 3);

        this.loadZoneLevels('EAST_ANGLIA');
        this.loadZoneLevels('TRANSYLVANIA');

        this.game.load.image('tiles_spritesheet', 'assets/tilemaps/tiles/tiles_spritesheet.png');
        this.game.load.image('roguelikeSheet_transparent', 'assets/tilemaps/tiles/roguelikeSheet_transparent.png');
        this.game.load.image('2dTopDownTileSet', 'assets/tilemaps/tiles/2dTopDownTileSet.png');

        this.game.load.bitmapFont('gem', 'assets/fonts/bitmapFonts/gem.png', 'assets/fonts/bitmapFonts/gem.xml');
        this.game.load.bitmapFont('passionOne', 'assets/fonts/bitmapFonts/passionOne.png', 'assets/fonts/bitmapFonts/passionOne.fnt');

        // Audio files
        let audioFiles = [
            'bookOpen', 'bulletWhizz', 'chamberDecompressing', 'computerErrorAlert', 'footstep02', 'handleCoins',
            'hockeyPuckSlap', 'metalClick', 'metalLatch', 'robotBlip'
        ];
        for (let i = 0; i < audioFiles.length; i++)
        {
            this.game.load.audio(audioFiles[i], 'assets/audio/' + audioFiles[i] + '.ogg');
        }

        // File size is pretty big and play is buggy. Leave out for now.
        // this.game.load.audio('nightWindsLooping', 'assets/audio/tracks/nightWindsLooping.ogg');

    }

    loadTransylvanianFiles(forceReload = false)
    {
        if (!forceReload && this.game.cache.checkImageKey('gameOverBackground'))
        {
            return;
        }

        let transylvanianAttackerNames = [
            'betty', 'bogeyman', 'cyclops', 'farmer', 'ghost', 'goblin', 'imp', 'kappa', 'lee',
            'nic', 'ogre', 'skull', 'skuller', 'villager', 'woodcutter'
        ];

        for (let i = 0; i < transylvanianAttackerNames.length; i++)
        {
            this.game.load.atlasJSONHash(
                transylvanianAttackerNames[i],
                'assets/sprites/attackers/' + transylvanianAttackerNames[i] + '.png',
                'assets/sprites/attackers/' + transylvanianAttackerNames[i] + '.json'
            );
        }

        let transylvanianCharacterNames = [
            'wizard'
        ];

        for (let i = 0; i < transylvanianCharacterNames.length; i++)
        {
            this.game.load.atlasJSONHash(
                transylvanianCharacterNames[i],
                'assets/sprites/characters/' + transylvanianCharacterNames[i] + '.png',
                'assets/sprites/characters/' + transylvanianCharacterNames[i] + '.json'
            );
        }
    }

    getLevelFromZoneAndNumber(zoneName, levelNumber)
    {
        if (!ZONE_INFO.hasOwnProperty(zoneName)) {
            return false;
        }
        if (!ZONE_INFO[zoneName].hasOwnProperty('LEVEL_ORDERING')) {
            return false;
        }
        if (!ZONE_INFO[zoneName].LEVEL_ORDERING.hasOwnProperty(levelNumber)) {
            return false;
        }
        return window[ZONE_INFO[zoneName].LEVEL_ORDERING[levelNumber]];
    }

    getLevelNumberFromZoneAndName(zoneName, levelName)
    {
        let levelOrdering = ZONE_INFO[zoneName].LEVEL_ORDERING;
        return Object.keys(levelOrdering)[Object.values(levelOrdering).indexOf(levelName)];
    }

    setupSounds()
    {
        if (!this.sounds)
        {
            this.sounds = {};
        }
        if (!this.game.sounds)
        {
            this.game.sounds = {};
        }

        this.sounds.bookOpen = this.game.add.audio('bookOpen');
        this.sounds.bookOpen.allowMultiple = true;

        this.sounds.bulletWhizz = this.game.add.audio('bulletWhizz');
        this.sounds.bulletWhizz.allowMultiple = true;
        this.sounds.bulletWhizz.volume = .4;

        this.sounds.chamberDecompressing = this.game.add.audio('chamberDecompressing');
        this.sounds.chamberDecompressing.allowMultiple = true;

        this.sounds.footstep02 = this.game.add.audio('footstep02');
        this.sounds.footstep02.allowMultiple = true;
        this.sounds.footstep02.volume = .8;

        this.sounds.handleCoins = this.game.add.audio('handleCoins');
        this.sounds.handleCoins.allowMultiple = true;

        this.sounds.hockeyPuckSlap = this.game.add.audio('hockeyPuckSlap');
        this.sounds.hockeyPuckSlap.allowMultiple = true;
        this.sounds.hockeyPuckSlap.volume = .8;

        this.sounds.metalClick = this.game.add.audio('metalClick');
        this.sounds.metalClick.allowMultiple = true;

        this.sounds.metalLatch = this.game.add.audio('metalLatch');
        this.sounds.metalLatch.allowMultiple = true;
        this.sounds.metalLatch.volume = .8;

        this.sounds.robotBlip = this.game.add.audio('robotBlip');
        this.sounds.robotBlip.allowMultiple = true;
        this.sounds.robotBlip.volume = .8;

        this.sounds.computerErrorAlert = this.game.add.audio('computerErrorAlert');
        this.sounds.computerErrorAlert.allowMultiple = true;
        this.sounds.computerErrorAlert.volume = 1;

        /*
        this.game.sounds.nightWindsLooping = this.game.add.audio('nightWindsLooping');
        this.game.sounds.nightWindsLooping.allowMultiple = false;
        this.game.sounds.nightWindsLooping.volume = .4;
        */
    }

    playSound(soundName)
    {
        this.sounds[soundName].play();
    }

    isLevelUnlocked(levelNumber, mode='classic')
    {
        if (levelNumber === 1 && mode === 'classic')
        {
            return true;
        }
        if (this.user.cheats && this.user.cheats.unlockAllLevels)
        {
            return true;
        }
        let level = this.getLevelFromZoneAndNumber(this.zone.NAME, levelNumber);

        switch (mode)
        {
            case 'classic':
                // Classic is unlocked is user had completed the previous level (on any mode)
                return (level && level.hasOwnProperty('previousLevelName') && this.hasUserCompletedLevel(level.previousLevelName));

            case 'epic':
                // Epic is unlocked is user had completed the level on classic mode
                return (level && level.hasOwnProperty('name') && this.hasUserCompletedLevel(level.name, 'classic'));

            case 'endless':
                // Endless is unlocked is user had completed the level on epic mode
                return (level && level.hasOwnProperty('name') && this.hasUserCompletedLevel(level.name, 'epic'));

            default:
                throw {
                    'code': 78401,
                    'description': 'Mode ' + mode + ' invalid.'
                };
        }

    }

    /**
     * Has the user completed a supplied levelName and mode.
     *
     * @param {string} levelName
     * @param {string} mode
     * @returns {boolean}
     */
    hasUserCompletedLevel(levelName, mode='any')
    {
        let completed = false;

        let modes = ['classic', 'epic', 'endless'];

        for (let i = 0; i < modes.length; i++)
        {
            if (
                (mode === 'any' || mode === modes[i])
                &&
                this.user.levelCompletions[modes[i]][levelName])
            {
                completed = true;
            }
        }

        return completed;
    }

    /**
     * Has the user completed any level in a supplied zoneName and mode.
     *
     * @param {string} zoneName
     * @param {string} mode
     * @returns {boolean}
     */
    hasUserCompletedAnyLevelInZone(zoneName, mode='any')
    {
        for (let levelNumber in ZONE_INFO[zoneName].LEVEL_ORDERING)
        {
            let level = this.getLevelFromZoneAndNumber(zoneName, levelNumber);
            if (this.hasUserCompletedLevel(level.name, mode))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * Code to be run when the user tries to do something not possible.
     */
    notPossible()
    {
        this.playSound('computerErrorAlert');
    }

    /**
     * Handle the user seeing an object of a supplied className.
     *
     * @param {string} className
     */
    userSeesObject(className)
    {
        if (this.user.objectsSeen.indexOf(className) === -1)
        {
            this.user.objectsSeen.push(className);
        }
    }

    handleScaling()
    {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (this.game.device.desktop === false)
        {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setMinMax(
                this.game.width * .5,
                this.game.height * .5,
                this.game.width * 2,
                this.game.height * 2
            );
            this.goFullScreen();
        }
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    }

    goFullScreen()
    {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.scale.startFullScreen(false);
    }

    flashIntoState()
    {
        this.game.camera.flash(this.game.globals.interStateBackgroundColor, this.game.globals.flastIntoStateMs, true);
    }

    fadeOutToState(stateName)
    {
        this.game.camera.onFadeComplete.removeAll(this);
        this.game.camera.fade(this.game.globals.interStateBackgroundColor, this.game.globals.fadeOutOfStateMs, true);
        this.game.camera.onFadeComplete.add(this.changeGameState, this, 0, stateName);
    }

    /**
     * Make needed changes ti the DOM based on the current state.
     */
    manageDom()
    {
        $('.active').removeClass('active');
        $('.' + this.game.state.current + 'Link').addClass('active');

        $('body').removeClass().addClass(this.game.state.current);
    }

    /**
     * Retrieve an array containing strings of relevant tower class names.
     *
     * @returns {Array}
     */
    getTowerClassNames()
    {
        if (this.hasOwnProperty('level') && this.level.towersAvailable)
        {
            return this.level.towersAvailable;
        }
        return ['Gun', 'Freezer', 'Laser'];
    }

    /**
     * Load zone level files for a supplied zoneName.
     *
     * @param {string} zoneName
     * @returns {boolean}
     */
    loadZoneLevels(zoneName)
    {
        let property;
        let level;
        for (property in ZONE_INFO[zoneName].LEVEL_ORDERING)
        {
            if (ZONE_INFO[zoneName].LEVEL_ORDERING.hasOwnProperty(property))
            {
                level = window[ZONE_INFO[zoneName].LEVEL_ORDERING[property]];
                this.game.load.tilemap(level.mapName, 'assets/tilemaps/maps/' + level.mapName + '.json', null, Phaser.Tilemap.TILED_JSON);
            }
        }
        return true;
    }
}