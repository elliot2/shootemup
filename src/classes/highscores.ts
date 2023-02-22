import "phaser";
import { GameManager } from "../gamemanager";
import { API, GameStatusType } from "./api";

export class HighScores extends Phaser.Scene {
  private transferring: boolean = false;
  places = ["1ST", "2ND", "3RD", "4TH", "5TH"];
  constructor() {
    super({ key: "HighScores" });
  }

  preload() {
    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
  }

  pad(str: string, len: number): string {
    if (str.length >= len) {
      return str;
    }
    const numSpaces = len - str.length;
    const spaces = " ".repeat(numSpaces);
    return str + spaces;
  }

  highScores(val: GameStatusType[]) {
    let y = 160;
    for (let i = 0; i < val.length; i++) {
      let score: string = val[i].score + "";
      let name: string = val[i].name ?? "";
      this.add
        .bitmapText(
          80,
          y,
          "arcade",
          this.places[i] + "   " + this.pad(score, 9) + name
        )
        .setTint(0xff8200);
      y += 50;
    }
  }

  create() {
    // Change game scene size
    this.game.scale.setGameSize(800, 600);

    // Add code to create the initials entry scene
    this.transferring = false;

    var legend = this.add
      .bitmapText(80, 60, "arcade", "RANK  SCORE   NAME")
      .setTint(0xff00ff);

    API.getGames().then((val) => this.highScores(val));
  }

  update() {
    if (!this.transferring) {
      this.transferring = true;
      setTimeout(() => {
        this.scene.start("GameManager");
      }, 5000);
    }
  }
}
