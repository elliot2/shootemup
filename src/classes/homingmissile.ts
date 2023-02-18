import * as Phaser from "phaser";
import { GameManager } from "../gamemanager";

export class HomingMissile extends Phaser.GameObjects.Sprite {
  private speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "missile"); // 'bullet' is the key of the bullet sprite in the game's asset cache

    // Set the bullet's movement speed
    this.speed = 50;

    if (!!(scene as GameManager).player) {
      // Calculate the angle between the enemy and the player
      let angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        (scene as GameManager).player?.x ?? 0,
        (scene as GameManager).player?.y ?? 0
      );
      this.rotation = angle;
    } else {
      // Rotate sprite
      // radians = degrees * pi / 180.
      this.rotation = Math.PI / 2; //90 degrees
    }

    this.name = "enemyBullet";

    // Add the bullet's sprite to the game world
    this.scene.add.existing(this);
  }

  preUpdate(time: number, delta: number) {
    // Move the bullet up or down based on its angle
    this.x += this.speed * (delta * 0.01) * Math.cos(this.rotation);
    this.y += this.speed * (delta * 0.01) * Math.sin(this.rotation);

    // Destroy the bullet if it goes off the screen
    if (
      this.y < -this.getBounds().height ||
      this.y > this.scene.game.canvas.height ||
      this.x > this.scene.game.canvas.width ||
      this.x < -this.getBounds().width
    ) {
      this.destroy();
    }
  }
}
