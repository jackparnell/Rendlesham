var level1 = {
    begin: function() {
        var i;

        // Wave 1
        for (i = 0; i < 20; i += 2) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }

        // Wave 2
        for (i = 25; i < 35; i++) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }


        // Wave 3
        for (i = 40; i < 50; i++) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }
        for (i = 40.5; i < 50; i += 2) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }

        // Wave 4
        for (i = 55; i < 65; i += .5) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }

        // Wave 5
        for (i = 70; i < 80; i += .35) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * 81, mainState.lastWaveDispatched, mainState));


    },
    completed: function() {

        if (!mainState.allAttackersDispatched) {
            return false;
        }
        if (mainState.attackers.countLiving() >= 1) {
            return false;
        }
        return true;
    },
    update: function() {

    },
    startingCoins: 100,
    startingLives: 5
};
