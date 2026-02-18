import { Assets, Container, Graphics } from 'pixi.js';
import { Title } from './elements/title';
import { Chest } from './elements/chest';
import { PlayButton } from './elements/play-button';
import { BonusScreen } from './elements/bonus-screen';
import { ChestGameAssets } from './interfaces/chest-game-assets.interface';

const CONFIG = {
  /** with a change of number of chests, you may need to adjust the layout */
  chestCount: 6,
  /** From 0 to 1 */
  winChance: 0.5,
  /** From 0 to 1 */
  winBonusChance: 0.25,
  /** In seconds */
  animationDuration: 1,
};

export class ChestGame {
  readonly container: Container;
  private chests: Chest[] = [];
  private playButton: PlayButton;
  private bonusScreen: BonusScreen;
  private state = {
    numberOfOpenedChests: 0,
    collectedPoints: 0,
    reset() {
      this.numberOfOpenedChests = 0;
      this.collectedPoints = 0;
    },
  };

  constructor(private readonly assets: ChestGameAssets) {
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
      const x = (i % 3) * 130;
      const y = Math.floor(i / 3) * 170;
      const chest = new Chest(this.assets, x, y, CONFIG.animationDuration);
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
    const playButton = new PlayButton(this.assets);
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

  private updateWinPointsCount(points: number): void {
    this.playButton.showWinPointsCount(points);
  }

  private openChest(chest: Chest): void {
    this.state.numberOfOpenedChests++;
    this.disableAllChests();

    // start animation
    const result = this.createResult();
    chest.open(result);

    let winPoints = 0;
    if (result === 'win') winPoints = 100;
    if (result === 'bonus') winPoints = 200;
    this.state.collectedPoints += winPoints;

    // post animation
    setTimeout(() => {
      this.enableAllChests();
      if (result === 'bonus') this.showBonusScreen(winPoints);

      // check if all chest were opened
      if (this.state.numberOfOpenedChests >= CONFIG.chestCount) {
        this.updateWinPointsCount(this.state.collectedPoints);
        this.playButton.enable();
      }
    }, CONFIG.animationDuration * 1000);
  }

  private showBonusScreen(winPoints: number): void {
    this.bonusScreen.show(winPoints);
    this.bonusScreen.container.visible = true;
    setTimeout(() => {
      this.bonusScreen.hide();
    }, 2000);
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
    this.state.reset();
    this.resetAllChests();
    this.playButton.disable();
    this.enableAllChests();
    this.updateWinPointsCount(-1);
  }
}

export async function loadAssets() {
  const chestTopTexture = await Assets.load('/assets/chest-top.jpg');
  const chestBottomTexture = await Assets.load('/assets/chest-bottom.jpg');
  const playButtonTexture = await Assets.load('/assets/play-button.jpg');

  return {
    chestTopTexture,
    chestBottomTexture,
    playButtonTexture,
  };
}

export async function loadChestGame() {
  const assets: ChestGameAssets = await loadAssets();
  return new ChestGame(assets);
}
