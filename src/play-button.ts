import { Assets, Container, Sprite, Text } from 'pixi.js';

const playButtonTexture = await Assets.load('/assets/play-button.jpg');

export class PlayButton {
  container: Container;
  private sprite: Sprite;
  private label: Text;

  constructor() {
    // container
    this.container = new Container();

    // sprites
    this.sprite = new Sprite(playButtonTexture);
    this.sprite.anchor.set(0.5);
    const targetWidth = 300;
    this.sprite.scale.set(targetWidth / this.sprite.texture.width);
    this.container.addChild(this.sprite);

    // label
    this.label = new Text({
      text: 'PLAY',
      style: { fontSize: 24, fill: '#ffffff' },
    });
    this.label.anchor.set(0.5);
    this.container.addChild(this.label);

    // make it clickable
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
  }

  public enable(): void {
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.container.tint = 0xffffff;
    this.container.alpha = 1;
  }

  public disable(): void {
    this.container.eventMode = 'none';
    this.container.cursor = 'auto';
    this.container.tint = 0x999999;
    this.container.alpha = 0.6;
  }
}
