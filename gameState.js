var Rendlesham = Rendlesham || {};

Rendlesham.gameState = function()
{

};

Rendlesham.gameState.prototype = {

    preload: function()
    {

        loadMainFiles();

    },

    loadUser: function()
    {

        if (localStorage.getItem(this.name)) {
            this.user = JSON.parse(localStorage.getItem(this.name));
        } else {
            this.user = newUser;
            this.save();
        }

    },

    save: function()
    {

        localStorage.setItem(this.name, JSON.stringify(this.user));
    },

    checkUser: function()
    {
        // Array
        if (!this.user.levelsComplete) {
            this.user.levelsComplete = [];
        }

        // Objects
        if (!this.user.items) {
            this.user.items = {};
        }
        if (!this.user.levelStars) {
            this.user.levelStars = {};
        }
        if (!this.user.levelHighScores) {
            this.user.levelHighScores = {};
        }

        this.save();
    },

    changeGameState: function(stateName)
    {
        if (!stateName) {
            stateName = 'titleScreen';
        }
        game.state.start(stateName);
    },

    addButtonTextLink: function(name, text, fontSize, buttonImage, x, y, horizontal, clickFunctionName)
    {

        var buttonName = name + 'Button';


        this[buttonName] = game.add.button(
            0,
            y,
            buttonImage,
            this[clickFunctionName],
            this
        );
        this.linkBackgrounds.add(this[buttonName]);

        if (horizontal == 'right') {
            x = game.camera.width - this[buttonName].width - x;
        } else if (horizontal == 'center') {
            x = (game.camera.width * .5) - (this[buttonName].width * .5);
        } else if (horizontal == 'left') {
            // Do nothing
        }

        this[buttonName].x = x;

        this[buttonName].fixedToCamera = true;

        this[name] = game.add.bitmapText(
            0,
            0,
            bitmapFontName,
            text,
            fontSize
        );

        var xOffset = (this[buttonName].width - this[name].width) * .5;
        this[name].x = this[buttonName].x + xOffset;

        var yOffset = (this[buttonName].height - this[name].height) / 3;
        this[name].y = this[buttonName].y + yOffset;

        this[name].fixedToCamera = true;


    },

    goToTitleScreen: function()
    {
        this.changeGameState('titleScreen');
    }

};