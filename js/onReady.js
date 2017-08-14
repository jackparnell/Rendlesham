$(function() {
    $('.titleScreenLink').click(function() {
        window.location.hash = '#titleScreen';
    });
    $('.creditsLink').click(function() {
        window.location.hash = '#credits';
    });
    $('.achievementsLink').click(function() {
        window.location.hash = '#achievements';
    });
    $('.towerInfoLink').click(function() {
        window.location.hash = '#towerInfo';
    });
    $('.privacyPolicyLink').click(function() {
        window.location.hash = '#privacyPolicy';
    });
    $('.applicationDomain').html(game.globals.applicationDomain);
    $(window).hashchange( function(){
        let stateName = location.hash;
        stateName = stateName.replace('#', '');
        if (!stateName)
        {
            stateName = 'titleScreen';
        }
        if (game.state.states.hasOwnProperty(stateName))
        {
            game.state.start(stateName);
        }
        else
        {
            throw {
                'code': 30006,
                'description': 'stateName ' + stateName + ' invalid. '
            };
        }
    });
});