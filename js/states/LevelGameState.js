class LevelGameState extends CanvasGameState
{
    init(obj)
    {
        super.init(obj);

        if (ZONE_INFO.hasOwnProperty(obj.zoneName))
        {
            this.zone = ZONE_INFO[obj.zoneName];
        }
        else
        {
            throw {
                'code': 85701,
                'description': 'Zone ' + obj.zoneName + ' invalid. '
            };
        }

        this.zoneName = obj.zoneName;
        this.levelId = obj.levelNumber;
        this.levelNumber = obj.levelNumber;
        this.mode = obj.mode || 'classic';

        this.fetchLevelInfo();

        this.game = game;
    }

    fetchLevelInfo()
    {
        let level = window[ZONE_INFO[this.zoneName].LEVEL_ORDERING[this.levelId]];
        this.initialWavesCount = Object.keys(level.waveInfo).length;
        // Line below uses jQuery. TODO find a way to do it neatly in vanilla JavaScript.
        this.level = $.extend(true, {}, level);
        return this.level;
    }

    setupLevelGroups()
    {
        // Create groups. Some have already been created in super.create();
        this.towers = this.game.add.group();
        this.obstacles = this.game.add.group();
        this.characters = this.game.add.group();
        this.attackers = this.game.add.group();
        this.weapons = this.game.add.group();
        this.explosions = this.game.add.group();
        this.ZapGroup = this.game.add.group();
        this.crosshairs = this.game.add.group();
        this.game.healthBars = this.game.add.group();
        this.game.bullets = this.game.add.group();
        this.game.overlays = this.game.add.group();
        this.finishedItems = this.game.add.group();
        // Groups below are setup in GameState.create(), however add them again here as in this state they
        // should have a higher z-index than groups above.
        this.game.linkBackgrounds = this.game.add.group();
        this.game.texts = this.game.add.group();
    }

    setupMap()
    {
        if (!this.level.mapName)
        {
            throw {
                'code': 85702,
                'description': 'Zone ' + obj.zoneName + ' invalid. '
            };
        }

        this.map = this.game.add.tilemap(this.level.mapName);

        this.squareWidth = this.map.tileWidth || 35;
        this.halfSquareWidth = this.squareWidth * .5;

        if (!this.level.tileSetImageName)
        {
            this.level.tileSetImageName = 'tiles';
        }

        this.map.tilesets.forEach(function (tileset) {
            this.map.addTilesetImage(tileset.name, tileset.name, this.squareWidth, this.squareWidth, 0, 1);
        }, this);

        // create map layers
        this.layers = {};
        this.map.layers.forEach(function (layer)
        {
            this.layers[layer.name] = this.map.createLayer(layer.name);

            this.game.backgrounds.add(this.layers[layer.name]);

            if (layer.properties.collision) { // collision layer
                let collision_tiles = [];
                layer.data.forEach(function (data_row) { // find tiles used in the layer
                    data_row.forEach(function (tile) {
                        // check if it's a valid tile index and isn't already in the list
                        if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                            collision_tiles.push(tile.index);
                        }
                    }, this);
                }, this);
                this.map.setCollision(collision_tiles, true, layer.name);
            }
        }, this);

        // resize the world to be the size of the current layer
        this.layers[this.map.layer.name].resizeWorld();

        this.backgroundLayer = this.map.createLayer('background');
        this.game.backgrounds.add(this.backgroundLayer);

        if (this.layers.hasOwnProperty('walkable')) {
            this.walkableLayer = this.map.createLayer('walkable');
            this.game.backgrounds.add(this.walkableLayer);
        }

        this.collisionLayer = this.map.createLayer('collision');
        this.game.backgrounds.add(this.collisionLayer);

        this.game.physics.arcade.enable(this.collisionLayer);

        if (this.layers.hasOwnProperty('lava'))
        {
            this.lavaLayer = this.map.createLayer('lava');
            this.game.backgrounds.add(this.lavaLayer);
        }

        let impassableTiles = [];

        if (this.layers.hasOwnProperty('impassable'))
        {
            this.impassableLayer = this.map.createLayer('impassable');
            this.game.backgrounds.add(this.impassableLayer);

            this.impassableLayer.layer.data.forEach(function (data_row) {
                data_row.forEach(function (tile) {
                    if (tile.index > 0 && impassableTiles.indexOf(tile.index) === -1) {
                        impassableTiles.push(tile.x + '_' + tile.y);
                    }
                }, this);
            }, this);
        }

        if (this.layers.hasOwnProperty('impassable2'))
        {
            this.impassable2Layer = this.map.createLayer('impassable2');
            this.game.backgrounds.add(this.impassable2Layer);

            this.impassable2Layer.layer.data.forEach(function (data_row) {
                data_row.forEach(function (tile) {
                    if (tile.index > 0 && impassableTiles.indexOf(tile.index) === -1)
                    {
                        impassableTiles.push(tile.x + '_' + tile.y);
                    }
                }, this);
            }, this);
        }

        this.impassableTiles = impassableTiles;
    }

    setDarkOverlay(alpha = .5)
    {
        this.gameOverBackground = this.game.add.tileSprite(0, 0, this.game.camera.width, this.game.camera.height, 'gameOverBackground');
        this.gameOverBackground.fixedToCamera = true;
        this.game.overlays.add(this.gameOverBackground);
        this.gameOverBackground.alpha = alpha;
    }

    spawnLevelObstacles()
    {
        let level = this.level;

        if (level.obstacles)
        {
            for (let obstacleClassName in level.obstacles)
            {
                if (level.obstacles.hasOwnProperty(obstacleClassName))
                {
                    level.obstacles[obstacleClassName].forEach(function(coordinates)
                    {
                        this.spawnObstacle(obstacleClassName, coordinates[0], coordinates[1], 'grid');
                    }, this);
                }
            }
        }

        switch (this.level.tileSetName) {
            case 'roguelikeSheet_transparent':

                break;
            default:
                this.map.createFromObjects('objects', 51, 'Rock', 0, true, false, this.obstacles, Rock, true);
                this.map.createFromObjects('objects', 63, 'BigBush', 0, true, false, this.obstacles, BigBush, true);
                this.map.createFromObjects('objects', 5, 'BigBushAutumn', 0, true, false, this.obstacles, BigBushAutumn, true);
                this.map.createFromObjects('objects', 64, 'SmallBush', 0, true, false, this.obstacles, SmallBush, true);
                this.map.createFromObjects('objects', 76, 'Snowman', 0, true, false, this.obstacles, Snowman, true);
                this.map.createFromObjects('objects', 78, 'Bulrush', 0, true, false, this.obstacles, Bulrush, true);
                this.map.createFromObjects('objects', 94, 'SnowyPine', 0, true, false, this.obstacles, SnowyPine, true);
                this.map.createFromObjects('objects', 130, 'Crate', 0, true, false, this.obstacles, Crate, true);
                this.map.createFromObjects('objects', 59, 'PurpleRock', 0, true, false, this.obstacles, PurpleRock, true);

                this.map.createFromObjects('objects', 60, 'Pumpkin', 0, true, false, this.obstacles, Pumpkin, true);
                this.map.createFromObjects('objects', 105, 'TallBrownMushroom', 0, true, false, this.obstacles, TallBrownMushroom, true);
                this.map.createFromObjects('objects', 106, 'TallRedMushroom', 0, true, false, this.obstacles, TallRedMushroom, true);
                this.map.createFromObjects('objects', 107, 'TallGreyMushroom', 0, true, false, this.obstacles, TallGreyMushroom, true);
                this.map.createFromObjects('objects', 118, 'PinkCrystal', 0, true, false, this.obstacles, PinkCrystal, true);
                this.map.createFromObjects('objects', 55, 'Puffball', 0, true, false, this.obstacles, Puffball, true);

                this.map.createFromObjects('objects', 108, 'Nathan', 0, true, false, this.characters, Nathan, true);

                this.nathan = this.characters.getFirstAlive();

                if (this.nathan) {
                    this.nathan.drawForceFields();
                }

                this.map.createFromObjects('objects', 120, 'Bully', 0, true, false, this.characters, Bully, true);
                if (typeof this.getBully === 'function')
                {
                    this.bully = this.getBully();
                }

                this.map.createFromObjects('objects', 72, 'Ghost', 0, true, false, this.characters, Ghost, true);
        }
    }

    pixelsNearestTileTopLeftCoordinates(x, y)
    {
        return [
            Math.round(x / this.squareWidth) * this.squareWidth,
            Math.round(y / this.squareWidth) * this.squareWidth
        ];
    }

    positionCamera()
    {
        if (!this.map)
        {
            throw {
                'code': 85703,
                'description': 'Map not initiated. '
            };
        }
        this.positionCameraX();
        this.positionCameraY();
    }

    positionCameraX()
    {
        let x = (this.map.widthInPixels - this.game.width) * .5;
        this.game.camera.x = x;
    }

    positionCameraY()
    {
        let y = (this.map.heightInPixels - this.game.height) * .5;
        this.game.camera.y = y;
    }

    translatePixelCoordinatesToGridCoordinates(x, y)
    {
        x = Math.floor(x / this.squareWidth);
        y = Math.floor(y / this.squareWidth);
        return [x, y];
    }

    translateGridCoordinatesToPixelCoordinates(x, y)
    {
        x = Math.floor(x * this.squareWidth);
        y = Math.floor(y * this.squareWidth);
        return [x, y];
    }
}