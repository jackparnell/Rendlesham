var waveNumber;
var lastLevel = 4;

var level1 = {
    waveInfo: {
        wave1: {
            duration: 25,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+20; i += 2) {

                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);

                }

            }
        },
        wave2: {
            duration: 15,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i++) {
                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);
                }

            }
        },
        wave3: {
            duration: 20,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+15; i += 2) {
                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);
                }
                for (i = s+1; i < s+16; i += 2) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }

            }
        },
        wave4: {
            duration: 15,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .75) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }

            }
        },
        wave5: {
            duration: 15,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .5) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }

            }
        },
        wave6: {
            duration: 12,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .3) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }

            }
        }

    },
    begin: function() {

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(level1.waveInfo).length;

        for (var wave in level1.waveInfo) {
            if (level1.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                level1.waveInfo[wave].createEvents(s);

                s += level1.waveInfo[wave].duration;

            }
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.spawnObstacle('TallBrownMushroom', 2, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 11, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 9, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 18, 6, 'grid');


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

var level2 = {
    waveInfo: {
        wave1: {
            duration: 27,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+20; i += 1.75) {

                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);

                }
                for (i = s+20; i < s+23; i += 1.75) {

                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);

                }

            }
        },
        wave2: {
            duration: 17,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i++) {
                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);
                }
                for (i = s+10; i < s+14; i += 1.5) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        },
        wave3: {
            duration: 18,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+15; i += 2) {
                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);
                }
                for (i = s+1; i < s+16; i += 2) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        },
        wave4: {
            duration: 23,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .5) {
                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);
                }
                for (i = s+10; i < s+20; i++) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        },
        wave5: {
            duration: 18,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .5) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }
                for (i = s+10; i < s+15; i += .75) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        },
        wave6: {
            duration: 17,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+5; i += .3) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }
                for (i = s+5; i < s+15; i += .5) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        }

    },
    begin: function() {

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(level2.waveInfo).length;

        for (var wave in level2.waveInfo) {
            if (level2.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                level2.waveInfo[wave].createEvents(s);

                s += level2.waveInfo[wave].duration;

            }
        }

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));

        mainState.spawnObstacle('TallBrownMushroom', 7, 1, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 9, 1, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 11, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 13, 8, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 17, 3, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 16, 4, 'grid');


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
    startingLives: 5
};

var level3 = {
    waveInfo: {
        wave1: {
            duration: 30,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+20; i += 1.75) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Oscar'
                        ).autoDestroy = true
                    );
                }
                for (i = s+20; i < s+25; i += 1.75) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Mib'
                        ).autoDestroy = true
                    );
                }

            }
        },
        wave2: {
            duration: 20,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i++) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Oscar'
                        ).autoDestroy = true
                    );
                }
                for (i = s+10; i < s+14; i ++) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Mib'
                        ).autoDestroy = true
                    );
                }

            }
        },
        wave3: {
            duration: 20,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+15; i += 2) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Oscar'
                        ).autoDestroy = true
                    );
                }
                for (i = s+1; i < s+16; i += 2) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Mib'
                        ).autoDestroy = true
                    );
                }

            }
        },
        wave4: {
            duration: 25,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .5) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Aquila'
                        ).autoDestroy = true
                    );
                }
                for (i = s+10; i < s+20; i++) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Mib'
                        ).autoDestroy = true
                    );
                }

            }
        },
        wave5: {
            duration: 20,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .5) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Aquila'
                        ).autoDestroy = true
                    );
                }
                for (i = s+10; i < s+15; i += .75) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Mib'
                        ).autoDestroy = true
                    );
                }

            }
        },
        wave6: {
            duration: 15,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+5; i += .3) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Aquila'
                        ).autoDestroy = true
                    );
                }
                for (i = s+5; i < s+10; i += .5) {
                    timerEvents.push(
                        game.time.events.add(
                            Phaser.Timer.SECOND * i,
                            mainState.spawnAttacker,
                            mainState,
                            'Mib'
                        ).autoDestroy = true
                    );
                }

            }
        }

    },
    begin: function() {

        var s = 0;
        var waveNumber = 0;
        var totalWaves = Object.keys(level3.waveInfo).length;

        for (var wave in level3.waveInfo) {
            if (level3.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.displayMessage,
                        mainState,
                        'Wave ' + waveNumber + ' / ' + totalWaves
                    ).autoDestroy = true
                );

                level3.waveInfo[wave].createEvents(s);

                s += level3.waveInfo[wave].duration;

            }
        }

        mainState.spawnObstacle('TallBrownMushroom', 17, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 18, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 5, 2, 'grid');
        mainState.spawnObstacle('TallBrownMushroom', 2, 8, 'grid');

        timerEvents.push(game.time.events.add(Phaser.Timer.SECOND * s, mainState.lastWaveDispatched, mainState));


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
    startingLives: 5
};

var level4 = {
    waveInfo: {
        wave1: {
            duration: 25,
            createEvents: function(s) {
                var i;
                for (i = s; i < s+20; i += 1.75) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }
            }
        },
        wave2: {
            duration: 25,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+5; i++) {
                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);
                }
                for (i = s+10; i < s+15; i++) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }
                for (i = s+15; i < s+20; i++) {
                    mainState.spawnAttackerDelayed('Oscar', i, waveNumber);
                }

            }
        },
        wave3: {
            duration: 18,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+15; i += 2) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }
                for (i = s+1; i < s+16; i += 2) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }

            }
        },
        wave4: {
            duration: 25,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .5) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }
                for (i = s+10; i < s+20; i++) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        },
        wave5: {
            duration: 30,
            createEvents: function(s) {

                var i;

                for (i = s; i < s+10; i += .5) {
                    mainState.spawnAttackerDelayed('Aquila', i, waveNumber);
                }
                for (i = s+10; i < s+25; i += .8) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        },
        wave6: {
            duration: 35,
            createEvents: function(s) {

                var i;

                for (i = s+5; i < s+15; i += .75) {
                    mainState.spawnAttackerDelayed('Mib', i, waveNumber);
                }

            }
        }

    },
    begin: function() {

        var currentLevel = level2;

        var s = 0;
        waveNumber = 0;
        var totalWaves = Object.keys(currentLevel.waveInfo).length;

        for (var wave in level2.waveInfo) {
            if (currentLevel.waveInfo.hasOwnProperty(wave)) {

                waveNumber ++;

                timerEvents.push(
                    game.time.events.add(
                        Phaser.Timer.SECOND * s,
                        mainState.startWave,
                        mainState,
                        waveNumber
                    ).autoDestroy = true
                );

                currentLevel.waveInfo[wave].createEvents(s);

                s += currentLevel.waveInfo[wave].duration;

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
    startingLives: 5
};