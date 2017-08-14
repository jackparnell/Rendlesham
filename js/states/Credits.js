class Credits extends DomContentState
{
    create()
    {
        super.create();

        // this.addButtonTextLink('backLink', 'Back', 20, 'smallDark', 10, 10, 'right', 'goToTitleScreen');

        $('.back').click(function() {
            game.state.states.credits.goToTitleScreen();
        });
    }
}