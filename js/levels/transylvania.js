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
                    gap: 1.1,
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
    goalCharacterClassName: 'Wizard',
    waveHealthCubicA: .03,
    waveHealthCubicB: .06,
    waveHealthCubicC: .33,
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
                    gap: 1.2,
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
                    gap: 1.2,
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
                    gap: .8,
                    delay: 10
                }
            ]
        },
        wave6: {
            duration: 27,
            attacks: [
                {
                    className: 'Imp',
                    duration: 25,
                    gap: .6,
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
                    gap: .85,
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
                    gap: 1.2,
                    delay: 0
                }
            ]
        }

    },
    pathAdditionalCostTiles: function(attacker)
    {
        let additionalCostTiles = [];

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
    goalCharacterClassName: 'Wizard',
    waveHealthCubicA: .02,
    waveHealthCubicB: .04,
    waveHealthCubicC: .39,
    towerPlacementForbiddenRows: [0, 11],
    towerPlacementForbiddenColumns: [7, 8, 9, 10, 11, 12, 13, 14],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian'],
    previousLevelName: 'iclandu'
};

var draculeaBandului = {
    name: 'draculeaBandului',
    mapName: 'draculeaBandului',
    title: 'Draculea Bandului',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Villager',
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
                    className: 'Kappa',
                    duration: 5,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Imp',
                    duration: 5,
                    gap: 1,
                    delay: 5
                },
                {
                    className: 'Goblin',
                    duration: 10,
                    gap: 1.1,
                    delay: 10
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
            duration: 27,
            attacks: [
                {
                    className: 'Cyclops',
                    duration: 25,
                    gap: 1.5,
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
                    gap: .85,
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
                    gap: 1.1,
                    delay: 0
                }
            ]
        }

    },
    pathAdditionalCostTiles: function(attacker)
    {
        let additionalCostTiles = [];

        if (attacker.incrementalId % 2) {
            additionalCostTiles.push([15, 5, 20]);
            additionalCostTiles.push([9, 5, 0]);
        } else {
            additionalCostTiles.push([15, 5, 0]);
            additionalCostTiles.push([9, 5, 20]);
        }

        return additionalCostTiles;
    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 1,
    goalYGrid: 5,
    goalCharacterClassName: 'Wizard',
    waveHealthCubicA: .02,
    waveHealthCubicB: .06,
    waveHealthCubicC: .39,
    towerPlacementForbiddenRows: [0, 11],
    towerPlacementForbiddenColumns: [0, 21],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian'],
    previousLevelName: 'ludus'
};

var sacadat = {
    name: 'sacadat',
    mapName: 'sacadat',
    title: 'Sacadat',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Villager',
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
                    className: 'Kappa',
                    duration: 5,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Imp',
                    duration: 5,
                    gap: 1,
                    delay: 5
                },
                {
                    className: 'Goblin',
                    duration: 10,
                    gap: 1,
                    delay: 10
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
            duration: 27,
            attacks: [
                {
                    className: 'Cyclops',
                    duration: 25,
                    gap: 1.5,
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
                    gap: .85,
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
                    gap: 1.1,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 100,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 9,
    goalXGrid: 11,
    goalYGrid: 5,
    goalCharacterClassName: 'Wizard',
    goalCharacterDefaultFacing: 'left',
    waveHealthCubicA: .03,
    waveHealthCubicB: .06,
    waveHealthCubicC: .42,
    towerPlacementForbiddenRows: [0, 11],
    towerPlacementForbiddenColumns: [0, 21],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian'],
    previousLevelName: 'draculeaBandului'
};

var lapusna = {
    name: 'lapusna',
    mapName: 'lapusna',
    title: 'Lapusna',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Villager',
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
                    className: 'Kappa',
                    duration: 5,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Imp',
                    duration: 5,
                    gap: 1,
                    delay: 5
                },
                {
                    className: 'Goblin',
                    duration: 10,
                    gap: 1,
                    delay: 10
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
                    gap: 1.2,
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
            duration: 27,
            attacks: [
                {
                    className: 'Cyclops',
                    duration: 25,
                    gap: 1.4,
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
                    gap: .85,
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
                    gap: 1.2,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 21,
    entryYGrid: 5,
    goalXGrid: 2,
    goalYGrid: 5,
    goalCharacterClassName: 'Wizard',
    waveHealthCubicA: .03,
    waveHealthCubicB: .06,
    waveHealthCubicC: .4,
    towerPlacementForbiddenRows: [0, 11],
    towerPlacementForbiddenColumns: [0, 21],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian'],
    previousLevelName: 'sacadat'
};

var rogojel = {
    game,
    name: 'rogojel',
    mapName: 'rogojel',
    title: 'Rogojel',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Villager',
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
                    className: 'Kappa',
                    duration: 5,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Imp',
                    duration: 5,
                    gap: 1,
                    delay: 5
                },
                {
                    className: 'Goblin',
                    duration: 10,
                    gap: 1,
                    delay: 10
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
            duration: 27,
            attacks: [
                {
                    className: 'Cyclops',
                    duration: 25,
                    gap: 1.5,
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
                    gap: .85,
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
                    gap: 1.1,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 0,
    entryYGrid: 5,
    goalXGrid: 28,
    goalYGrid: 5,
    goalCharacterClassName: 'Wizard',
    goalCharacterDefaultFacing: 'left',
    waveHealthCubicA: .03,
    waveHealthCubicB: .06,
    waveHealthCubicC: .4,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian'],
    previousLevelName: 'lapusna',
    mapScroll: true,
    verticalScroll: false,
    horizontalScroll: true,
    introduction: function()
    {
        this.game.state.states.play.levelToRightAndBackIntroduction();
    }
};

var valeaDraganului = {
    game,
    name: 'valeaDraganului',
    mapName: 'valeaDraganului',
    title: 'Valea Draganului',
    waveInfo: {
        wave1: {
            duration: 26,
            attacks: [
                {
                    className: 'Villager',
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
                    className: 'Kappa',
                    duration: 5,
                    gap: 1,
                    delay: 0
                },
                {
                    className: 'Imp',
                    duration: 5,
                    gap: 1,
                    delay: 5
                },
                {
                    className: 'Goblin',
                    duration: 10,
                    gap: 1,
                    delay: 10
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
            ],
            obstacleAttackerSpawns: [
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 27,
                    gridY: 5,
                    attackerClassName: 'Ghost',
                    delays: [5, 15]
                },
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 24,
                    gridY: 7,
                    attackerClassName: 'Ghost',
                    delays: [10]
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
            duration: 27,
            attacks: [
                {
                    className: 'Cyclops',
                    duration: 25,
                    gap: 1.5,
                    delay: 0
                }
            ],
            obstacleAttackerSpawns: [
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 17,
                    gridY: 8,
                    attackerClassName: 'Ghost',
                    delays: [10]
                },
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 14,
                    gridY: 6,
                    attackerClassName: 'Ghost',
                    delays: [15]
                },
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 14,
                    gridY: 4,
                    attackerClassName: 'Ghost',
                    delays: [20]
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
                    gap: .85,
                    delay: 0
                }
            ],
            obstacleAttackerSpawns: [
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 11,
                    gridY: 9,
                    attackerClassName: 'Ghost',
                    delays: [5]
                },
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 8,
                    gridY: 6,
                    attackerClassName: 'Ghost',
                    delays: [10]
                },
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 8,
                    gridY: 4,
                    attackerClassName: 'Ghost',
                    delays: [15]
                },
                {
                    obstacleClassNames: ['TombstoneLeft', 'TombstoneRight'],
                    gridX: 8,
                    gridY: 2,
                    attackerClassName: 'Ghost',
                    delays: [20]
                }
            ]
        },
        wave10: {
            duration: 27,
            attacks: [
                {
                    className: 'Ogre',
                    duration: 25,
                    gap: 1.1,
                    delay: 0
                }
            ]
        }

    },
    startingCoins: 200,
    startingLives: 5,
    entryXGrid: 29,
    entryYGrid: 4,
    goalXGrid: 1,
    goalYGrid: 5,
    goalCharacterClassName: 'Wizard',
    waveHealthCubicA: .05,
    waveHealthCubicB: .08,
    waveHealthCubicC: .4,
    towerPlacementForbiddenRows: [0, 11],
    canPlaceTowerOnPathway: false,
    distinctWaves: true,
    bulletsCanOnlyHitTarget: true,
    calculateAttackerProjectedHealth: true,
    packs: ['transylvanian'],
    previousLevelName: 'rogojel',
    mapScroll: true,
    verticalScroll: false,
    horizontalScroll: true,
    introduction: function()
    {
        this.game.state.states.play.levelLeftToRightIntroduction();
    }
};