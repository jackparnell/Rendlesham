var standard = {
    getScale: function()
    {
        let scale;
        if ("creationTurn" in this && (mainState.turn - this.creationTurn) > 3) {
            scale = this.scale.x;
        } else {
            scale = window[this.constructor.name].defaultScale ? window[this.constructor.name].defaultScale : 1;
        }

        // console.log(this.constructor.name + 'defaultScale ' + window[this.constructor.name].defaultScale);

        return scale;
    },
    getAngle: function()
    {
        return this.angle;
    },
    getSpriteName: function()
    {
        return this.constructor.name.toLowerCase();
    },
    createCentralCircle: function(circleDiameter)
    {
        let offset = Math.round(mainState.squareWidth * .5) - circleDiameter;
        this.body.setCircle(circleDiameter, offset, offset);
    }
};

var moveable = {
    move_to: function (target_position)
    {
        mainState.pathfinding.find_path(this.position, target_position, this.move_through_path, this, this.getAdditionalCostTiles());
    },
    move_through_path: function (path) {
        if (path !== null) {
            this.path = path;
            this.path_step = 0;
        } else {
            this.path = [];
        }
    },
    reached_target_position: function (target_position)
    {
        let distance;
        distance = Phaser.Point.distance(this.position, target_position);
        return distance < 3;
    },
    followPath: function()
    {
        // mainState.game.physics.arcade.collide(this, mainState.layers.collision);

        if (!this.path || this.path.length === 0)
        {

            if (this.x > game.camera.width)
            {
                this.body.velocity.x = -this.speed;
            }
            else
            {
                this.body.velocity.x = 0;
            }
            this.body.velocity.y = 0;

        } else {

            this.next_position = this.path[this.path_step];

            if (!this.reached_target_position(this.next_position))
            {
                this.velocity = new Phaser.Point(
                    this.next_position.x - this.position.x,
                    this.next_position.y - this.position.y
                );
                this.velocity.normalize();
                this.body.velocity.x = this.velocity.x * this.speed;
                this.body.velocity.y = this.velocity.y * this.speed;
            }
            else
                {
                this.position.x = this.next_position.x;
                this.position.y = this.next_position.y;
                if (this.path_step < this.path.length - 1) {
                    this.path_step += 1;
                } else {
                    this.path = [];
                    this.path_step = -1;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = 0;
                }

                if (typeof this.reachedTargetPosition === 'function') {
                    this.reachedTargetPosition();
                }

            }
        }

        /*
         var deltaTime = (game.time.elapsedMS * game.time.fps) / 1000;
         this.body.velocity.x *= deltaTime;
         this.body.velocity.y *= deltaTime;
         */

    },
    moveToCoordinates: function(gridX, gridY)
    {

        let pixelCoordinates = mainState.translateGridCoordinatesToPixelCoordinates(
            gridX,
            gridY
        );

        // console.log(this.constructor.name + ' move to ' + gridX + '/' + gridY)

        let target_position = new Phaser.Point(pixelCoordinates[0], pixelCoordinates[1]);
        this.move_to(target_position);

        this.pathNeedsRegenerating = false;

    },
    getAdditionalCostTiles: function()
    {
        return mainState.pathAdditionalCostTiles(this);
    },
    /**
     * Determines whether grid coordinates have changed since last turn.
     *
     * @returns {boolean}
     */
    haveGridCoordinatesChanged: function()
    {
        let gridCoordinatesChanges = false;

        let gridCoordinates = mainState.translatePixelCoordinatesToGridCoordinates(this.x, this.y);

        if (gridCoordinates[0] !== this.gridX || gridCoordinates[1] !== this.gridY) {
            this.oldGridX = this.gridX;
            this.oldGridY = this.gridY;
            this.gridX = gridCoordinates[0];
            this.gridY = gridCoordinates[1];
            gridCoordinatesChanges = true;
            this.tilesTraversed ++;
        }

        return gridCoordinatesChanges;
    }
};