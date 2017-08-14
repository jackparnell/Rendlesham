class DomContentState extends GameState
{
    create()
    {
        super.create();
        $('canvas').hide();
    }

    shutdown()
    {
        // this.hideDomElement('towerInfo');
    }
}