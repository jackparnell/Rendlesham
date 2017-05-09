Rendlesham.zone = function() {};

Rendlesham.zone.prototype = $.extend(true, {}, Rendlesham.gameState.prototype);

Rendlesham.zone.prototype.preload = function()
{
    this.backgrounds = game.add.group();
    this.pathways = game.add.group();
    this.name = 'rendlesham';
    this.linkBackgrounds = game.add.group();
    this.texts = game.add.group();

    loadMainFiles();
};

Rendlesham.zone.prototype.init = function(zoneName)
{
    this.zoneName = zoneName || 'eastAnglia';

    this.zone = zones[zoneName];

    this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

    this.game.kineticScrolling.configure({
        kineticMovement: false,
        verticalScroll: true,
        verticalWheel: true
    });


};

Rendlesham.zone.prototype.create = function()
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
    this.checkUser();

    this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

    this.levels = {
        1: {
            x: game.width * .1,
            y: game.height * .15
        },
        2: {
            x: game.width * .3,
            y: game.height * .2
        },
        3: {
            x: game.width * .5,
            y: game.height * .175
        },
        4: {
            x: game.width * .7,
            y: game.height * .225
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
            x: game.width * .18,
            y: game.height * .95
        },
        11: {
            x: game.width * .05,
            y: game.height * .975
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
        },
        16: {
            x: game.width * .85,
            y: game.height * 1.05
        }
        /*
        ,
        17: {
            x: game.width * .925,
            y: game.height * 1.3
        }
        */
    };

    this.lastLevel = Object.keys(this.zone.levelOrdering).length;

    this.drawLinesBetweenLevels();

    for (var i = 1; i <= this.lastLevel; i++) {

        this['level' + i + 'Button'] = game.add.button(
            this.levels[i].x,
            this.levels[i].y,
            this.zone.levelButtonGraphic,
            this.clickLevelButton,
            this
        );

        this['level' + i + 'Button'].levelNumber = i;
        this['level' + i + 'Button'].levelName = zones[this.zoneName].levelOrdering[i];

        if (!this.isLevelUnlocked(i)) {
            this['level' + i + 'Button'].tint = 0x333333;
            this['level' + i + 'Button'].input.useHandCursor = false;
        }

        this.writeLevelText(i);
        this.addLevelStars(i);

    }


    this.addButtonTextLink('nextZoneLink', 'Next', 20, 'smallDark', 10, game.camera.height - 40, 'right', 'nextZone');

    this.titleText = game.add.bitmapText(500, game.height * .01, bitmapFontName, this.zone.title, 28);
    this.titleText.x = (game.width * .5) - (this.titleText.width * .5);
    this.titleText.alpha = .5;

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

Rendlesham.zone.prototype.update = function()
{

};

Rendlesham.zone.prototype.shutdown = function()
{
    this.user.zones[this.zoneName].cameraX = game.camera.x;
    this.user.zones[this.zoneName].cameraY = game.camera.y;
    this.save();
};

Rendlesham.zone.prototype.clickLevelButton = function(levelButton)
{
    var levelNumber = levelButton.levelNumber;

    if (!this.isLevelUnlocked(levelNumber)) {
        return false;
    }

    game.state.start('levelOptions', true, true, levelNumber, this.zoneName);
};

Rendlesham.zone.prototype.isLevelUnlocked = function(levelNumber)
{
    if (levelNumber == 1) {
        return true;
    }

    var level = this.getLevelFromZoneAndNumber(this.zoneName, levelNumber);

    if (level && level.hasOwnProperty('previousLevelName') && this.hasUserCompletedLevel(level.previousLevelName)) {
        return true;
    }

    return false;
};

Rendlesham.zone.prototype.hasUserCompletedLevel = function(levelName)
{
    var completed = false;

    var modes = ['classic', 'epic', 'endless'];

    for (var i = 0; i < modes.length; i++) {
        if (this.user.levelCompletions[modes[i]][levelName]) {
            completed = true;
        }
    }

    var levelNumber = this.getLevelNumberFromZoneAndName(this.zoneName, levelName);
    if (this.zoneName == 'eastAnglia' && this.user.levelsComplete[levelNumber]) {
        return true;
    }

    return completed;

};

Rendlesham.zone.prototype.writeLevelText = function(levelNumber)
{
    var x = this.levels[levelNumber].x + 16;
    var y = this.levels[levelNumber].y - 19;

    this['level' + levelNumber + 'Text'] = game.add.bitmapText(
        x,
        y,
        bitmapFontName,
        'Level ' + levelNumber,
        18
    );
    this['level' + levelNumber + 'Text'].x = x - (this['level' + levelNumber + 'Text'].width * .5);
};

Rendlesham.zone.prototype.addLevelStars = function(levelNumber)
{
    if (!this.isLevelUnlocked(levelNumber)) {
        return;
    }

    var levelName = zones[this.zoneName].levelOrdering[levelNumber];

    var stars = this.user.levelStars[levelName] || 0;

    var x = this.levels[levelNumber].x - 13;
    var y = this.levels[levelNumber].y + 35;

    var spriteName;

    for (var i = 1; i <= 3; i++) {

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

Rendlesham.zone.prototype.drawLinesBetweenLevels = function()
{
    var graphics = game.add.graphics(0, 0);

    graphics.lineStyle(3, 0x886666, 1);

    for (var i = 1; i <= this.lastLevel; i++) {

        var level = this.getLevelFromZoneAndNumber(this.zoneName, i);

        if (level && level.hasOwnProperty('previousLevelName')) {
            var previousLevelNumber = this.getLevelNumberFromZoneAndName(this.zoneName, level.previousLevelName);

            if (previousLevelNumber) {
                var startX = this.levels[i].x + 16;
                var startY = this.levels[i].y + 16;

                graphics.moveTo(
                    Math.round(startX),
                    Math.round(startY)
                );

                var finishX = this.levels[previousLevelNumber].x + 16;
                var finishY = this.levels[previousLevelNumber].y + 16;

                graphics.lineTo(
                    Math.round(finishX),
                    Math.round(finishY)
                );

            }

        }

    }
};

Rendlesham.zone.prototype.nextZone = function()
{
    game.state.start('zone', true, true, this.zone.nextZoneName);
};
