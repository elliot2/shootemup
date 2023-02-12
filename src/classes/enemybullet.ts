import * as Phaser from "phaser";
import { GameManager } from "../gamemanager";

export class EnemyBullet extends Phaser.GameObjects.Sprite {
  private speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet"); // 'bullet' is the key of the bullet sprite in the game's asset cache

    // Set the bullet's movement speed
    this.speed = 100;

    // Rotate sprite
    this.angle = 180;

    this.name = "enemyBullet";

    // Add the bullet's sprite to the game world
    this.scene.add.existing(this);
  }

  preUpdate(time: number, delta: number) {
    // Move the bullet up or down based on its direction
    this.y += this.speed * (delta * 0.01);

    // Destroy the bullet if it goes off the screen
    if (
      this.y < -this.getBounds().height ||
      this.y > this.scene.game.canvas.height
    ) {
      this.destroy();
    }
  }
}
