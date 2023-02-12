import * as Phaser from "phaser";
import { GameManager } from "../gamemanager";
import { EnemyBullet } from "./enemybullet";

export class Enemy extends Phaser.GameObjects.Sprite {
  private speed: number;
  private fireRate: number = 2000;
  private time: number = 0;
  private lastFireTime: number = 0;
  private bulletSound: Phaser.Sound.BaseSound;
  private targetY: number;
  private currentY: number;
  private delay: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    maxSpeed: number = 100,
    minFireDelay: number = 1000
  ) {
    super(scene, x, y, "enemy");
    this.speed = Phaser.Math.Between(30, maxSpeed); // 100
    if (Math.random() > 0.5) this.speed *= -1;

    this.fireRate = Phaser.Math.Between(minFireDelay, 2000); // 1000
    this.lastFireTime = 0;
    this.scale = 0.8;
    this.bulletSound = this.scene.game.sound.add("bullet-fired");
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

    this.name = "enemy";
    this.scene.add.existing(this);
  }

  preUpdate(time: number, delta: number) {
    this.time += delta;
    this.x += this.speed * (delta * 0.01);
    if (this.currentY < this.targetY) {
      this.currentY += Math.abs(this.speed) * (delta * 0.01);
    }

    this.y = this.currentY + Math.sin(this.time * 0.01) * 60;

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

  private fireBullet() {
    let bullet = new EnemyBullet(
      this.scene,
      this.x,
      this.y + this.getBounds().height / 2
    );
    this.bulletSound.play();
  }
}
