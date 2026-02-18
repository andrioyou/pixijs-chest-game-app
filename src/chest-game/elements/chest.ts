import { Container, Sprite, Text } from 'pixi.js';
import { gsap } from 'gsap';
import { ChestGameAssets } from '../interfaces/chest-game-assets.interface';

export class Chest {
  readonly container: Container;
  readonly spritesContainer: Container;
  isOpened = false;

  private readonly chestTopSprite: Sprite;
  private readonly chestBottomSprite: Sprite;
  private label: Text | undefined;
  private chestWidth = 80;
  private chestHeight = 50;

  constructor(
    private readonly assets: ChestGameAssets,
    x: number,
    y: number,
    private readonly animationDuration: number,
  ) {
    // containers
    this.container = new Container();
    this.spritesContainer = new Container();
    this.container.x = x;
    this.container.y = y;
    const bounds = this.container.getLocalBounds();
    this.container.pivot.set(bounds.width / 2, bounds.height / 2);

    // sprites and sizing
    this.chestTopSprite = new Sprite(this.assets.chestTopTexture);
    this.chestBottomSprite = new Sprite(this.assets.chestBottomTexture);
    this.spritesContainer.addChild(this.chestTopSprite, this.chestBottomSprite);
    this.spritesContainer.width = this.chestWidth;
    this.spritesContainer.height = this.chestHeight;
    this.container.addChild(this.spritesContainer);
    this.chestTopSprite.anchor.set(0, 1);

    // make chest clickable
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';

    this.disable();
  }

  open(status: 'lost' | 'win' | 'bonus'): void {
    this.isOpened = true;
    if (status === 'bonus') {
      gsap.to(this.chestTopSprite, {
        rotation: Math.PI / -2,
        duration: this.animationDuration,
        ease: 'power2.out',
      });
    } else if (status === 'win') {
      gsap.to(this.chestTopSprite, {
        rotation: Math.PI / -4,
        duration: this.animationDuration,
        ease: 'power2.out',
      });
    } else {
      gsap
        .timeline()
        .to(this.chestTopSprite, {
          y: -30,
          rotation: Math.PI / -16,
          duration: this.animationDuration / 2,
          ease: 'power2.out',
        })
        .to(this.chestTopSprite, {
          y: 0,
          rotation: 0,
          duration: this.animationDuration / 2,
          ease: 'power2.out',
        });
    }
    this.addResultLabel(status);
  }

  private addResultLabel(status: 'lost' | 'win' | 'bonus'): void {
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
