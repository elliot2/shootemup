import * as Phaser from "phaser";
import { Bullet } from "./bullet";
import { GameManager } from "../gamemanager";

export class Player extends Phaser.GameObjects.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private fireKey: Phaser.Input.Keyboard.Key;
  private bulletSound: Phaser.Sound.BaseSound;
  private fired: boolean = false;
  public invincible: boolean = true;
  private invincibilityCounter: number = 2000;
  private intervalId: number | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    // Load the bullet sound effect
    this.bulletSound = this.scene.game.sound.add("bullet-fired");
    this.scale = 0.2;
    this.name = "player";
    this.scene.add.existing(this);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.fireKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  preUpdate(time: number, delta: number) {
    if (this.invincible) {
      this.invincibilityCounter -= delta;
      if (this.invincibilityCounter <= 0) {
        this.invincible = false;
        clearInterval(this.intervalId);
        this.setVisible(true);
      } else if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          this.setVisible(!this.visible);
        }, 100);
      }
    }

    // Move the player left or right based on user input
    if (this.cursors.left.isDown) {
      this.x = Math.max(
        0 + this.getBounds().width / 2,
        this.x - 50 * (delta * 0.01)
      );
    } else if (this.cursors.right.isDown) {
      this.x = Math.min(
        this.scene.game.canvas.width - this.getBounds().width / 2,
        this.x + 50 * (delta * 0.01)
      );
    }
    if (this.cursors.up.isDown) {
      this.y = Math.max(
        0 + this.getBounds().height / 2,
        this.y - 50 * (delta * 0.01)
      );
    } else if (this.cursors.down.isDown) {
      this.y = Math.min(
        this.scene.game.canvas.height - this.getBounds().height / 2,
        this.y + 50 * (delta * 0.01)
      );
    }

    // Fire a bullet if the fire button is pressed
    if (this.fireKey.isDown && !this.fired) {
      let bullet = new Bullet(
        this.scene,
        this.x,
        this.y - this.getBounds().height / 2
      );
      this.bulletSound.play();
      this.fired = true;
    }
    if (this.fireKey.isUp) {
      this.fired = false;
    }
  }
}
