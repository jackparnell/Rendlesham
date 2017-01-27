game.state.add('titleScreen', Rendlesham.titleScreen);
game.state.add('main', mainState);
game.state.add('gameOver', Rendlesham.gameOver);

game.state.start('main');