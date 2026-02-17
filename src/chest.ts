import { Container, Sprite, Assets, Text } from 'pixi.js';
import { gsap } from 'gsap';

const chestTopTexture = await Assets.load('/assets/chest-top.jpg');
const chestBottomTexture = await Assets.load('/assets/chest-bottom.jpg');

export class Chest {
  readonly container: Container;
  readonly spritesContainer: Container;
  isOpened = false;

  private label: Text | undefined;
  private readonly chestTopSprite: Sprite;
  private readonly chestBottomSprite: Sprite;
  private chestWidth = 80;
  private chestHeight = 50;
  private animationDuration: number;

  constructor(x: number, y: number, animationDuration: number) {
    this.animationDuration = animationDuration;

    // containers
    this.container = new Container();
    this.spritesContainer = new Container();
    this.container.x = x;
    this.container.y = y;
    const bounds = this.container.getLocalBounds();
    this.container.pivot.set(bounds.width / 2, bounds.height / 2);

    // sprites and sizing
    this.chestTopSprite = new Sprite(chestTopTexture);
    this.chestBottomSprite = new Sprite(chestBottomTexture);
    this.spritesContainer.addChild(this.chestTopSprite, this.chestBottomSprite);
    this.spritesContainer.width = this.chestWidth;
    this.spritesContainer.height = this.chestHeight;
    this.container.addChild(this.spritesContainer);
    this.chestTopSprite.anchor.set(0, 1);

    // make chest clickable
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
  }

  open(status: 'lost' | 'win' | 'bonus'): void {
    this.isOpened = true;
    gsap.to(this.chestTopSprite, {
      rotation: Math.PI / -4,
      duration: this.animationDuration,
      ease: 'power2.out',
      onComplete: () => {
        this.setOpenResult(status);
      },
    });
  }

  private setOpenResult(status: 'lost' | 'win' | 'bonus'): void {
    this.label = new Text({
      text: 'LOSE',
      style: { fontSize: 18, fill: '#000000' },
    });
    if (status === 'bonus') {
      this.label.text = 'BONUS';
    } else if (status === 'win') {
      this.label.text = 'WIN';
    }
    this.label.anchor.set(0.5, 0);
    this.label.x = this.chestWidth / 2;
    this.label.y = this.chestHeight + 5;
    this.container.addChild(this.label);
  }

  close(): void {
    this.isOpened = false;
    gsap.to(this.chestTopSprite, {
      rotation: 0,
      duration: this.animationDuration,
      ease: 'power2.out',
    });
  }

  enable(): void {
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.chestTopSprite.tint = 0xffffff;
    this.chestTopSprite.alpha = 1;
    this.chestBottomSprite.tint = 0xffffff;
    this.chestBottomSprite.alpha = 1;
  }

  disable(): void {
    this.container.eventMode = 'none';
    this.container.cursor = 'auto';
    this.chestTopSprite.tint = 0x999999;
    this.chestTopSprite.alpha = 0.6;
    this.chestBottomSprite.tint = 0x999999;
    this.chestBottomSprite.alpha = 0.6;
  }

  reset(): void {
    this.isOpened = false;
    this.close();
    if (this.label) this.container.removeChild(this.label);
    this.label = undefined;
  }
}
