var waveNumber;
var lastLevel = 6;

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

        mainState.nathan = mainState.spawnCharacter('Nathan', this.goalXGrid, this.goalYGrid, 'grid');


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
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .2,
    towerPlacementForbiddenRows: [0, 11],
    obstacles: {
        TallBrownMushroom: [
            [3, 3],
            [12, 9],
            [10, 9],
            [19, 7]
        ]
    }
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

        mainState.nathan = mainState.spawnCharacter('Nathan', this.goalXGrid, this.goalYGrid, 'grid');

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
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .25,
    towerPlacementForbiddenRows: [0, 11],
    obstacles: {
        TallBrownMushroom: [
            [8, 2],
            [10, 2],
            [12, 9],
            [14, 9],
            [18, 4],
            [17, 5]
        ]
    }
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

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.nathan = mainState.spawnCharacter('Nathan', this.goalXGrid, this.goalYGrid, 'grid');

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
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .33,
    towerPlacementForbiddenRows: [0, 11],
    obstacles: {
        TallBrownMushroom: [
            [18, 3],
            [19, 3],
            [6, 3],
            [3, 9]
        ]
    }
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

        mainState.nathan = mainState.spawnCharacter('Nathan', this.goalXGrid, this.goalYGrid, 'grid');

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
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .35,
    towerPlacementForbiddenRows: [0, 11],
    obstacles: {
        TallBrownMushroom: [
            [2, 4],
            [8, 2],
            [8, 4],
            [8, 6],
            [15, 3],
            [17, 4],
            [19, 3],
            [17, 9]
        ]
    }
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
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 15, .8, 10);

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

        mainState.nathan = mainState.spawnCharacter('Nathan', this.goalXGrid, this.goalYGrid, 'grid');

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
            additionalCostTiles.push([10, 3, 20]);
        } else {
            additionalCostTiles.push([10, 3, 0]);
        }

        return additionalCostTiles;

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 3,
    goalXGrid: 1,
    goalYGrid: 8,
    waveHealthModifier: .33,
    towerPlacementForbiddenRows: [0, 11]
};

var level6 = {
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
                mainState.scheduleAttackersWave('Aquila', waveNumber, s, 15, .8, 10);

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

        mainState.nathan = mainState.spawnCharacter('Nathan', this.goalXGrid, this.goalYGrid, 'grid');

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
            additionalCostTiles.push([16, 2, 20]);
            additionalCostTiles.push([5, 2, 20]);
        } else {
            additionalCostTiles.push([16, 2, 0]);
            additionalCostTiles.push([5, 2, 0]);
        }

        return additionalCostTiles;

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .3,
    towerPlacementForbiddenRows: [0, 11]
};