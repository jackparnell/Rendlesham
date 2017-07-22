class GameState extends Phaser.State
{
    preload()
    {
        this.loadMainFiles();
    }

    loadUser()
    {
        if (localStorage.getItem(game.globals.applicationName))
        {
            this.user = JSON.parse(localStorage.getItem(game.globals.applicationName));
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
        localStorage.setItem(game.globals.applicationName, JSON.stringify(this.user));

        console.log(game.globals.applicationName);
        console.log(game.globals.applicationName);
    }

    checkUser()
    {
        // Array
        if (!this.user.levelsComplete)
        {
            this.user.levelsComplete = [];
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


    changeGameState(stateName)
    {
        if (!stateName) {
            stateName = 'titleScreen';
        }
        game.state.start(stateName);
    }

    addButtonTextLink(name, text, fontSize, buttonImage, x, y, horizontal, clickFunctionName)
    {
        let buttonName = name + 'Button';

        this[buttonName] = game.add.button(
            0,
            y,
            buttonImage,
            this[clickFunctionName],
            this
        );
        this.linkBackgrounds.add(this[buttonName]);

        if (horizontal === 'right') {
            x = game.camera.width - this[buttonName].width - x;
        } else if (horizontal === 'center') {
            x = (game.camera.width * .5) - (this[buttonName].width * .5);
        } else if (horizontal === 'left') {
            // Do nothing
        }

        this[buttonName].x = x;

        this[buttonName].fixedToCamera = true;

        this[name] = game.add.bitmapText(
            0,
            0,
            this.game.globals.bitmapFontName,
            text,
            fontSize
        );

        let xOffset = (this[buttonName].width - this[name].width) * .5;
        this[name].x = this[buttonName].x + xOffset;

        let yOffset = (this[buttonName].height - this[name].height) * .38;
        this[name].y = this[buttonName].y + yOffset;

        this[name].fixedToCamera = true;
    }

    goToTitleScreen()
    {
        this.changeGameState('titleScreen');
    }

    loadMainFiles()
    {

        for (let zoneName in ZONE_INFO)
        {
            game.load.image(ZONE_INFO[zoneName].ZONE_BACKGROUND_FILENAME, 'assets/backgrounds/' + ZONE_INFO[zoneName].ZONE_BACKGROUND_FILENAME + '.png');
        }

        game.load.image('gameOverBackground', 'assets/backgrounds/gameOverBackground.png');
        game.load.image('flyToEarth', 'assets/backgrounds/flyToEarth.jpg');
        game.load.image('navigateToEarth', 'assets/backgrounds/navigateToEarth.jpg');
        game.load.image('shipBreaking', 'assets/backgrounds/shipBreaking.jpg');
        game.load.image('touchMushroomBackground', 'assets/backgrounds/touchMushroom.png');

        game.load.image('forestGreen', 'assets/buttons/forestGreen.png');
        game.load.image('smallDark', 'assets/buttons/smallDark.png');
        game.load.image('smallWideDark', 'assets/buttons/smallWideDark.png');
        game.load.image('starCharcoal', 'assets/sprites/decorations/StarCharcoal.png');
        game.load.image('starYellow', 'assets/sprites/decorations/StarYellow.png');
        game.load.image('ufo', 'assets/sprites/decorations/Ufo.png');

        game.load.image('pauseDark', 'assets/buttons/pause-dark.png');
        game.load.image('upDark', 'assets/buttons/up-dark.png');
        game.load.image('closeDark', 'assets/buttons/close-dark.png');
        game.load.image('binDark', 'assets/buttons/bin-dark.png');
        game.load.image('maxDark', 'assets/buttons/max-dark.png');
        game.load.image('poundDark', 'assets/buttons/pound-dark.png');
        game.load.image('blankDark', 'assets/buttons/blank-dark.png');

        game.load.spritesheet('explosion', 'assets/sprites/decorations/Explosion.png', 32, 32, 6);
        game.load.spritesheet('crosshair', 'assets/sprites/decorations/Crosshair.png', 42, 42, 1);
        game.load.spritesheet('healthBar', 'assets/sprites/decorations/HealthBar.png', 20, 5, 21);
        game.load.spritesheet('Zap', 'assets/sprites/decorations/Zap.png', 32, 32, 3);

        game.load.spritesheet('bullet', 'assets/sprites/weapons/Bullet.png', 64, 64, 3);
        game.load.spritesheet('iceLance', 'assets/sprites/weapons/IceLance.png', 32, 32, 3);
        game.load.spritesheet('redLaser', 'assets/sprites/weapons/RedLaser.png', 32, 32, 3);

        game.load.spritesheet('aquila', 'assets/sprites/attackers/Aquila.png', 32, 32, 1);
        game.load.spritesheet('dibley', 'assets/sprites/attackers/Dibley.png', 32, 32, 1);
        game.load.spritesheet('mib', 'assets/sprites/attackers/Mib.png', 32, 32, 9);
        game.load.spritesheet('oscar', 'assets/sprites/attackers/Oscar.png', 32, 32, 9);
        game.load.spritesheet('roger', 'assets/sprites/attackers/Roger.png', 32, 32, 9);

        game.load.spritesheet('nathan', 'assets/sprites/characters/Nathan.png', 35, 35, 1);
        game.load.spritesheet('bully', 'assets/sprites/characters/Bully.png', 35, 35, 1);
        game.load.spritesheet('ghost', 'assets/sprites/characters/Ghost.png', 35, 35, 1);

        game.load.spritesheet('gun', 'assets/sprites/towers/Gun.png', 64, 64, 3);
        game.load.spritesheet('freezer', 'assets/sprites/towers/Freezer.png', 64, 64, 3);
        game.load.spritesheet('laser', 'assets/sprites/towers/Laser.png', 64, 64, 3);

        game.load.spritesheet('GunSpriteSheet', 'assets/sprites/towers/Gun.png', 64, 64, 3);
        game.load.spritesheet('FreezerSpriteSheet', 'assets/sprites/towers/Freezer.png', 64, 64, 3);
        game.load.spritesheet('LaserSpriteSheet', 'assets/sprites/towers/Laser.png', 64, 64, 3);

        game.load.spritesheet('bigBush', 'assets/sprites/obstacles/bigBush.png', 35, 35, 1);
        game.load.spritesheet('bigBushAutumn', 'assets/sprites/obstacles/bigBushAutumn.png', 35, 35, 1);
        game.load.spritesheet('bulrush', 'assets/sprites/obstacles/Bulrush.png', 35, 35, 1);
        game.load.spritesheet('crate', 'assets/sprites/obstacles/Crate.png', 35, 35, 1);
        game.load.spritesheet('smallBush', 'assets/sprites/obstacles/smallBush.png', 35, 35, 1);
        game.load.spritesheet('rock', 'assets/sprites/obstacles/rock.png', 35, 35, 1);
        game.load.spritesheet('snowman', 'assets/sprites/obstacles/Snowman.png', 35, 35, 1);
        game.load.spritesheet('snowyPine', 'assets/sprites/obstacles/SnowyPine.png', 35, 35, 1);
        game.load.spritesheet('PinkCrystal', 'assets/sprites/obstacles/PinkCrystal.png', 35, 35, 1);
        game.load.spritesheet('PurpleRock', 'assets/sprites/obstacles/PurpleRock.png', 35, 35, 1);

        game.load.spritesheet('tallBrownMushroom', 'assets/sprites/obstacles/tallBrownMushroom.png', 35, 35, 1);
        game.load.spritesheet('tallGreyMushroom', 'assets/sprites/obstacles/tallGreyMushroom.png', 35, 35, 1);
        game.load.spritesheet('tallRedMushroom', 'assets/sprites/obstacles/tallRedMushroom.png', 35, 35, 1);
        game.load.spritesheet('pumpkin', 'assets/sprites/obstacles/pumpkin.png', 35, 35, 1);

        let property;
        let level;
        for (property in ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING)
        {
            if (ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING.hasOwnProperty(property))
            {
                level = window[ZONE_INFO.EAST_ANGLIA.LEVEL_ORDERING[property]];
                game.load.tilemap(level.mapName, 'assets/tilemaps/maps/' + level.mapName + '.json', null, Phaser.Tilemap.TILED_JSON);
            }
        }

        for (property in ZONE_INFO.TRANSYLVANIA.LEVEL_ORDERING)
        {
            if (ZONE_INFO.TRANSYLVANIA.LEVEL_ORDERING.hasOwnProperty(property))
            {
                level = window[ZONE_INFO.TRANSYLVANIA.LEVEL_ORDERING[property]];
                game.load.tilemap(level.mapName, 'assets/tilemaps/maps/' + level.mapName + '.json', null, Phaser.Tilemap.TILED_JSON);
            }
        }

        game.load.image('tiles_spritesheet', 'assets/tilemaps/tiles/tiles_spritesheet.png');
        game.load.image('roguelikeSheet_transparent', 'assets/tilemaps/tiles/roguelikeSheet_transparent.png');
        game.load.image('2dTopDownTileSet', 'assets/tilemaps/tiles/2dTopDownTileSet.png');

        game.load.bitmapFont('gem', 'assets/fonts/bitmapFonts/gem.png', 'assets/fonts/bitmapFonts/gem.xml');
        game.load.bitmapFont('passionOne', 'assets/fonts/bitmapFonts/passionOne.png', 'assets/fonts/bitmapFonts/passionOne.fnt');

        game.load.audio('bookOpen', 'assets/audio/bookOpen.ogg');
        game.load.audio('footstep02', 'assets/audio/footstep02.ogg');
        game.load.audio('handleCoins', 'assets/audio/handleCoins.ogg');
        game.load.audio('metalClick', 'assets/audio/metalClick.ogg');
        game.load.audio('metalLatch', 'assets/audio/metalLatch.ogg');
        game.load.audio('nes08', 'assets/audio/nes08.ogg');
        game.load.audio('nes09', 'assets/audio/nes09.ogg');
        game.load.audio('nes13', 'assets/audio/nes13.ogg');
        game.load.audio('nes15', 'assets/audio/nes15.ogg');
    }

    loadTransylvanianFiles()
    {
        let transylvanianAttackerNames = [
            'betty', 'bogeyman', 'bruce', 'cyclops', 'farmer', 'goblin', 'imp', 'kappa', 'nic', 'ogre', 'purp', 'skull', 'skuller', 'villager', 'woodcutter'
        ];

        for (let i = 0; i < transylvanianAttackerNames.length; i++) {
            game.load.atlasJSONHash(
                transylvanianAttackerNames[i],
                'assets/sprites/attackers/' + transylvanianAttackerNames[i] + '.png',
                'assets/sprites/attackers/' + transylvanianAttackerNames[i] + '.json'
            );
        }
    }

    getLevelFromZoneAndNumber(zoneName, levelNumber)
    {
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

        this.sounds.bookOpen =  game.add.audio('bookOpen');
        this.sounds.bookOpen.allowMultiple = true;

        this.sounds.footstep02 =  game.add.audio('footstep02');
        this.sounds.footstep02.allowMultiple = true;
        this.sounds.footstep02.volume = .8;

        this.sounds.handleCoins =  game.add.audio('handleCoins');
        this.sounds.handleCoins.allowMultiple = true;

        this.sounds.metalClick =  game.add.audio('metalClick');
        this.sounds.metalClick.allowMultiple = true;

        this.sounds.metalLatch =  game.add.audio('metalLatch');
        this.sounds.metalLatch.allowMultiple = true;
        this.sounds.metalLatch.volume = .8;

        this.sounds.nes08 =  game.add.audio('nes08');
        this.sounds.nes08.allowMultiple = true;
        this.sounds.nes08.volume = .3;

        this.sounds.nes09 =  game.add.audio('nes09');
        this.sounds.nes09.allowMultiple = true;
        this.sounds.nes09.volume = .3;

        this.sounds.nes13 =  game.add.audio('nes13');
        this.sounds.nes13.allowMultiple = true;
        this.sounds.nes13.volume = .3;

        this.sounds.nes15 =  game.add.audio('nes15');
        this.sounds.nes15.allowMultiple = true;
        this.sounds.nes15.volume = .3;
    }

    playSound(soundName)
    {
        this.sounds[soundName].play();
    }
}