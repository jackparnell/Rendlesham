class DomContentState extends GameState
{
    create()
    {
        super.create();
        $('body').addClass('domContentState');
        $('canvas').hide();
        $('#' + this.constructor.name).show();
    }

    shutdown()
    {
        $('.state').hide();
        $('body').removeClass('domContentState');
    }
}