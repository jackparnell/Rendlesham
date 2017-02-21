var Rendlesham = Rendlesham || {};

Rendlesham.eastAnglia = function(){

};

Rendlesham.eastAnglia.prototype = {
    preload: function()
    {

        this.backgrounds = game.add.group();
        this.name = 'rendlesham';

        loadMainFiles();

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

        this.eastAngliaMap = this.game.add.tileSprite(0, 0, game.width, game.height, 'eastAnglia');
        this.backgrounds.add(this.eastAngliaMap);

        this.loadUser();

        this.levelInfo = {
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
                y: game.height * .25
            },
            4: {
                x: game.width * .7,
                y: game.height * .175
            }
        };

        this.level1Button = game.add.button(this.levelInfo[1].x, this.levelInfo[1].y, 'ufo', this.clickLevel1, this);

        this.level2Button = game.add.button(this.levelInfo[2].x, this.levelInfo[2].y, 'ufo', this.clickLevel2, this);
        if (!this.isLevelUnlocked(2)) {
            this.level2Button.tint = 0x333333;
            this.level2Button.input.useHandCursor = false;
        }

        this.level3Button = game.add.button(this.levelInfo[3].x, this.levelInfo[3].y, 'ufo', this.clickLevel3, this);
        if (!this.isLevelUnlocked(3)) {
            this.level3Button.tint = 0x333333;
            this.level3Button.input.useHandCursor = false;
        }

        this.level4Button = game.add.button(this.levelInfo[4].x, this.levelInfo[4].y, 'ufo', this.clickLevel4, this);
        if (!this.isLevelUnlocked(4)) {
            this.level4Button.tint = 0x333333;
            this.level4Button.input.useHandCursor = false;
        }


        this.writeLevelText(1);
        this.addLevelStars(1);

        this.writeLevelText(2);
        this.addLevelStars(2);

        this.writeLevelText(3);
        this.addLevelStars(3);

        this.writeLevelText(4);
        this.addLevelStars(4);

        console.log(this.user.levelStars);

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

        var textStyle = {
            font: "18px Ubuntu",
            fill: "#FFCCCC",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        var x = this.levelInfo[levelNumber].x + 16;
        var y = this.levelInfo[levelNumber].y - 9;

        this['level' + levelNumber + 'Text'] = game.add.text(x, y, 'Level ' + levelNumber, textStyle);
        this['level' + levelNumber + 'Text'].anchor.set(0.5);

    },

    addLevelStars: function(levelNumber)
    {

        if (!this.isLevelUnlocked(levelNumber)) {
            return;
        }

        var stars = this.user.levelStars[levelNumber] || 0;

        var x = this.levelInfo[levelNumber].x - 13;
        var y = this.levelInfo[levelNumber].y + 35;

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


    }

};