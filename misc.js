function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeGameState(stateName){
    if (!stateName) {
        stateName = 'titleScreen';
    }
    game.state.start(stateName);
}

function loadMainFiles()
{

    game.load.image('eastAnglia', 'assets/backgrounds/eastAnglia.png');
    game.load.image('gameOverBackground', 'assets/backgrounds/gameOverBackground.png');

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
    game.load.spritesheet('iceLance', 'assets/sprites/weapons/IceLance.png', 32, 32, 1);
    game.load.spritesheet('redLaser', 'assets/sprites/weapons/RedLaser.png', 32, 32, 1);

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

    game.load.spritesheet('tallBrownMushroom', 'assets/sprites/obstacles/tallBrownMushroom.png', 35, 35, 1);
    game.load.spritesheet('tallGreyMushroom', 'assets/sprites/obstacles/tallGreyMushroom.png', 35, 35, 1);
    game.load.spritesheet('tallRedMushroom', 'assets/sprites/obstacles/tallRedMushroom.png', 35, 35, 1);
    game.load.spritesheet('pumpkin', 'assets/sprites/obstacles/pumpkin.png', 35, 35, 1);

    for (var property in levelOrdering.eastAnglia) {
        if (levelOrdering.eastAnglia.hasOwnProperty(property)) {
            var level = window[levelOrdering.eastAnglia[property]];
            game.load.tilemap(level.mapName, 'assets/tilemaps/maps/' + level.mapName + '.json', null, Phaser.Tilemap.TILED_JSON);
        }
    }

    game.load.image('tiles', 'assets/tilemaps/tiles/tiles_spritesheet.png');
    game.load.image('roguelikeSheet_transparent', 'assets/tilemaps/tiles/roguelikeSheet_transparent.png');

    game.load.bitmapFont('gem', 'assets/fonts/bitmapFonts/gem.png', 'assets/fonts/bitmapFonts/gem.xml');
    game.load.bitmapFont('passionOne', 'assets/fonts/bitmapFonts/passionOne.png', 'assets/fonts/bitmapFonts/passionOne.fnt');

}

function getLevelByName(levelName) {

    var item;
    var level;

    for (var property in levelOrdering.eastAnglia) {
        if (levelOrdering.eastAnglia.hasOwnProperty(property)) {
            item = window[levelOrdering.eastAnglia[property]];

            if (item.name && item.name == levelName) {
                level = item;
            }
        }
    }

    return level;

}

var newUser = {
    levelsComplete: [],
    items: {},
    levelStars: {},
    levelHighScores: {}
};

var extendObj = function(childObj, parentObj) {
    childObj.prototype = parentObj.prototype;
};
