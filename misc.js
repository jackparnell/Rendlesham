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

    game.load.image('button', 'assets/buttons/startGame.png');
    game.load.image('starCharcoal', 'assets/sprites/decorations/StarCharcoal.png');
    game.load.image('starYellow', 'assets/sprites/decorations/StarYellow.png');
    game.load.image('ufo', 'assets/sprites/decorations/Ufo.png');

    game.load.spritesheet('explosion', 'assets/sprites/decorations/Explosion.png', 32, 32, 6);
    game.load.spritesheet('crosshair', 'assets/sprites/decorations/Crosshair.png', 42, 42, 1);

    game.load.spritesheet('bullet', 'assets/sprites/weapons/Bullet.png', 64, 64, 3);
    game.load.spritesheet('iceLance', 'assets/sprites/weapons/IceLance.png', 32, 32, 1);

    game.load.spritesheet('aquila', 'assets/sprites/attackers/Aquila.png', 32, 32, 1);
    game.load.spritesheet('mib', 'assets/sprites/attackers/Mib.png', 32, 32, 1);
    game.load.spritesheet('oscar', 'assets/sprites/attackers/Oscar.png', 32, 32, 1);
    game.load.spritesheet('roger', 'assets/sprites/attackers/Roger.png', 32, 32, 1);

    game.load.spritesheet('nathan', 'assets/sprites/characters/Nathan.png', 35, 35, 1);

    game.load.spritesheet('gun', 'assets/sprites/towers/Gun.png', 64, 64, 3);
    game.load.spritesheet('freezer', 'assets/sprites/towers/Freezer.png', 64, 64, 3);

    game.load.spritesheet('bigBush', 'assets/sprites/obstacles/bigBush.png', 35, 35, 1);
    game.load.spritesheet('bulrush', 'assets/sprites/obstacles/Bulrush.png', 35, 35, 1);
    game.load.spritesheet('smallBush', 'assets/sprites/obstacles/smallBush.png', 35, 35, 1);
    game.load.spritesheet('rock', 'assets/sprites/obstacles/rock.png', 35, 35, 1);
    game.load.spritesheet('snowman', 'assets/sprites/obstacles/Snowman.png', 35, 35, 1);
    game.load.spritesheet('snowyPine', 'assets/sprites/obstacles/SnowyPine.png', 35, 35, 1);

    game.load.spritesheet('tallBrownMushroom', 'assets/sprites/obstacles/tallBrownMushroom.png', 35, 35, 1);
    game.load.spritesheet('tallGreyMushroom', 'assets/sprites/obstacles/tallGreyMushroom.png', 35, 35, 1);
    game.load.spritesheet('tallRedMushroom', 'assets/sprites/obstacles/tallRedMushroom.png', 35, 35, 1);

    game.load.audio('woosh', 'assets/sound/Woosh-Mark_DiAngelo-4778593.wav');
    game.load.audio('whack', 'assets/sound/punch_or_whack_-Vladimir-403040765.wav');

    for (var i = 1; i <= lastLevel; i++) {
        game.load.tilemap('map' + i, 'assets/tilemaps/maps/map' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
    }

    game.load.image('tiles', 'assets/tilemaps/tiles/tiles_spritesheet.png');



}


