class Credits extends GameState
{
    create()
    {
        super.create();

        this.showDomElement('credits');

        // this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

        $('canvas').hide();

        $('.back').click(function() {
            game.state.states.credits.goToTitleScreen();
        });

        this.flashIntoState();
    }

    shutdown()
    {
        this.hideDomElement('credits');
        $('canvas').show();

    }
}