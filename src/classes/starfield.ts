import * as Phaser from "phaser";

export class Starfield extends Phaser.GameObjects.Sprite {
  private speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number) {
    super(scene, x, y, "starfield");
    this.speed = speed;
    this.setOrigin(0, 0);

    // add the sprite to the scene and make it display in the background
    scene.add.existing(this).setDepth(-1);
  }

  preUpdate(time: number, delta: number) {
    // update the sprite position along the y-axis based on its speed
    this.y += this.speed * (delta * 0.01);

    // if the sprite goes off the screen, reset its position to the top
    if (this.y > this.scene.game.canvas.height) {
      this.y = -this.scene.game.canvas.height;
    }
  }
}
