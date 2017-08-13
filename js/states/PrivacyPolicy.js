class PrivacyPolicy extends GameState
{
    create()
    {
        super.create();

        this.showDomElement('privacyPolicy');

        $('canvas').hide();

        this.flashIntoState();
    }

    shutdown()
    {
        this.hideDomElement('privacyPolicy');
        $('canvas').show();

    }
}