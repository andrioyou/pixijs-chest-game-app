import { Application, Container } from 'pixi.js';
import { Chest } from './chest';
import { Title } from './title';
import { PlayButton } from './play-button';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#a8dcab', resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById('pixi-container')!.appendChild(app.canvas);

  const CONFIG = {
    chestCount: 6,
    // winChance: 0.4, // 40% chance that selected chest is a win
    // bonusChance: 0.25, // 25% of wins are bonus wins
    // bonusMin: 50,
    // bonusMax: 500,
    /** In seconds */
    animationDuration: 1,
  };

  const GameState = {
    openedChests: 0,
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    CHEST_OPENED: 'CHEST_OPENED',
    BONUS: 'BONUS',
  };

  // TITLE
  const title = new Title();
  title.container.position.set(app.screen.width / 2, (app.screen.height / 10) * 1);
  app.stage.addChild(title.container);

  // CHESTS
  const chestsContainer = new Container();
  const chests: Chest[] = [];
  for (let i = 0; i < CONFIG.chestCount; i++) {
    const x = (i % 3) * 150;
    const y = Math.floor(i / 3) * 170;
    const chest = new Chest(x, y, CONFIG.animationDuration);
    chests.push(chest);
    chestsContainer.addChild(chest.container);
  }
  app.stage.addChild(chestsContainer);
  chestsContainer.x = app.screen.width / 2;
  chestsContainer.y = app.screen.height / 2;
  const bounds2 = chestsContainer.getLocalBounds();
  chestsContainer.pivot.set(bounds2.width / 2, bounds2.height / 2);
  chests.forEach((chest) => {
    chest.container.on('pointerdown', () => {
      chest.open();
    });
  });

  // PLAY BUTTON
  const playButton = new PlayButton();
  playButton.container.x = app.screen.width / 2;
  playButton.container.y = (app.screen.height / 10) * 8;
  playButton.container.on('pointerdown', () => {
    startGame();
  });
  app.stage.addChild(playButton.container);

  function enableAllChests(): void {
    chests.forEach((chest) => chest.enable());
  }

  function disableAllChests(): void {
    chests.forEach((chest) => chest.disable());
  }

  function initGame(): void {
    disableAllChests();
  }

  function startGame(): void {
    playButton.disable();
    enableAllChests();
  }

  initGame();
})();
