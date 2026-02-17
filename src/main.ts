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
    /** with a change of number of chests, you may need to adjust the layout */
    chestCount: 6,
    /** From 0 to 1 */
    winChance: 0.5,
    /** From 0 to 1 */
    winBonusChance: 0.25,
    /** In seconds */
    animationDuration: 0.5,

    // bonusMin: 50,
    // bonusMax: 500,
  };

  const gameState = {
    numberOfOpenedChests: 0,
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
      openChest(chest);
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

  function openChest(chest: Chest): void {
    gameState.numberOfOpenedChests++;
    if (gameState.numberOfOpenedChests >= CONFIG.chestCount) {
      setTimeout(
        () => {
          reset();
        },
        CONFIG.animationDuration * 1000 + 1000,
      );
    }
    disableAllChests();
    let result: 'lost' | 'win' | 'bonus' = 'lost';
    const winRandom = Math.random();
    if (winRandom < CONFIG.winChance) {
      const winBonusRandom = Math.random();
      if (winBonusRandom < CONFIG.winBonusChance) {
        result = 'bonus';
      } else {
        result = 'win';
      }
    }
    chest.open(result);
    setTimeout(() => {
      enableAllChests();
      chest.disable();
    }, CONFIG.animationDuration * 1000);
  }

  function enableAllChests(): void {
    chests.forEach((chest) => !chest.isOpened && chest.enable());
  }

  function disableAllChests(): void {
    chests.forEach((chest) => chest.disable());
  }

  function resetAllChests(): void {
    chests.forEach((chest) => chest.reset());
  }

  function startGame(): void {
    playButton.disable();
    enableAllChests();
  }

  function reset(): void {
    disableAllChests();
    playButton.enable();
    resetAllChests();
    gameState.numberOfOpenedChests = 0;
  }

  reset();
})();
