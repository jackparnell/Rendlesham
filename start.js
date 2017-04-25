game.state.add('boot', Rendlesham.boot);
game.state.add('preloader', Rendlesham.preloader);
game.state.add('titleScreen', Rendlesham.titleScreen);
game.state.add('zone', Rendlesham.zone);
game.state.add('achievements', Rendlesham.achievements);
game.state.add('main', mainState);
game.state.add('gameOver', Rendlesham.gameOver);

game.state.start('boot');