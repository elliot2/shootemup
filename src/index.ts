import * as Phaser from "phaser";
import { GameManager } from "./gamemanager";
import { InitialsScene } from "./classes/initialscene";

var game: any = null;
const config = {
  width: 1280,
  height: 720,
  backgroundColor: "#000000",
  type: Phaser.AUTO,
  parent: "game",
  scene: [GameManager, InitialsScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: Phaser.Scale.Orientation.LANDSCAPE,
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  debug: {
    marker: true,
    add: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: {
        y: 0,
      },
    },
  },
};

export class Game extends Phaser.Game {
  constructor(config: object) {
    super(config);
  }
}

window.addEventListener("load", () => {
  game = new Game(config);
});
