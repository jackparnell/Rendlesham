class Story extends GameState
{
    preload()
    {
        this.backgrounds = game.add.group();
        loadMainFiles();
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
        this.level = window[zones[this.zoneName].levelOrdering[this.levelNumber]];

        if (!this.level.story)
        {
            this.beginLevel();
        }

        for (let i in this.level.storyImages)
        {
            if (this.level.storyImages.hasOwnProperty(i))
            {
                this['image' + i] = game.add.tileSprite(0, 0, game.camera.width, game.camera.height, this.level.storyImages[i].name);
                this['image' + i].fixedToCamera = true;
                this['image' + i].alpha = 0;
                this.backgrounds.add(this['image' + i]);
            }
        }

        this.currentImage = 1;

        this['image' + this.currentImage].alpha = 1;

        game.input.onDown.add(this.nextImage, this);
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
        game.state.start('play', true, true, obj);
    }
}