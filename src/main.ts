import { Application } from 'pixi.js';
import { loadChestGame } from './chest-game/chest-game';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#a8dcab', resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById('pixi-container')!.appendChild(app.canvas);

  const chestGame = await loadChestGame();
  app.stage.addChild(chestGame.container);
})();
