import * as Phaser from "phaser";

export class Explosion extends Phaser.GameObjects.Sprite {
  private explosionSound: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "explosion");
    this.explosionSound = this.scene.game.sound.add("explosion-sound");
    this.scale = 1.5;
    this.scene.add.existing(this);
    this.play("explosion");
    this.explosionSound.play();
  }
}
