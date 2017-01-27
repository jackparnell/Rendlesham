var standard = {
    getScale: function()
    {
        if ("creationTurn" in this && (mainState.turn - this.creationTurn) > 3) {
            var scale = this.scale.x;
        } else {
            var scale = window[this.constructor.name].defaultScale ? window[this.constructor.name].defaultScale : 1;
        }

        // console.log(this.constructor.name + 'defaultScale ' + window[this.constructor.name].defaultScale);

        return scale;
    },
    getAngle: function()
    {
        return this.angle;
    },
    getSpriteName: function()
    {
        return this.constructor.name.toLowerCase();
    }
};

var shadow = {

    getShadowOffset: function()
    {
        var shadowOffset = window[this.constructor.name].defaultShadowOffset ? window[this.constructor.name].defaultShadowOffset : 5;
        return shadowOffset;
    },
    createShadow: function(scaleOverride)
    {
        this.shadow = game.add.sprite(this.x, this.y, this.getSpriteName());

        mainState.shadows.add(this.shadow);

        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.15;

        this.shadow.angle = this.getAngle();

        if (scaleOverride) {
            var scale = scaleOverride;
        } else {
            var scale = this.getScale();
        }

        if (scale != 1) {
            this.shadow.scale.setTo(scale, scale);
        }

    },
    updateShadow: function()
    {

        this.shadow.x = this.x + this.getShadowOffset();
        this.shadow.y = this.y + this.getShadowOffset();

        this.shadow.angle = this.angle;

    },
    destroyShadow: function()
    {
        if (this.shadow instanceof Object) {
            this.shadow.destroy();
        }
    }
};