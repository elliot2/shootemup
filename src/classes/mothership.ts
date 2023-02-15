import * as Phaser from "phaser";
import { GameManager } from "../gamemanager";
import { Enemy } from "./enemy";

export class Mothership extends Enemy {
  private mothershipSound: Phaser.Sound.BaseSound;
  protected speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "mothership"); // 'bullet' is the key of the bullet sprite in the game's asset cache

    // lives points
    this.livesReward = 1;
    this.pointReward = 400;

    // Set the motherships's movement speed
    this.speed = 60;

    // play sound
    this.mothershipSound = this.scene.sound.add("mothership-loop");
    this.mothershipSound.play({ loop: true, volume: 0.5 });

    // Add the mothership's sprite to the game world
    this.scene.add.existing(this);

    // put in the GameManager
    (this.scene as GameManager).mothership = this;
  }

  preUpdate(time: number, delta: number) {
    // Move the bullet up or down based on its direction
    this.x += this.speed * (delta * 0.01);

    // Destroy the mothership if it goes off the screen
    if (this.x > this.scene.game.canvas.width + this.getBounds().width) {
      this.destroy();
    }
  }

  destroy() {
    this.mothershipSound.stop();
    (this.scene as GameManager).mothership = undefined;
    super.destroy();
  }
}
