import "phaser";
import { GameManager } from "../gamemanager";
import { API, GameStatusType } from "./api";

export class InitialsScene extends Phaser.Scene {
  private transferring: boolean = false;
  places = ["1ST", "2ND", "3RD", "4TH", "5TH"];
  constructor() {
    super({ key: "InitialsScene" });
  }

  preload() {
    this.load.image("block", "assets/block.png");
    this.load.image("rub", "assets/rub.png");
    this.load.image("end", "assets/end.png");
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
    let y = 360;
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
    var chars = [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", ".", "-", "<", ">"],
    ];
    var cursor = { x: 0, y: 0 };
    var name = "";

    var input = this.add
      .bitmapText(130, 50, "arcade", "ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-")
      .setLetterSpacing(20);

    input.setInteractive();

    var rub = this.add.image(input.x + 430, input.y + 148, "rub");
    var end = this.add.image(input.x + 482, input.y + 148, "end");

    var block = this.add.image(input.x - 10, input.y - 2, "block").setOrigin(0);

    var legend = this.add
      .bitmapText(80, 260, "arcade", "RANK  SCORE   NAME")
      .setTint(0xff00ff);

    let gameManager: GameManager = this.game.scene.getScene(
      "GameManager"
    ) as GameManager;
    let score = gameManager.gameStatus.score + "";
    this.add
      .bitmapText(80, 310, "arcade", "      " + this.pad(score, 9))
      .setTint(0xff0000);

    API.getGames().then((val) => this.highScores(val));

    // this.add
    //   .bitmapText(80, 360, "arcade", "2ND   40000    ICE")
    //   .setTint(0xff8200);
    // this.add
    //   .bitmapText(80, 410, "arcade", "3RD   30000    GOS")
    //   .setTint(0xffff00);
    // this.add
    //   .bitmapText(80, 460, "arcade", "4TH   20000    HRE")
    //   .setTint(0x00ff00);
    // this.add
    //   .bitmapText(80, 510, "arcade", "5TH   10000    ETE")
    //   .setTint(0x00bfff);

    var playerText = this.add
      .bitmapText(560, 310, "arcade", name)
      .setTint(0xff0000);

    this.input.keyboard.on("keyup", (event: any) => {
      if (event.keyCode === 37) {
        //  left
        if (cursor.x > 0) {
          cursor.x--;
          block.x -= 52;
        }
      } else if (event.keyCode === 39) {
        //  right
        if (cursor.x < 9) {
          cursor.x++;
          block.x += 52;
        }
      } else if (event.keyCode === 38) {
        //  up
        if (cursor.y > 0) {
          cursor.y--;
          block.y -= 64;
        }
      } else if (event.keyCode === 40) {
        //  down
        if (cursor.y < 2) {
          cursor.y++;
          block.y += 64;
        }
      } else if (event.keyCode === 13 || event.keyCode === 32) {
        //  Enter or Space
        if (cursor.x === 9 && cursor.y === 2 && name.length > 0) {
          //  Submit
          gameManager.gameStatus.name = name;
          API.updateStatus(gameManager.gameStatus);
          this.scene.start("GameManager");
        } else if (cursor.x === 8 && cursor.y === 2 && name.length > 0) {
          //  Rub
          name = name.substr(0, name.length - 1);

          playerText.text = name;
        } else if (name.length < 3) {
          //  Add
          name = name.concat(chars[cursor.y][cursor.x]);

          playerText.text = name;
        }
      }
    });

    // input.on(
    //   "pointermove",
    //   (pointer: any, x: number, y: number) => {
    //     var cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    //     var cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
    //     var char = chars[cy][cx];

    //     cursor.x = cx;
    //     cursor.y = cy;

    //     block.x = input.x - 10 + cx * 52;
    //     block.y = input.y - 2 + cy * 64;
    //   },
    //   this
    // );

    // input.on(
    //   "pointerup",
    //   function (pointer: any, x: number, y: number) {
    //     var cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    //     var cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
    //     var char = chars[cy][cx];

    //     cursor.x = cx;
    //     cursor.y = cy;

    //     block.x = input.x - 10 + cx * 52;
    //     block.y = input.y - 2 + cy * 64;

    //     if (char === "<" && name.length > 0) {
    //       //  Rub
    //       name = name.substr(0, name.length - 1);

    //       playerText.text = name;
    //     } else if (char === ">" && name.length > 0) {
    //       //  Submit
    //     } else if (name.length < 3) {
    //       //  Add
    //       name = name.concat(char);

    //       playerText.text = name;
    //     }
    //   },
    //   this
    // );
  }

  update() {
    // if (!this.transferring) {
    //   this.transferring = true;
    //   setTimeout(() => {
    //     this.scene.start("GameManager");
    //   }, 10000);
    // }
  }
}
