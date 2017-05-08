var zones = {
    eastAnglia: {
        levelOrdering: {
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
    startingCoins: 100,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .21,
    towerPlacementForbiddenRows: [0, 11],
    towersAvailable: ['Gun'],
    distinctWaves: true,
    previousLevelName: null
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
    startingCoins: 150,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .25,
    towerPlacementForbiddenRows: [0, 11],
    towersAvailable: ['Gun', 'Freezer'],
    distinctWaves: true,
    previousLevelName: 'fridayStreet'
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
    startingCoins: 150,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .35,
    towerPlacementForbiddenRows: [0, 10, 11],
    distinctWaves: true,
    previousLevelName: 'orfordRoad'
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
    startingCoins: 150,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .38,
    towerPlacementForbiddenRows: [0, 11],
    previousLevelName: 'orfordness'
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
    towerPlacementForbiddenRows: [0, 11],
    previousLevelName: 'westletonHeath'
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
    towerPlacementForbiddenRows: [0, 11],
    previousLevelName: 'bartonMills'
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
    towerPlacementForbiddenRows: [0, 11],
    previousLevelName: 'worthamLing'
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
    startingCoins: 400,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .3,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true,
    theme: 'snow',
    distinctWaves: true,
    previousLevelName: 'waveneyCrossing'
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
    startingCoins: 300,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .29,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true,
    previousLevelName: 'frozenFen'
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
    startingCoins: 300,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthModifier: .35,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true,
    previousLevelName: 'sandringhamWoods'
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
    startingCoins: 350,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 6,
    goalXGrid: 1,
    goalYGrid: 6,
    waveHealthModifier: .37,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    bullyGoalCoordinates: [[17, 6], [18, 10], [1, 4], [4, 8], [11, 8]],
    previousLevelName: 'holkhamBeach'
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
    startingCoins: 250,
    startingLives: 5,
    entryXGrid: 10,
    entryYGrid: 11,
    goalXGrid: 12,
    goalYGrid: 1,
    waveHealthModifier: .35,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    previousLevelName: 'holkhamBeach'
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
                    gap: 1,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 250,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 6,
    goalXGrid: 1,
    goalYGrid: 6,
    waveHealthModifier: .38,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: true,
    previousLevelName: 'westRudhamChurchyard'
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
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 8,
    entryYGrid: 11,
    goalXGrid: 12,
    goalYGrid: 1,
    waveHealthCubicA: .1,
    waveHealthCubicB: .2,
    waveHealthCubicC: .4,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    previousLevelName: 'kingsLynn'
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
            duration: 24,
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
            duration: 19,
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
            duration: 24,
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
                    gap: 1,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 3,
    goalYGrid: 6,
    waveHealthQuadraticA: .2,
    waveHealthQuadraticB: .44,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    previousLevelName: 'pumpkinPatch'
};

/*
var helhoughton = {
    name: 'helhoughton',
    mapName: 'helhoughton',
    title: 'Helhoughton',
    waveInfo: {
        wave1: {
            duration: 27,
            attacks: [
                {
                    className: 'Bogeyman',
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
                    className: 'Goblin',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Bogeyman',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Goblin',
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
                    className: 'Imp',
                    duration: 15,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Bogeyman',
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
                    className: 'Imp',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Goblin',
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
                    className: 'Goblin',
                    duration: 10,
                    gap: .8,
                    delay: 0
                },
                {
                    className: 'Goblin',
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
                    className: 'Imp',
                    duration: 30,
                    gap: .75,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 400,
    startingLives: 5,
    entryXGrid: 0,
    entryYGrid: 10,
    goalXGrid: 39,
    goalYGrid: 10,
    waveHealthModifier: .28,
    towerPlacementForbiddenRows: [0, 1, 20, 21],
    towerPlacementForbiddenColumns: [0, 1, 38, 39],
    canPlaceTowerOnPathway: true,
    distinctWaves: true,
    tileSetImageName: 'roguelikeSheet_transparent',
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true
};
*/

var iclandu = {
    name: 'iclandu',
    mapName: 'iclandu',
    title: 'Iclandu',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Bogeyman',
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
                    className: 'Goblin',
                    duration: 10,
                    gap: 1.25,
                    delay: 0
                },
                {
                    className: 'Bogeyman',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Goblin',
                    duration: 5,
                    gap: 1.25,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 18,
            attacks: [
                {
                    className: 'Goblin',
                    duration: 14,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Bogeyman',
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
                    className: 'Imp',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Goblin',
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
                    className: 'Kappa',
                    duration: 10,
                    gap: .7,
                    delay: 0
                },
                {
                    className: 'Goblin',
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
                    className: 'Imp',
                    duration: 30,
                    gap: .8,
                    delay: 0
                }
            ]
        },
        wave7: {
            duration: 30,
            attacks: [
                {
                    className: 'Skull',
                    duration: 28,
                    gap: .8,
                    delay: 0
                }
            ]
        },
        wave8: {
            duration: 27,
            attacks: [
                {
                    className: 'Cyclops',
                    duration: 25,
                    gap: 1,
                    delay: 0
                }
            ]
        },
        wave9: {
            duration: 27,
            attacks: [
                {
                    className: 'Skuller',
                    duration: 25,
                    gap: .8,
                    delay: 0
                }
            ]
        },
        wave10: {
            duration: 27,
            attacks: [
                {
                    className: 'Ogre',
                    duration: 25,
                    gap: 1,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 100,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    waveHealthQuadraticA: 1.2,
    waveHealthQuadraticB: 1.44,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian']
};

var ludus = {
    name: 'ludus',
    mapName: 'ludus',
    title: 'Ludus',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Bogeyman',
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
                    className: 'Goblin',
                    duration: 10,
                    gap: 1.25,
                    delay: 0
                },
                {
                    className: 'Bogeyman',
                    duration: 5,
                    gap: 1,
                    delay: 10
                },
                {
                    className: 'Goblin',
                    duration: 5,
                    gap: 1.25,
                    delay: 15
                }
            ]
        },
        wave3: {
            duration: 18,
            attacks: [
                {
                    className: 'Goblin',
                    duration: 14,
                    gap: 2,
                    delay: 0
                },
                {
                    className: 'Bogeyman',
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
                    className: 'Imp',
                    duration: 10,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Goblin',
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
                    className: 'Kappa',
                    duration: 10,
                    gap: .7,
                    delay: 0
                },
                {
                    className: 'Goblin',
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
                    className: 'Imp',
                    duration: 30,
                    gap: .8,
                    delay: 0
                }
            ]
        },
        wave7: {
            duration: 30,
            attacks: [
                {
                    className: 'Skull',
                    duration: 28,
                    gap: .8,
                    delay: 0
                }
            ]
        },
        wave8: {
            duration: 27,
            attacks: [
                {
                    className: 'Cyclops',
                    duration: 25,
                    gap: 1,
                    delay: 0
                }
            ]
        },
        wave9: {
            duration: 27,
            attacks: [
                {
                    className: 'Skuller',
                    duration: 25,
                    gap: .8,
                    delay: 0
                }
            ]
        },
        wave10: {
            duration: 27,
            attacks: [
                {
                    className: 'Ogre',
                    duration: 25,
                    gap: 1,
                    delay: 0
                }
            ]
        }

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
    waveHealthModifier: .44,
    towerPlacementForbiddenRows: [0, 11],
    towerPlacementForbiddenColumns: [7, 8, 9, 10, 11, 12, 13, 14],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian']
};