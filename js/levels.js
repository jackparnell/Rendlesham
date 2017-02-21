var waveNumber;
var lastLevel = 5;

var level1 = {
    waveInfo: {
        wave1: {
            duration: 25,
            createEvents: function(s) {
                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 20, 2.5);
            }
        },
        wave2: {
            duration: 15,
            createEvents: function(s) {
                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 10, 1.5);
            }
        },
        wave3: {
            duration: 20,
            createEvents: function(s) {
                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 15, 2);
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 15, 2, 1);
            }
        },
        wave4: {
            duration: 15,
            createEvents: function(s) {
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, 1.25);
            }
        },
        wave5: {
            duration: 15,
            createEvents: function(s) {
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, 1);
            }
        },
        wave6: {
            duration: 12,
            createEvents: function(s) {
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .75);
            }
        }

    },
    begin: function() {

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(this.waveInfo).length;

        for (var wave in this.waveInfo) {
            if (this.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                this.waveInfo[wave].createEvents(s);

                s += this.waveInfo[wave].duration;

            }
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.spawnObstacle('TallBrownMushroom', 2, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 11, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 9, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 18, 6, 'grid');

        mainState.nathan = mainState.spawnCharacter('Nathan', 0, 4, 'grid');


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
    calculateCompletionStars: function() {
        var stars = 1;
        if (mainState.lives == this.startingLives) {
            stars ++;
        }
        if (mainState.obstacles.countLiving() <= 3) {
            stars ++;
        }
        return stars;
    },
    update: function() {

    },
    startingCoins: 100,
    startingLives: 5,
    goalXGrid: 0,
    goalYGrid: 4,
    waveHealthModifier: .2
};

var level2 = {
    waveInfo: {
        wave1: {
            duration: 27,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 20, 1.75);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 3, 1.75, 20);

            }
        },
        wave2: {
            duration: 17,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 10, 1.25);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 4, 1.75, 10);

            }
        },
        wave3: {
            duration: 18,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 15, 2);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 15, 2, 1);

            }
        },
        wave4: {
            duration: 23,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 10, .8);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 10, 1.5, 10);

            }
        },
        wave5: {
            duration: 18,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .8);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 5, 1.25, 10);

            }
        },
        wave6: {
            duration: 17,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 5, .6);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 10, .8, 5);

            }
        }

    },
    begin: function() {

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(this.waveInfo).length;

        for (var wave in this.waveInfo) {
            if (this.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                this.waveInfo[wave].createEvents(s);

                s += this.waveInfo[wave].duration;

            }
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.spawnObstacle('TallBrownMushroom', 7, 1, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 9, 1, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 11, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 13, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 17, 3, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 16, 4, 'grid');

        mainState.nathan = mainState.spawnCharacter('Nathan', 0, 4, 'grid');

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
    calculateCompletionStars: function() {
        var stars = 1;
        if (mainState.lives == this.startingLives) {
            stars ++;
        }
        if (mainState.obstacles.countLiving() <= 3) {
            stars ++;
        }
        return stars;
    },
    update: function() {

    },
    startingCoins: 150,
    startingLives: 5,
    goalXGrid: 0,
    goalYGrid: 4,
    waveHealthModifier: .25
};

var level3 = {
    waveInfo: {
        wave1: {
            duration: 30,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 20, 1.75);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 5, 1.75, 20);

            }
        },
        wave2: {
            duration: 20,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 10, 1.25);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 4, 1.25, 10);

            }
        },
        wave3: {
            duration: 20,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 15, 2);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 15, 2, 1);

            }
        },
        wave4: {
            duration: 25,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .75);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 10, 1.5, 10);

            }
        },
        wave5: {
            duration: 20,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .75);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 5, 1.25, 10);

            }
        },
        wave6: {
            duration: 15,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 5, .5);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 10, .75, 5);

            }
        }

    },
    begin: function() {

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(this.waveInfo).length;

        for (var wave in this.waveInfo) {
            if (this.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                this.waveInfo[wave].createEvents(s);

                s += this.waveInfo[wave].duration;

            }
        }

        mainState.spawnObstacle('TallBrownMushroom', 17, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 18, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 5, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 2, 8, 'grid');

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.nathan = mainState.spawnCharacter('Nathan', 0, 4, 'grid');

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
    calculateCompletionStars: function() {
        var stars = 1;
        if (mainState.lives == this.startingLives) {
            stars ++;
        }
        if (mainState.obstacles.countLiving() <= 3) {
            stars ++;
        }
        return stars;
    },
    update: function() {

    },
    startingCoins: 150,
    startingLives: 5,
    goalXGrid: 0,
    goalYGrid: 4,
    waveHealthModifier: .33
};

var level4 = {
    waveInfo: {
        wave1: {
            duration: 25,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 20, 1.75);

            }
        },
        wave2: {
            duration: 23,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 10, 1);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 5, 1, 10);
                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 5, 1, 15);

            }
        },
        wave3: {
            duration: 18,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Mib', waveNumber, s, 15, 2);
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 15, 2, 1);

            }
        },
        wave4: {
            duration: 23,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .5);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 10, 1, 10);

            }
        },
        wave5: {
            duration: 28,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .5);
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 15, .8);

            }
        },
        wave6: {
            duration: 32,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Mib', waveNumber, s, 30, .75);

            }
        }

    },
    begin: function() {

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(this.waveInfo).length;

        for (var wave in this.waveInfo) {
            if (this.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                this.waveInfo[wave].createEvents(s);

                s += this.waveInfo[wave].duration;

            }
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.spawnObstacle('TallBrownMushroom', 1, 3, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 7, 1, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 7, 3, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 7, 5, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 14, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 16, 3, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 18, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 16, 8, 'grid');

        mainState.nathan = mainState.spawnCharacter('Nathan', 0, 4, 'grid');

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
    calculateCompletionStars: function() {
        var stars = 1;
        if (mainState.lives == this.startingLives) {
            stars ++;
        }
        if (mainState.obstacles.countLiving() <= 3) {
            stars ++;
        }
        return stars;
    },
    update: function() {

    },
    startingCoins: 150,
    startingLives: 5,
    goalXGrid: 0,
    goalYGrid: 4,
    waveHealthModifier: .35
};

var level5 = {
    waveInfo: {
        wave1: {
            duration: 25,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 20, 1.75);

            }
        },
        wave2: {
            duration: 23,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 10, 1);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 5, 1, 10);
                mainState.scheduleAttackersWave('Oscar', waveNumber, s, 5, 1, 15);

            }
        },
        wave3: {
            duration: 18,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Mib', waveNumber, s, 15, 2);
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 15, 2, 1);

            }
        },
        wave4: {
            duration: 23,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .5);
                mainState.scheduleAttackersWave('Mib', waveNumber, s, 10, 1, 10);

            }
        },
        wave5: {
            duration: 28,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 10, .5);
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 15, .8);

            }
        },
        wave6: {
            duration: 32,
            createEvents: function(s) {

                mainState.scheduleAttackersWave('Mib', waveNumber, s, 30, .75);

            }
        }

    },
    begin: function() {

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(this.waveInfo).length;

        for (var wave in this.waveInfo) {
            if (this.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                this.waveInfo[wave].createEvents(s);

                s += this.waveInfo[wave].duration;

            }
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.spawnObstacle('TallBrownMushroom', 8, 3, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 15, 3, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 6, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 6, 6, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 3, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 1, 1, 'grid');

        mainState.nathan = mainState.spawnCharacter('Nathan', 0, 7, 'grid');

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
    calculateCompletionStars: function() {
        var stars = 1;
        if (mainState.lives == this.startingLives) {
            stars ++;
        }
        if (mainState.obstacles.countLiving() <= 3) {
            stars ++;
        }
        return stars;
    },
    update: function() {

    },
    pathAdditionalCostTiles: function(attacker) {

        var additionalCostTiles = [];

        if (attacker.incrementalId % 2) {
            additionalCostTiles.push([10, 2, 20]);
        } else {
            additionalCostTiles.push([10, 2, 0]);
        }

        return additionalCostTiles;

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 19,
    entryYGrid: 2,
    goalXGrid: 0,
    goalYGrid: 7,
    waveHealthModifier: .3
};