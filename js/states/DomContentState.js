class DomContentState extends GameState
{
    create()
    {
        super.create();
        $('canvas').hide();
        $('#' + this.constructor.name).show();
    }

    shutdown()
    {
        $('.state').hide();
    }
}