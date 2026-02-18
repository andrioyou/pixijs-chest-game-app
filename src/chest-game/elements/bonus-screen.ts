import { Container, Graphics, Text } from 'pixi.js';

export class BonusScreen {
  container: Container;
  label: Text;

  constructor(width: number, height: number) {
    this.container = new Container();
    this.container.eventMode = 'static';
    this.container.visible = false;

    // black background
    const bg = new Graphics();
    bg.rect(0, 0, width, height).fill({
      color: 0x000000,
      alpha: 1,
    });
    this.container.addChildAt(bg, 0);

    // label
    this.label = new Text({
      text: ``,
      style: { fontSize: 24, fill: '#ffff00' },
    });
    this.label.anchor.set(0.5);
    this.label.x = width / 2;
    this.label.y = height / 2;
    this.container.addChild(this.label);
  }

  show(winBonusPoints: number): void {
    const bonusText = `YOU WON THE BONUS - ${winBonusPoints}$!`;
    this.label.text = bonusText;
  }

  hide(): void {
    this.container.visible = false;
  }
}
