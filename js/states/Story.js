class Story extends GameState
{
    preload()
    {
        this.backgrounds = this.game.add.group();
        this.loadMainFiles();
    }

    init(obj)
    {
        this.storyImages = obj.storyImages;
        this.zoneName = obj.zoneName;
        this.levelNumber = obj.levelNumber;
        this.mode = obj.mode || 'classic';
    }

    create()
    {
        super.create();

        this.handleScaling();

        this.level = window[ZONE_INFO[this.zoneName].LEVEL_ORDERING[this.levelNumber]];

        if (!this.level.story)
        {
            this.beginLevel();
        }

        for (let i in this.level.storyImages)
        {
            if (this.level.storyImages.hasOwnProperty(i))
            {
                this['image' + i] = this.game.add.tileSprite(
                    0,
                    0,
                    this.game.camera.width,
                    this.game.camera.height,
                    this.level.storyImages[i].name
                );
                this['image' + i].fixedToCamera = true;
                this['image' + i].alpha = 0;
                this.backgrounds.add(this['image' + i]);
            }
        }

        this.currentImage = 1;

        this['image' + this.currentImage].alpha = 1;

        this.game.input.onDown.add(this.nextImage, this);

        this.flashIntoState();
    }

    nextImage()
    {
        this['image' + this.currentImage].alpha = 0;
        this.currentImage ++;

        if (this.level.storyImages.hasOwnProperty(this.currentImage))
        {
            this['image' + this.currentImage].alpha = 1;
        }
        else
        {
            this.beginLevel();
        }
    }

    beginLevel()
    {
        let obj = {
            zoneName: this.zoneName,
            levelNumber: this.levelNumber,
            mode: this.mode
        };
        this.game.state.start('play', true, true, obj);
    }
}