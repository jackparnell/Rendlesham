class Credits extends DomContentState
{
    create()
    {
        super.create();

        this.showDomElement('credits');

        // this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

        $('.back').click(function() {
            game.state.states.credits.goToTitleScreen();
        });
    }

    shutdown()
    {
        this.hideDomElement('credits');
    }
}