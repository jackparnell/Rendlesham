var Rendlesham = Rendlesham || {};

Rendlesham.eastAnglia = function(){

};

Rendlesham.eastAnglia.prototype = {
    preload: function()
    {

        this.backgrounds = game.add.group();
        this.pathways = game.add.group();
        this.name = 'rendlesham';

        loadMainFiles();

    },

    init: function ()
    {
        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        this.game.kineticScrolling.configure({
            kineticMovement: false,
            verticalScroll: true,
            verticalWheel: true
        });
    },

    create: function()
    {

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.eastAngliaMap = this.game.add.tileSprite(0, 0, 1400, 700, 'eastAnglia');
        this.backgrounds.add(this.eastAngliaMap);

        this.game.world.setBounds(0, 0, this.eastAngliaMap.width, this.eastAngliaMap.height);

        this.loadUser();

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



        this.game.kineticScrolling.start();


    },

    clickLevel1: function()
    {
        this.clickLevel(1);
    },
    clickLevel2: function()
    {
        this.clickLevel(2);
    },
    clickLevel3: function()
    {
        this.clickLevel(3);
    },
    clickLevel4: function()
    {
        this.clickLevel(4);
    },
    clickLevel5: function()
    {
        this.clickLevel(5);
    },
    clickLevel6: function()
    {
        this.clickLevel(6);
    },
    clickLevel7: function()
    {
        this.clickLevel(7);
    },
    clickLevel8: function()
    {
        this.clickLevel(8);
    },
    clickLevel9: function()
    {
        this.clickLevel(9);
    },
    clickLevel10: function()
    {
        this.clickLevel(10);
    },
    clickLevel11: function()
    {
        this.clickLevel(11);
    },

    clickLevel: function(levelNumber)
    {

        if (!this.isLevelUnlocked(levelNumber)) {
            return false;
        }

        game.state.start('main', true, true, levelNumber);
    },

    loadUser: function()
    {

        if (localStorage.getItem(this.name)) {
            this.user = JSON.parse(localStorage.getItem(this.name));
        } else {
            this.user = {
                levelsComplete: []
            }
        }

    },

    isLevelUnlocked: function(levelNumber)
    {
        if (levelNumber == 1) {
            return true;
        }

        if (this.user.levelsComplete[levelNumber-1]) {
            return true;
        }

        return false;

    },

    writeLevelText: function(levelNumber)
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
        this['level' + levelNumber + 'Text'].x = x - (this['level' + levelNumber + 'Text'].width / 2);

    },

    addLevelStars: function(levelNumber)
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

    },

    drawLinesBetweenLevels: function()
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

    }

};