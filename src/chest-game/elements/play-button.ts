import { Container, Sprite, Text } from 'pixi.js';
import { ChestGameAssets } from '../interfaces/chest-game-assets.interface';

export class PlayButton {
  container: Container;
  private sprite: Sprite;
  private label: Text;
  private winPointsLabel: Text;

  constructor(assets: ChestGameAssets) {
    // container
    this.container = new Container();

    // sprites
    this.sprite = new Sprite(assets.playButtonTexture);
    this.sprite.anchor.set(0.5);
    const targetWidth = 300;
    this.sprite.scale.set(targetWidth / this.sprite.texture.width);
    this.container.addChild(this.sprite);

    // button label
    this.label = new Text({
      text: 'PLAY',
      style: { fontSize: 24, fill: '#ffffff' },
    });
    this.label.anchor.set(0.5);
    this.container.addChild(this.label);

    // win points label
    this.winPointsLabel = new Text({
      text: '',
      style: { fontSize: 20, fill: '#000000' },
    });
    this.winPointsLabel.anchor.set(0.5, 2.5);
    this.container.addChild(this.winPointsLabel);

    // make it clickable
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
  }

  showWinPointsCount(points: number): void {
    if (points >= 0) {
      this.winPointsLabel.text = `You won ${points} $!`;
    } else {
      this.winPointsLabel.text = '';
    }
  }

  enable(): void {
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.container.tint = 0xffffff;
    this.container.alpha = 1;
  }

  disable(): void {
    this.container.eventMode = 'none';
    this.container.cursor = 'auto';
    this.container.tint = 0x999999;
    this.container.alpha = 0.6;
  }
}
