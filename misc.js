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

    game.load.image('gameOverBackground', 'assets/backgrounds/gameOverBackground.png');

    game.load.image('button', 'assets/buttons/startGame.png');

    game.load.spritesheet('bullet', 'assets/sprites/weapons/Bullet.png', 32, 32, 2);

    game.load.spritesheet('aquila', 'assets/sprites/attackers/Aquila.png', 32, 32, 1);
    game.load.spritesheet('oscar', 'assets/sprites/attackers/Oscar.png', 32, 32, 1);

    game.load.spritesheet('rock', 'assets/sprites/towers/Rock.png', 64, 64, 1);
    
    game.load.audio('woosh', 'assets/sound/Woosh-Mark_DiAngelo-4778593.wav');
    game.load.audio('whack', 'assets/sound/punch_or_whack_-Vladimir-403040765.wav');


}


