import * as Phaser from "phaser";
import { GameManager } from "./gamemanager";
import { InitialsScene } from "./classes/initialscene";
import TubePostFX from "./classes/tubePostFX";
import { HighScores } from "./classes/highscores";

var game: Game | undefined = undefined;
const config = {
  width: 1280,
  height: 720,
  backgroundColor: "#000000",
  type: Phaser.WEBGL,
  parent: "game",
  scene: [GameManager, InitialsScene, HighScores],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: Phaser.Scale.Orientation.LANDSCAPE,
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
