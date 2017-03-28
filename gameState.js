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
    }

};