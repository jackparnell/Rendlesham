var levelOrdering = {
    'eastAnglia': {
        1: 'fridayStreet',
        2: 'orfordRoad',
        3: 'orfordness',
        4: 'westletonHeath',
        5: 'bartonMills',
        6: 'worthamLing',
        7: 'waveneyCrossing',
        8: 'frozenFen',
        9: 'sandringhamWoods',
        10: 'holkhamBeach',
        11: 'northCreake',
        12: 'westRudhamChurchyard',
        13: 'kingsLynn',
        14: 'pumpkinPatch',
        15: 'shouldhamWarren'
    }
};

var fridayStreet = {
    name: 'fridayStreet',
    mapName: 'fridayStreet',
    title: 'Friday Street',
    waveInfo: {
        wave1: {
            duration: 25,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 20,
                    gap: 2.5,
                    delay: .5
                }
            ]
        },
        wave2: {
            duration: 15,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1.5,
                    delay: 0
                }
            ]
        },
        wave3: {
            duration: 20,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 15,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: 1.25,
                    delay: 0
                }
            ]
        },
        wave5: {
            duration: 15,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: 1,
                    delay: 0
                }
            ]
        },
        wave6: {
            duration: 12,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .75,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    startingCoins: 100,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .2,
    towerPlacementForbiddenRows: [0, 11],
    towersAvailable: ['Gun'],
    distinctWaves: true
};

var orfordRoad = {
    name: 'orfordRoad',
    mapName: 'orfordRoad',
    title: 'Orford Road',
    waveInfo: {
        wave1: {
            duration: 28,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 20,
                    gap: 1.75,
                    delay: 1
                },
                {
                    className: 'Mib',
                    duration: 3,
                    gap: 1.75,
                    delay: 21
                }
            ]
        },
        wave2: {
            duration: 17,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1.25,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 4,
                    gap: 1.75,
                    delay: 10
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1.5,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 18,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1.25,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 17,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 5,
                    gap: .6,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: .8,
                    delay: 5
                }
            ]
        }
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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    startingCoins: 150,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .25,
    towerPlacementForbiddenRows: [0, 11],
    towersAvailable: ['Gun', 'Freezer'],
    distinctWaves: true
};

var orfordness = {
    name: 'orfordness',
    mapName: 'orfordness',
    title: 'Orfordness',
    waveInfo: {
        wave1: {
            duration: 30,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 20,
                    gap: 1.75,
                    delay: 1
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1.75,
                    delay: 21
                }
            ]
        },
        wave2: {
            duration: 20,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1.25,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 6,
                    gap: 1.25,
                    delay: 10
                }
            ]
        },
        wave3: {
            duration: 20,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 25,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .75,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1.5,
                    delay: 11
                }
            ]
        },
        wave5: {
            duration: 22,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .75,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 8,
                    gap: 1.25,
                    delay: 11
                }
            ]
        },
        wave6: {
            duration: 15,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 5,
                    gap: .55,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: .8,
                    delay: 5
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    startingCoins: 150,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .33,
    towerPlacementForbiddenRows: [0, 10, 11],
    distinctWaves: true
};

var westletonHeath = {
    name: 'westletonHeath',
    mapName: 'westletonHeath',
    title: 'Westleton Heath',
    waveInfo: {
        wave1: {
            duration: 25.5,
            attacks: [
                {
                    className: 'Roger',
                    duration: 20,
                    gap: 1.75,
                    delay: 2.5
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Oscar',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 18,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .9,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1.1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .9,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .95,
                    delay: 0
                }
            ]
        }
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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    startingCoins: 150,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .38,
    towerPlacementForbiddenRows: [0, 11]
};

var bartonMills = {
    name: 'bartonMills',
    mapName: 'bartonMills',
    title: 'Barton Mills',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 20,
                    gap: 1.75,
                    delay: 1
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Oscar',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: .6,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .6,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .75,
                    delay: 0
                }
            ]
        }
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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
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

var worthamLing = {
    name: 'worthamLing',
    mapName: 'worthamLing',
    title: 'Wortham Ling',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 20,
                    gap: 1.75,
                    delay: 1
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Roger',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 24,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .5,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 29,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .5,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .8,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .75,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
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

var waveneyCrossing = {
    name: 'waveneyCrossing',
    mapName: 'waveneyCrossing',
    title: 'Waveney Crossing',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 20,
                    gap: 1.75,
                    delay: 1
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Oscar',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 24,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: .5,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 29,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .6,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 33,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .8,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        var additionalCostTiles = [];

        if (attacker.incrementalId % 2) {
            additionalCostTiles.push([17, 2, 20]);
            additionalCostTiles.push([4, 2, 20]);
        } else {
            additionalCostTiles.push([17, 2, 0]);
            additionalCostTiles.push([4, 2, 0]);
        }

        return additionalCostTiles;

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .33,
    towerPlacementForbiddenRows: [0, 11]
};

var frozenFen = {
    name: 'frozenFen',
    mapName: 'frozenFen',
    title: 'Frozen Fen',
    waveInfo: {
        wave1: {
            duration: 27,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 20,
                    gap: 1.75,
                    delay: 2.5
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Roger',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 24,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .5,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 29,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .6,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .75,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 400,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .28,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true,
    theme: 'snow',
    distinctWaves: true
};

var sandringhamWoods = {
    name: 'sandringhamWoods',
    mapName: 'sandringhamWoods',
    title: 'Sandringham Woods',
    waveInfo: {
        wave1: {
            duration: 27,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 20,
                    gap: 1.75,
                    delay: 2
                }
            ]
        },
        wave2: {
            duration: 24,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Oscar',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 24,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: .75,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .6,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 33,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .75,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 300,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .29,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true
};

var holkhamBeach = {
    name: 'holkhamBeach',
    mapName: 'holkhamBeach',
    title: 'Holkham Beach',
    waveInfo: {
        wave1: {
            duration: 27,
            attacks: [
                {
                    className: 'Roger',
                    duration: 20,
                    gap: 1.75,
                    delay: 2.5
                }
            ]
        },
        wave2: {
            duration: 24,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Roger',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 24,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: .75,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 29,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .6,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 33,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .75,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 300,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .35,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true
};

var northCreake = {
    name: 'northCreake',
    mapName: 'northCreake',
    title: 'North Creake',
    waveInfo: {
        wave1: {
            duration: 27,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: 1.75,
                    delay: 2.5
                },
                {
                    className: 'Roger',
                    duration: 10,
                    gap: 1.75,
                    delay: 12.5
                }
            ]
        },
        wave2: {
            duration: 23.5,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Roger',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 19,
            attacks: [
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23.5,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28.5,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 25,
                    gap: .85,
                    delay: 0
                }
            ]
        },
        wave6: {
            duration: 33,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: 1,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 350,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 6,
    goalXGrid: 1,
    goalYGrid: 6,
    waveHealthModifier: .37,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    bullyGoalCoordinates: [[17, 6], [18, 10], [1, 4], [4, 8], [11, 8]]
};

var westRudhamChurchyard = {
    name: 'westRudhamChurchyard',
    mapName: 'westRudhamChurchyard',
    title: 'West Rudham Churchyard',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 20,
                    gap: 1.75,
                    delay: 1
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Oscar',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Aquila',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 18,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: .75,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .75,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .8,
                    delay: 0
                }
            ]
        }
    },
    begin: function() {

        this.nightTime = game.add.tileSprite(0, 0, game.camera.width, game.camera.height, 'gameOverBackground');
        this.nightTime.fixedToCamera = true;
        this.nightTime.alpha = .5;

        game.overlays.add(this.nightTime);

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 250,
    startingLives: 5,
    entryXGrid: 10,
    entryYGrid: 11,
    goalXGrid: 12,
    goalYGrid: 1,
    waveHealthModifier: .35,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false
};

var kingsLynn = {
    name: 'kingsLynn',
    mapName: 'kingsLynn',
    title: 'King\'s Lynn Quayside',
    waveInfo: {
        wave1: {
            duration: 27,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 20,
                    gap: 1.75,
                    delay: 2
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Oscar',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Aquila',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 18,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .8,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .85,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 250,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 6,
    goalXGrid: 1,
    goalYGrid: 6,
    waveHealthModifier: .38,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true
};

var pumpkinPatch = {
    name: 'pumpkinPatch',
    mapName: 'pumpkinPatch',
    title: 'Pumpkin Patch',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Oscar',
                    duration: 20,
                    gap: 1.75,
                    delay: 1
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Roger',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Aquila',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 18,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 15,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: .75,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: .9,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .75,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .75,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 8,
    entryYGrid: 11,
    goalXGrid: 12,
    goalYGrid: 1,
    waveHealthModifier: .44,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false
};

var shouldhamWarren = {
    name: 'shouldhamWarren',
    mapName: 'shouldhamWarren',
    title: 'Shouldham Warren',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 20,
                    gap: 1.25,
                    delay: 1
                }
            ]
        },
        wave2: {
            duration: 23,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Roger',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Aquila',
                    duration: 5,
                    gap: 1,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 18,
            attacks: [
                {
                    className: 'Dibley',
                    duration: 14,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 14,
                    gap: 2,
                    delay: 1
                }
            ]
        },
        wave4: {
            duration: 23,
            attacks: [
                {
                    className: 'Aquila',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Mib',
                    duration: 10,
                    gap: 1.25,
                    delay: 10
                }
            ]
        },
        wave5: {
            duration: 28,
            attacks: [
                {
                    className: 'Roger',
                    duration: 10,
                    gap: 1.2,
                    delay: 0
                },
                {
                    className: 'Aquila',
                    duration: 15,
                    gap: .9,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 32,
            attacks: [
                {
                    className: 'Mib',
                    duration: 30,
                    gap: .8,
                    delay: 0
                }
            ]
        }

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
        if (mainState.countObstaclesWithCoinsValue() <= mainState.startingObstaclesWithCoinsValue * .4) {
            stars ++;
        }
        return stars;
    },
    pathAdditionalCostTiles: function(attacker) {

        return mainState.globalAdditionalCostTiles;

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 3,
    goalYGrid: 6,
    waveHealthModifier: .4,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false
};