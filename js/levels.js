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
        for (i = 40; i < 55; i += 2) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }
        for (i = 41; i < 55; i += 2) {
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
        for (i = 60; i < 70; i += .75) {
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
        for (i = 75; i < 85; i += .5) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }

        // Wave 6
        for (i = 90; i < 100; i += .3) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * 101, mainState.lastWaveDispatched, mainState));


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
    startingLives: 5,
    waves: 6
};

var level2 = {
    begin: function() {
        var i;

        // Wave 1
        for (i = 0; i < 20; i += 1.75) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }
        for (i = 20; i < 25; i += 1.75) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Mib'
                ).autoDestroy = true
            );
        }


        // Wave 2
        for (i = 30; i < 40; i++) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }
        for (i = 40; i < 44; i ++) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Mib'
                ).autoDestroy = true
            );
        }


        // Wave 3
        for (i = 45; i < 60; i += 2) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }
        for (i = 46; i < 61; i += 2) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Mib'
                ).autoDestroy = true
            );
        }

        // Wave 4
        for (i = 65; i < 75; i += .5) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }
        for (i = 75; i < 85; i++) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Mib'
                ).autoDestroy = true
            );
        }


        // Wave 5
        for (i = 90; i < 100; i += .5) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }
        for (i = 100; i < 105; i += .75) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Mib'
                ).autoDestroy = true
            );
        }

        // Wave 6
        for (i = 110; i < 115; i += .3) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }
        for (i = 115; i < 120; i += .3) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Mib'
                ).autoDestroy = true
            );
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * 121, mainState.lastWaveDispatched, mainState));


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
    startingCoins: 150,
    startingLives: 5,
    waves: 6
};

var level3 = {
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
        for (i = 40; i < 55; i += 2) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Oscar'
                ).autoDestroy = true
            );
        }
        for (i = 41; i < 55; i += 2) {
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
        for (i = 60; i < 70; i += .75) {
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
        for (i = 75; i < 85; i += .5) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }

        // Wave 6
        for (i = 90; i < 100; i += .3) {
            timerEvents.push(
                game.time.events.add(
                    Phaser.Timer.SECOND * i,
                    mainState.spawnAttacker,
                    mainState,
                    'Aquila'
                ).autoDestroy = true
            );
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * 101, mainState.lastWaveDispatched, mainState));


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
    startingCoins: 150,
    startingLives: 5,
    waves: 6
};
