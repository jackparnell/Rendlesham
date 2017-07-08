class Decoration extends GameSprite
{
    constructor(game, x, y, spriteName)
    {
        super(game, x, y, spriteName);

        this.moveable = false;

        this.guid = guid();

        game.physics.arcade.enable(this);

        this.anchor.setTo(0.5, 0.5);

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
    }

    initialise(){}

    update(){}

    die()
    {
        this.kill();
    }

    setTint(tint)
    {
        this.tint = tint;
    }

    unTint()
    {
        this.setTint(0xffffff);
    }

    setAngle(angle)
    {
        this.angle = angle;
    }

    prepareForGameOver()
    {
        this.kill();
    }
}

window.Explosion = class Explosion extends Decoration
{
    constructor(game, x, y)
    {
        super(game, x, y, 'explosion');
        this.initialise();
    }

    initialise()
    {
        super.initialise();
        this.unTint();
        this.angle = getRandomInteger(-45, 45);
        this.lifespan = 500;
        this.animations.add('explode', [0, 1, 2, 3, 4, 5], 12, false);
        this.animations.play('explode');
        this.alpha = .6;
    }

    reuse(x, y)
    {
        this.reset(x, y);
        this.initialise();
    }
};

window.Zap = class Zap extends Decoration
{
    constructor(game, x, y)
    {
        super(game, x, y, 'Zap');
        this.initialise();
    }

    initialise()
    {
        super.initialise();
        this.unTint();
        this.lifespan = 250;
        this.animations.add('explode', [0, 1, 2], 12, false);
        this.animations.play('explode');
        this.alpha = .6;
    }

    reuse(x, y)
    {
        this.reset(x, y);
        this.initialise();
    }
};