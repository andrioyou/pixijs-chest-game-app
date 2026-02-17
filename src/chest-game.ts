import { Container, Graphics } from 'pixi.js';
import { Title } from './title';
import { Chest } from './chest';
import { PlayButton } from './play-button';
import { BonusScreen } from './bonus-screen';

const CONFIG = {
  /** with a change of number of chests, you may need to adjust the layout */
  chestCount: 6,
  /** From 0 to 1 */
  winChance: 0.5,
  /** From 0 to 1 */
  winBonusChance: 0.25,
  /** In seconds */
  animationDuration: 1,

  // bonusMin: 50,
  // bonusMax: 500,
};

const gameState = {
  numberOfOpenedChests: 0,
  collectedPoints: 0,
  reset() {
    this.numberOfOpenedChests = 0;
    this.collectedPoints = 0;
  },
};

export class ChestGame {
  readonly container: Container;
  private chests: Chest[] = [];
  private playButton: PlayButton;
  private bonusScreen: BonusScreen;

  constructor() {
    // game main container
    this.container = new Container();
    const bg = new Graphics();
    const width = window.innerWidth;
    const height = window.innerHeight;
    bg.rect(0, 0, width, height).fill({
      color: 0x000000,
      alpha: 0,
    });
    this.container.addChildAt(bg, 0);

    // add elements
    this.addTitle();
    this.chests = this.addChests();
    this.playButton = this.addPlayButton();
    this.bonusScreen = this.addBonusScreen();
  }

  private addTitle(): void {
    const title = new Title();
    const bounds = this.container.getLocalBounds();
    title.container.position.set(bounds.width / 2, (bounds.height / 10) * 1);
    this.container.addChild(title.container);
  }

  private addChests(): Chest[] {
    // container for chests
    const chestsContainer = new Container();

    // chests layout
    const chests = [];
    for (let i = 0; i < CONFIG.chestCount; i++) {
      const x = (i % 3) * 150;
      const y = Math.floor(i / 3) * 170;
      const chest = new Chest(x, y, CONFIG.animationDuration);
      chests.push(chest);
      chestsContainer.addChild(chest.container);
    }
    const bounds = this.container.getLocalBounds();
    chestsContainer.x = bounds.width / 2;
    chestsContainer.y = bounds.height / 2;
    const chestsBounds = chestsContainer.getLocalBounds();
    chestsContainer.pivot.set(chestsBounds.width / 2, chestsBounds.height / 2);

    // Chest click
    chests.forEach((chest) => {
      chest.container.on('pointerdown', () => {
        this.openChest(chest);
      });
    });

    this.container.addChild(chestsContainer);
    return chests;
  }

  private addPlayButton(): PlayButton {
    const playButton = new PlayButton();
    const bounds = this.container.getLocalBounds();
    playButton.container.x = bounds.width / 2;
    playButton.container.y = (bounds.height / 10) * 8;
    playButton.container.on('pointerdown', () => {
      this.startGame();
    });
    this.container.addChild(playButton.container);
    return playButton;
  }

  private addBonusScreen(): BonusScreen {
    const bounds = this.container.getLocalBounds();
    const bonusScreen = new BonusScreen(bounds.width, bounds.height);
    this.container.addChild(bonusScreen.container);
    return bonusScreen;
  }

  private createResult(): 'lost' | 'win' | 'bonus' {
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
    return result;
  }

  updateWinPointsCount(points: number): void {
    this.playButton.showWinPointsCount(points);
  }

  private openChest(chest: Chest): void {
    gameState.numberOfOpenedChests++;
    this.disableAllChests();

    // start animation
    const result = this.createResult();
    chest.open(result);

    let winPoints = 0;
    if (result === 'win') winPoints = 100;
    if (result === 'bonus') winPoints = 200;
    gameState.collectedPoints += winPoints;

    // post animation
    setTimeout(() => {
      this.enableAllChests();
      chest.disable();
      if (result === 'bonus') {
        this.bonusScreen.show(winPoints);
        this.bonusScreen.container.visible = true;
        setTimeout(() => {
          this.bonusScreen.hide();
        }, 2000);
      }
    }, CONFIG.animationDuration * 1000);

    if (gameState.numberOfOpenedChests >= CONFIG.chestCount) {
      this.updateWinPointsCount(gameState.collectedPoints);
      this.playButton.enable();
    }
  }

  private enableAllChests(): void {
    this.chests.forEach((chest) => !chest.isOpened && chest.enable());
  }

  private disableAllChests(): void {
    this.chests.forEach((chest) => chest.disable());
  }

  private resetAllChests(): void {
    this.chests.forEach((chest) => chest.reset());
  }

  private startGame(): void {
    gameState.reset();
    this.resetAllChests();
    this.playButton.disable();
    this.enableAllChests();
    this.updateWinPointsCount(-1);
  }
}
