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

        if (localStorage.getItem(this.name))
        {
            this.user = JSON.parse(localStorage.getItem(this.name));
        }
        else
        {
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
        if (!this.user.levelsComplete)
        {
            this.user.levelsComplete = [];
        }

        let records = ['items', 'levelCompletions', 'levelStars', 'levelHighScores'];
        let modes = ['classic', 'epic', 'endless'];

        for (let i = 0; i < records.length; ++i)
        {
            if (!this.user[records[i]]) {
                this.user[records[i]] = {};
            }

            for (let j = 0; j < modes.length; ++j)
            {
                if (!this.user[records[i]][modes[j]]) {
                    this.user[records[i]][modes[j]] = {};
                }
            }
        }

        if (!this.user.zones) {
            this.user.zones = {};
        }

        for (let zoneName in zones) {
            if (zones.hasOwnProperty(zoneName)) {
                if (!this.user.zones[zoneName]) {
                    this.user.zones[zoneName] = {};
                }
            }
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

        let buttonName = name + 'Button';

        this[buttonName] = game.add.button(
            0,
            y,
            buttonImage,
            this[clickFunctionName],
            this
        );
        this.linkBackgrounds.add(this[buttonName]);

        if (horizontal === 'right') {
            x = game.camera.width - this[buttonName].width - x;
        } else if (horizontal === 'center') {
            x = (game.camera.width * .5) - (this[buttonName].width * .5);
        } else if (horizontal === 'left') {
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

        let xOffset = (this[buttonName].width - this[name].width) * .5;
        this[name].x = this[buttonName].x + xOffset;

        let yOffset = (this[buttonName].height - this[name].height) * .38;
        this[name].y = this[buttonName].y + yOffset;

        this[name].fixedToCamera = true;


    },

    goToTitleScreen: function()
    {
        this.changeGameState('titleScreen');
    },

    loadTransylvanianFiles: function()
    {
        let transylvanianAttackerNames = [
            'betty', 'bogeyman', 'bruce', 'cyclops', 'farmer', 'goblin', 'imp', 'kappa', 'nic', 'ogre', 'purp', 'skull', 'skuller', 'villager', 'woodcutter'
        ];

        for (let i = 0; i < transylvanianAttackerNames.length; i++) {
            game.load.atlasJSONHash(
                transylvanianAttackerNames[i],
                'assets/sprites/attackers/' + transylvanianAttackerNames[i] + '.png',
                'assets/sprites/attackers/' + transylvanianAttackerNames[i] + '.json'
            );
        }

    },

    getLevelFromZoneAndNumber: function(zoneName, levelNumber)
    {
        return window[zones[zoneName].levelOrdering[levelNumber]];
    },

    getLevelNumberFromZoneAndName: function(zoneName, levelName)
    {
        let levelOrdering = zones[zoneName].levelOrdering;
        return Object.keys(levelOrdering)[Object.values(levelOrdering).indexOf(levelName)];
    }
};