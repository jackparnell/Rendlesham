game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('titleScreen', TitleScreen);
game.state.add('zone', Zone);
game.state.add('levelOptions', LevelOptions);
game.state.add('story', Story);
game.state.add('achievements', Achievements);
game.state.add('play', Play);
game.state.add('gameOver', GameOver);

game.state.start('boot');

var mainState = game.state.states.play;