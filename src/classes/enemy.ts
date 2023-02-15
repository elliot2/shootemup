import * as Phaser from "phaser";
import { EnemyBullet } from "./enemybullet";

export class Enemy extends Phaser.GameObjects.Sprite {
  protected bulletSound: Phaser.Sound.BaseSound;
  public livesReward: number = 0;
  public pointReward: number = 5;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.bulletSound = this.scene.game.sound.add("bullet-fired");
    this.name = "enemy";
    this.scene.add.existing(this);
  }

  protected fireBullet() {
    let bullet = new EnemyBullet(
      this.scene,
      this.x,
      this.y + this.getBounds().height / 2
    );
    this.bulletSound.play();
  }
}
