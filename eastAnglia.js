var Rendlesham = Rendlesham || {};

Rendlesham.eastAnglia = function()
{

};

Rendlesham.eastAnglia.prototype = $.extend(true, {}, Rendlesham.gameState.prototype);

Rendlesham.eastAnglia.prototype.preload = function()
{
    this.backgrounds = game.add.group();
    this.pathways = game.add.group();
    this.name = 'rendlesham';
    this.linkBackgrounds = game.add.group();
    this.texts = game.add.group();

    loadMainFiles();
};

Rendlesham.eastAnglia.prototype.init = function()
{

    this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

    this.game.kineticScrolling.configure({
        kineticMovement: false,
        verticalScroll: true,
        verticalWheel: true
    });

    this.zoneName = 'eastAnglia';

};

Rendlesham.eastAnglia.prototype.create = function()
{

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    if (game.device.desktop == false) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

    this.zoneMap = this.game.add.tileSprite(0, 0, 1400, 700, this.zoneName);
    this.backgrounds.add(this.zoneMap);

    this.game.world.setBounds(0, 0, this.zoneMap.width, this.zoneMap.height);

    this.loadUser();

    this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

    this.level = {
        1: {
            x: game.width * .1,
            y: game.height * .1
        },
        2: {
            x: game.width * .3,
            y: game.height * .15
        },
        3: {
            x: game.width * .5,
            y: game.height * .125
        },
        4: {
            x: game.width * .7,
            y: game.height * .175
        },
        5: {
            x: game.width * .85,
            y: game.height * .45
        },
        6: {
            x: game.width * .7,
            y: game.height * .55
        },
        7: {
            x: game.width * .525,
            y: game.height * .425
        },
        8: {
            x: game.width * .375,
            y: game.height * .6
        },
        9: {
            x: game.width * .25,
            y: game.height * .7
        },
        10: {
            x: game.width * .1,
            y: game.height * .75
        },
        11: {
            x: game.width * .15,
            y: game.height * 1
        },
        12: {
            x: game.width * .275,
            y: game.height * 1.15
        },
        13: {
            x: game.width * .45,
            y: game.height * 1.15
        },
        14: {
            x: game.width * .6,
            y: game.height * 1.25
        },
        15: {
            x: game.width * .725,
            y: game.height * 1.2
        }
    };

    this.drawLinesBetweenLevels();

    for (var i = 1; i <= lastLevel; i++) {

        this['level' + i + 'Button'] = game.add.button(this.level[i].x, this.level[i].y, 'ufo', this['clickLevel' + i], this);
        if (!this.isLevelUnlocked(i)) {
            this['level' + i + 'Button'].tint = 0x333333;
            this['level' + i + 'Button'].input.useHandCursor = false;
        }

        this.writeLevelText(i);
        this.addLevelStars(i);

    }

    if (this.user.zones && this.user.zones[this.zoneName]) {
        this.game.camera.x = this.user.zones[this.zoneName].cameraX || 0;
        this.game.camera.y = this.user.zones[this.zoneName].cameraY || 0;
    } else {
        if (!this.user.zones) {
            this.user.zones = {};
        }
        if (!this.user.zones[this.zoneName]) {
            this.user.zones[this.zoneName] = {};
        }
    }

    this.game.kineticScrolling.start();

};

Rendlesham.eastAnglia.prototype.update = function()
{

};

Rendlesham.eastAnglia.prototype.shutdown = function()
{
    this.user.zones[this.zoneName].cameraX = game.camera.x;
    this.user.zones[this.zoneName].cameraY = game.camera.y;
    this.save();
};

Rendlesham.eastAnglia.prototype.clickLevel1 = function()
{
    this.clickLevel(1);
};
Rendlesham.eastAnglia.prototype.clickLevel2 = function()
{
    this.clickLevel(2);
};
Rendlesham.eastAnglia.prototype.clickLevel3 = function()
{
    this.clickLevel(3);
};
Rendlesham.eastAnglia.prototype.clickLevel4 = function()
{
    this.clickLevel(4);
};
Rendlesham.eastAnglia.prototype.clickLevel5 = function()
{
    this.clickLevel(5);
};
Rendlesham.eastAnglia.prototype.clickLevel6 = function()
{
    this.clickLevel(6);
};
Rendlesham.eastAnglia.prototype.clickLevel7 = function()
{
    this.clickLevel(7);
};
Rendlesham.eastAnglia.prototype.clickLevel8 = function()
{
    this.clickLevel(8);
};
Rendlesham.eastAnglia.prototype.clickLevel9 = function()
{
    this.clickLevel(9);
};
Rendlesham.eastAnglia.prototype.clickLevel10 = function()
{
    this.clickLevel(10);
};
Rendlesham.eastAnglia.prototype.clickLevel11 = function()
{
    this.clickLevel(11);
};
Rendlesham.eastAnglia.prototype.clickLevel12 = function()
{
    this.clickLevel(12);
};
Rendlesham.eastAnglia.prototype.clickLevel13 = function()
{
    this.clickLevel(13);
};
Rendlesham.eastAnglia.prototype.clickLevel14 = function()
{
    this.clickLevel(14);
};
Rendlesham.eastAnglia.prototype.clickLevel15 = function()
{
    this.clickLevel(15);
};

Rendlesham.eastAnglia.prototype.clickLevel = function(levelNumber)
{
    if (!this.isLevelUnlocked(levelNumber)) {
        return false;
    }

    game.state.start('main', true, true, levelNumber);
};

Rendlesham.eastAnglia.prototype.isLevelUnlocked = function(levelNumber)
{
    if (levelNumber == 1) {
        return true;
    }

    if (this.user.levelsComplete[levelNumber-1]) {
        return true;
    }

    return false;
};

Rendlesham.eastAnglia.prototype.writeLevelText = function(levelNumber)
{
    var x = this.level[levelNumber].x + 16;
    var y = this.level[levelNumber].y - 19;

    this['level' + levelNumber + 'Text'] = game.add.bitmapText(
        x,
        y,
        bitmapFontName,
        'Level ' + levelNumber,
        18
    );
    this['level' + levelNumber + 'Text'].x = x - (this['level' + levelNumber + 'Text'].width * .5);
};

Rendlesham.eastAnglia.prototype.addLevelStars = function(levelNumber)
{
    if (!this.isLevelUnlocked(levelNumber)) {
        return;
    }

    var stars = this.user.levelStars[levelNumber] || 0;

    var x = this.level[levelNumber].x - 13;
    var y = this.level[levelNumber].y + 35;

    var spriteName;

    for (i = 1; i <= 3; i++) {

        if (i <= stars) {
            spriteName = 'starYellow';
        } else {
            spriteName = 'starCharcoal';
        }

        var star = game.add.sprite(x, y, spriteName);
        star.scale.setTo(.1, .1);

        x += 20;
    }
};

Rendlesham.eastAnglia.prototype.drawLinesBetweenLevels = function()
{
    var graphics = game.add.graphics(0, 0);

    graphics.lineStyle(3, 0x886666, 1);

    for (var i = 1; i < lastLevel; i++) {

        graphics.moveTo(
            Math.round(this.level[i].x + 16),
            Math.round(this.level[i].y + 16)
        );

        graphics.lineTo(
            Math.round(this.level[String(i+1)].x + 16),
            Math.round(this.level[String(i+1)].y + 16)
        );

    }
};
