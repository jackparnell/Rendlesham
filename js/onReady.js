$(function() {
    $('.titleScreenLink').click(function() {
        game.state.start('titleScreen');
    });
    $('.creditsLink').click(function() {
        game.state.start('credits');
    });
    $('.achievementsLink').click(function() {
        game.state.start('achievements');
    });
    $('.towerInfoLink').click(function() {
        game.state.start('towerInfo');
    });
});