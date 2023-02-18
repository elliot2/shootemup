import * as Phaser from "phaser";
import { GameManager } from "../gamemanager";
import { Enemy } from "./enemy";
import { HomingMissile } from "./homingmissile";

export class Raptor extends Enemy {
  protected speed: number;
  protected fireRate: number = 2000;
  protected time: number = 0;
  protected lastFireTime: number = 0;
  protected targetY: number;
  protected currentY: number;
  protected delay: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    maxSpeed: number = 100,
    minFireDelay: number = 1000
  ) {
    super(scene, x, y, "enemy2");
    this.speed = Phaser.Math.Between(30, maxSpeed); // 100
    if (Math.random() > 0.5) this.speed *= -1;

    this.fireRate = Phaser.Math.Between(minFireDelay, 2000); // 1000
    this.lastFireTime = 0;
    this.scale = 0.8;

    this.targetY = Phaser.Math.Between(
      this.scene.game.canvas.height / 5,
      this.scene.game.canvas.height / 2
    );
    this.delay = Phaser.Math.Between(0, 1000); // Add a random delay between 0 and 5000 milliseconds

    this.currentY = -Phaser.Math.Between(
      this.scene.game.canvas.height / 5,
      this.scene.game.canvas.height / 2
    );
    this.x = Phaser.Math.Between(1, this.scene.game.canvas.width - 1);

    this.scene.add.existing(this);
  }

  fireBullet() {
    let bullet = new HomingMissile(
      this.scene,
      this.x + Math.cos(this.rotation) * (this.getBounds().width / 2),
      this.y + Math.sin(this.rotation) * (this.getBounds().height / 2)
    );
    this.bulletSound.play();
  }

  preUpdate(time: number, delta: number) {
    this.time += delta;

    // Rotate towards player.
    if (!!(this.scene as GameManager).player) {
      // Calculate the angle between the enemy and the player
      let angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        (this.scene as GameManager).player?.x ?? 0,
        (this.scene as GameManager).player?.y ?? 0
      );
      this.rotation = angle;
    } else {
      // Rotate sprite
      // radians = degrees * pi / 180.
      this.rotation = Math.PI / 2; //90 degrees
    }

    this.x += this.speed * (delta * 0.01);
    if (this.currentY < this.targetY) {
      this.currentY += Math.abs(this.speed) * (delta * 0.01);
    }

    this.y = this.currentY + Math.cos(this.time * 0.005) * 60;

    // Fire a bullet towards the player every fireRate in 1000ths of second
    if (
      this.time - this.lastFireTime > this.fireRate &&
      this.time > this.delay
    ) {
      this.fireBullet();
      this.lastFireTime = this.time;
    }

    // Change the enemy's direction if it reaches the edge of the screen
    if (this.x < 0 || this.x > this.scene.game.canvas.width) {
      this.speed *= -1;
    }
  }
}
