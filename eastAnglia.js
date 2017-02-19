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

        var levelInfo = {
            1: {
                x: game.width * .1,
                y: game.height * .1
            },
            2: {
                x: game.width * .3,
                y: game.height * .15
            },
            3: {
                x: game.width * .4,
                y: game.height * .25
            },
            4: {
                x: game.width * .5,
                y: game.height * .175
            }
        };

        var textStyle = {
            font: "18px Ubuntu",
            fill: "#FFCCCC",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.level1Button = game.add.button(levelInfo[1].x, levelInfo[1].y, 'ufo', this.clickLevel1, this);

        this.level2Button = game.add.button(levelInfo[2].x, levelInfo[2].y, 'ufo', this.clickLevel2, this);
        if (!this.isLevelUnlocked(2)) {
            this.level2Button.tint = 0x333333;
            this.level2Button.input.useHandCursor = false;
        }

        this.level3Button = game.add.button(levelInfo[3].x, levelInfo[3].y, 'ufo', this.clickLevel3, this);
        if (!this.isLevelUnlocked(3)) {
            this.level3Button.tint = 0x333333;
            this.level3Button.input.useHandCursor = false;
        }

        this.level4Button = game.add.button(levelInfo[4].x, levelInfo[4].y, 'ufo', this.clickLevel4, this);
        if (!this.isLevelUnlocked(4)) {
            this.level4Button.tint = 0x333333;
            this.level4Button.input.useHandCursor = false;
        }


        this.level1Text = game.add.text(levelInfo[1].x, levelInfo[1].y, 'Level 1', textStyle);
        this.level1Text.anchor.set(0.5);

        this.level2Text = game.add.text(levelInfo[2].x, levelInfo[2].y, 'Level 2', textStyle);
        this.level2Text.anchor.set(0.5);

        this.level3Text = game.add.text(levelInfo[3].x, levelInfo[3].y, 'Level 3', textStyle);
        this.level3Text.anchor.set(0.5);

        this.level4Text = game.add.text(levelInfo[4].x, levelInfo[4].y, 'Level 4', textStyle);
        this.level4Text.anchor.set(0.5);

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

    }

};