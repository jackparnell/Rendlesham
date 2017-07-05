window.Goblin = class Goblin extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'goblin');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Goblin.defaultScale = 1;
Goblin.defaultHealth = 3000;
Goblin.pace = 2.15;
Goblin.coinsValue = 15;
Goblin.scoreValue = 15;
Goblin.spriteHeight = 48;



window.Imp = class Imp extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'imp');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Imp.defaultScale = 1;
Imp.defaultHealth = 2000;
Imp.pace = 3.2;
Imp.coinsValue = 15;
Imp.scoreValue = 15;
Imp.spriteHeight = 48;


window.Bogeyman = class Bogeyman extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'bogeyman');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Bogeyman.defaultScale = 1;
Bogeyman.defaultHealth = 2000;
Bogeyman.pace = 2.15;
Bogeyman.coinsValue = 10;
Bogeyman.scoreValue = 10;
Bogeyman.spriteHeight = 48;


window.Villager = class Villager extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'villager');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Villager.defaultScale = 1;
Villager.defaultHealth = 1500;
Villager.pace = 2.15;
Villager.coinsValue = 5;
Villager.scoreValue = 5;
Villager.spriteHeight = 48;



window.Kappa = class Kappa extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'kappa');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Kappa.defaultScale = 1;
Kappa.defaultHealth = 1500;
Kappa.pace = 4.2;
Kappa.coinsValue = 5;
Kappa.scoreValue = 10;
Kappa.spriteHeight = 50;



window.Ogre = class Ogre extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'ogre');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Ogre.defaultScale = 1;
Ogre.defaultHealth = 6000;
Ogre.pace = 1.8;
Ogre.coinsValue = 20;
Ogre.scoreValue = 20;
Ogre.spriteHeight = 48;


window.Skull = class Skull extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'skull');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Skull.defaultScale = 1;
Skull.defaultHealth = 2000;
Skull.pace = 2.8;
Skull.coinsValue = 10;
Skull.scoreValue = 10;
Skull.spriteHeight = 50;


window.Skuller = class Skuller extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'skuller');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Skuller.defaultScale = 1;
Skuller.defaultHealth = 3000;
Skuller.pace = 2.8;
Skuller.coinsValue = 15;
Skuller.scoreValue = 15;
Skuller.spriteHeight = 48;



window.Cyclops = class Cyclops extends Attacker
{
    constructor(game, x, y)
    {
        super(game, x, y, 'cyclops');
        this.simpleSetSize();
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
    }

    update()
    {
        super.update();
        if (!this.alive)
        {
            return;
        }
        this.simpleAnimate();
    }
};
Cyclops.defaultScale = 1;
Cyclops.defaultHealth = 4000;
Cyclops.pace = 2.8;
Cyclops.coinsValue = 20;
Cyclops.scoreValue = 20;
Cyclops.spriteHeight = 50;