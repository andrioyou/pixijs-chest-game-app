import { Container, SplitText } from 'pixi.js';
import { gsap } from 'gsap';

export class Title {
  container: Container;
  constructor() {
    this.container = new Container();

    const splitText = new SplitText({
      text: 'Chest game',
      style: {
        fontFamily: 'Arial',
        fontSize: 50,
        fontWeight: 'bold',
        fill: 'black',
      },
    });

    splitText.x = -splitText.width / 2;
    splitText.y = -splitText.height / 2;
    this.container.addChild(splitText);

    this.animate(splitText);
  }

  private animate(splitText: SplitText): void {
    gsap.fromTo(
      splitText.chars,
      {
        y: 0,
        rotation: 0,
        alpha: 0,
        scale: 0,
      },
      {
        y: 0,
        rotation: Math.PI * 2,
        alpha: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        onComplete: () => {
          gsap.to(splitText.chars, {
            y: -10,
            duration: 1,
            ease: 'sine.inOut',
            stagger: {
              each: 0.08,
              repeat: -1,
              yoyo: true,
            },
          });
        },
      },
    );
  }
}
