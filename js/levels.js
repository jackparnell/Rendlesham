var level1 = {
    begin: function() {
        var i;

        for (i = 0; i < 20; i += 2) {
            timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * i, mainState.spawnOscar, mainState));
        }

        for (i = 25; i < 35; i++) {
            timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * i, mainState.spawnOscar, mainState));
        }

        for (i = 40; i < 50; i += .5) {
            timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * i, mainState.spawnOscar, mainState));
        }

        for (i = 55; i < 65; i += .3) {
            timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * i, mainState.spawnOscar, mainState));
        }

        for (i = 70; i < 80; i += .2) {
            timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * i, mainState.spawnOscar, mainState));
        }


    },
    completed: function() {
        return false;
    },
    update: function() {

    },
    startingCoins: 100,
    startingLives: 5
};
