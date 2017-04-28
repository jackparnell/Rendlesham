// Begin Goblin
function Goblin(game, x, y) {
    Attacker.call(this, game, x, y, 'goblin');
    this.simpleSetSize();
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
}
Goblin.prototype = Object.create(Attacker.prototype);
Goblin.prototype.constructor = Goblin;
Goblin.defaultScale = 1;
Goblin.defaultHealth = 3000;
Goblin.pace = 2.15;
Goblin.coinsValue = 15;
Goblin.scoreValue = 15;
Goblin.spriteHeight = 48;
Goblin.prototype.update = function() {
    Attacker.prototype.update.call(this);
    if (!this.alive) {
        return;
    }
    this.simpleAnimate();
};
// End Goblin

// Begin Imp
function Imp(game, x, y) {
    Attacker.call(this, game, x, y, 'imp');
    this.simpleSetSize();
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
}
Imp.prototype = Object.create(Attacker.prototype);
Imp.prototype.constructor = Imp;
Imp.defaultScale = 1;
Imp.defaultHealth = 1500;
Imp.pace = 3.2;
Imp.coinsValue = 15;
Imp.scoreValue = 15;
Imp.spriteHeight = 48;
Imp.prototype.update = function() {
    Attacker.prototype.update.call(this);
    if (!this.alive) {
        return;
    }
    this.simpleAnimate();
};
// End Imp

// Begin Bogeyman
function Bogeyman(game, x, y) {
    Attacker.call(this, game, x, y, 'bogeyman');
    this.simpleSetSize();
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
}
Bogeyman.prototype = Object.create(Attacker.prototype);
Bogeyman.prototype.constructor = Bogeyman;
Bogeyman.defaultScale = 1;
Bogeyman.defaultHealth = 1500;
Bogeyman.pace = 2.15;
Bogeyman.coinsValue = 10;
Bogeyman.scoreValue = 10;
Bogeyman.spriteHeight = 48;
Bogeyman.prototype.update = function() {
    Attacker.prototype.update.call(this);
    if (!this.alive) {
        return;
    }
    this.simpleAnimate();
};
// End Bogeyman

// Begin Kappa
function Kappa(game, x, y) {
    Attacker.call(this, game, x, y, 'kappa');
    this.simpleSetSize();
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 15, false, true);
}
Kappa.prototype = Object.create(Attacker.prototype);
Kappa.prototype.constructor = Kappa;
Kappa.defaultScale = 1;
Kappa.defaultHealth = 1000;
Kappa.pace = 4.5;
Kappa.coinsValue = 5;
Kappa.scoreValue = 10;
Kappa.spriteHeight = 48;
Kappa.prototype.update = function() {
    Attacker.prototype.update.call(this);
    if (!this.alive) {
        return;
    }
    this.simpleAnimate();
};
// End Kappa

// Begin Ogre
function Ogre(game, x, y) {
    Attacker.call(this, game, x, y, 'ogre');
    this.simpleSetSize();
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 15, false, true);
}
Ogre.prototype = Object.create(Attacker.prototype);
Ogre.prototype.constructor = Ogre;
Ogre.defaultScale = 1;
Ogre.defaultHealth = 6000;
Ogre.pace = 1.8;
Ogre.coinsValue = 20;
Ogre.scoreValue = 20;
Ogre.spriteHeight = 48;
Ogre.prototype.update = function() {
    Attacker.prototype.update.call(this);
    if (!this.alive) {
        return;
    }
    this.simpleAnimate();
};
// End Ogre