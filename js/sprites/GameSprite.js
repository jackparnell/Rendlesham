class GameSprite extends Phaser.Sprite
{
    static get DESCRIPTION() { return ''; }

    constructor (game, x, y, spriteName)
    {
        super(game, x, y, spriteName);
        if (this.game.state.current === 'play')
        {
            this.game.state.states.play.userSeesObject(this.constructor.name);
        }
        this.currentState = this.game.state.states[this.game.state.current];

        if (
            this.currentState.hasOwnProperty('level')
            &&
            this.currentState.level.hasOwnProperty('spriteFrameOverrides')
            &&
            this.currentState.level.spriteFrameOverrides.hasOwnProperty(this.constructor.name)
        )
        {
            this.frame = this.currentState.level.spriteFrameOverrides[this.constructor.name];
        }
    }

    getScale()
    {
        let scale;
        if ("creationTurn" in this && (game.globals.turn - this.creationTurn) > 3)
        {
            scale = this.scale.x;
        }
        else
        {
            scale = window[this.constructor.name].defaultScale ? window[this.constructor.name].defaultScale : 1;
        }
        return scale;
    }

    getAngle()
    {
        return this.angle;
    }

    getSpriteName()
    {
        return this.constructor.name.toLowerCase();
    }

    createCentralCircle(circleDiameter)
    {
        let offset = Math.round(this.game.state.states.play.squareWidth * .5) - circleDiameter;
        this.body.setCircle(circleDiameter, offset, offset);
    }

    move_to(target_position)
    {
        if (!this.moveable)
        {
            throw {
                'code': 11001,
                'description': 'Moveable only function called on object which is not moveable.'
            };
        }
        this.game.state.states.play.pathfinding.find_path(
            this.position,
            target_position,
            this.move_through_path,
            this,
            this.getAdditionalCostTiles()
        );
    }

    move_through_path(path)
    {
        if (!this.moveable)
        {
            throw {
                'code': 11001,
                'description': 'Moveable only function called on object which is not moveable.'
            };
        }
        if (path !== null)
        {
            this.path = path;
            this.path_step = 0;
        }
        else
        {
            this.path = [];
        }
    }

    reached_target_position(target_position)
    {
        if (!this.moveable)
        {
            throw {
                'code': 11001,
                'description': 'Moveable only function called on object which is not moveable.'
            };
        }
        let distance;
        distance = Phaser.Point.distance(this.position, target_position);
        return distance < 3;
    }

    followPath()
    {
        if (!this.moveable)
        {
            throw {
                'code': 11001,
                'description': 'Moveable only function called on object which is not moveable.'
            };
        }

        if (!this.navigatingToGoal)
        {
            return;
        }


        if (this.domain === 'air')
        {
            this.flyToGoal();
            return;
        }

        if (!this.path || this.path.length === 0)
        {
            if (this.x > this.game.camera.width)
            {
                this.body.velocity.x = -this.speed;
            }
            else
            {
                this.body.velocity.x = 0;
            }
            this.body.velocity.y = 0;
        }
        else
        {
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
                /*
                this.position.x = this.next_position.x;
                this.position.y = this.next_position.y;
                */
                if (this.path_step < this.path.length - 1)
                {
                    this.path_step += 1;
                }
                else
                {
                    this.path = [];
                    this.path_step = -1;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = 0;
                }

                if (typeof this.reachedTargetPosition === 'function')
                {
                    this.reachedTargetPosition();
                }
            }
        }

        /*
         var deltaTime = (game.time.elapsedMS * game.time.fps) / 1000;
         this.body.velocity.x *= deltaTime;
         this.body.velocity.y *= deltaTime;
         */

    }

    flyToGoal()
    {
        this.game.physics.arcade.moveToObject(
            this,
            this.game.state.states.play.goalCharacter,
            this.speed
        );
    }

    moveToCoordinates(gridX, gridY)
    {
        if (!this.moveable)
        {
            throw {
                'code': 11001,
                'description': 'Moveable only function called on object which is not moveable.'
            };
        }
        let pixelCoordinates = this.game.state.states.play.translateGridCoordinatesToPixelCoordinates(
            gridX,
            gridY
        );
        let target_position = new Phaser.Point(pixelCoordinates[0], pixelCoordinates[1]);
        this.move_to(target_position);
        this.pathNeedsRegenerating = false;
    }

    getAdditionalCostTiles()
    {
        if (!this.moveable)
        {
            throw {
                'code': 11001,
                'description': 'Moveable only function called on object which is not moveable.'
            };
        }
        return this.game.state.states.play.pathAdditionalCostTiles(this);
    }

    /**
     * Determines whether grid coordinates have changed since last turn.
     *
     * @returns {boolean}
     */
    haveGridCoordinatesChanged()
    {
        if (!this.moveable)
        {
            throw {
                'code': 11001,
                'description': 'Moveable only function called on object which is not moveable.'
            };
        }
        let gridCoordinatesChanges = false;
        let gridCoordinates = this.game.state.states.play.translatePixelCoordinatesToGridCoordinates(this.x, this.y);
        if (gridCoordinates[0] !== this.gridX || gridCoordinates[1] !== this.gridY)
        {
            this.oldGridX = this.gridX;
            this.oldGridY = this.gridY;
            this.gridX = gridCoordinates[0];
            this.gridY = gridCoordinates[1];
            gridCoordinatesChanges = true;
            this.tilesTraversed ++;
        }
        return gridCoordinatesChanges;
    }

    fadeIn()
    {
        this.alpha = 0;
        this.navigatingToGoal = false;
        let fadeInTween = this.game.add.tween(this).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, true);
        fadeInTween.onComplete.add(
            this.fadeInComplete,
            this
        );
    }

    fadeInComplete()
    {
        this.navigatingToGoal = true;
    }

    simpleAnimate()
    {
        if (this.overrideSimpleAnimate && this.animations.currentAnim && !this.animations.currentAnim.isFinished)
        {
            return;
        }

        if (this.animations.currentAnim && this.animations.currentAnim.name === 'defeated')
        {
            return;
        }

        if (this.isDefeated)
        {
            return;
        }

        if (this.body.velocity.x <= -3)
        {
            this.animations.play('walk');
            this.scale.x = -1;
            return;
        }

        if (this.body.velocity.x >= 3)
        {
            this.animations.play('walk');
            this.scale.x = 1;
            return;
        }

        if (this.hasAnimation('idle'))
        {
            this.animations.play('idle');
            return;
        }

        this.animations.play('walk');
    }

    simpleSetSize()
    {
        let bodyWidth = 25;
        let bodyHeight = 30;
        let offsetX = bodyWidth;
        let offsetY = 45 - bodyHeight;
        this.body.setSize(bodyWidth, bodyHeight, bodyWidth, offsetY);
    }

    hasAnimation(animationName)
    {
        return this.animations._anims.hasOwnProperty(animationName);
    }
}