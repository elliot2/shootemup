import * as Phaser from "phaser";
import { Bullet } from "./bullet";
import { GameManager } from "../gamemanager";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private fireKey: Phaser.Input.Keyboard.Key;
  private bulletSound: Phaser.Sound.BaseSound;
  private fired: boolean = false;
  public invincible: boolean = true;
  private invincibilityCounter: number = 2000;
  private intervalId: number | undefined;
  public imDie: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    // Load the bullet sound effect
    this.bulletSound = this.scene.game.sound.add("bullet-fired");
    this.scale = 0.2;
    this.name = "player";

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBodySize(this.width - 200, this.height - 220, true);

    let cl = (this.scene as GameManager).layer;
    if (cl)
      this.scene.physics.add.collider(
        this,
        cl,
        (ob1, ob2) => (this.imDie = true)
      );

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.fireKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  create() {}

  preUpdate(time: number, delta: number) {
    const velocity = 500 * delta * 0.06;
    const { left, right, up, down } = this.cursors;

    if (this.invincible) {
      this.body.checkCollision.none = true;
      this.invincibilityCounter -= delta;
      if (this.invincibilityCounter <= 0) {
        this.invincible = false;
        this.body.checkCollision.none = false;
        clearInterval(this.intervalId);
        this.setVisible(true);
      } else if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          this.setVisible(!this.visible);
        }, 100);
      }
    }

    // Horizontal movement
    if (left.isDown) {
      this.setVelocityX(-velocity);
    } else if (right.isDown) {
      this.setVelocityX(velocity);
    } else {
      // this.setVelocityX(Math.random() * 20 - 10);
      this.setVelocityX(0);
    }

    // Vertical movement
    if (up.isDown) {
      this.setVelocityY(-velocity);
    } else if (down.isDown) {
      this.setVelocityY(velocity);
    } else {
      // this.setVelocityY(Math.random() * 20 - 10);
      this.setVelocityY(0);
    }

    // Boundary detection
    const halfWidth = this.getBounds().width / 2;
    const halfHeight = this.getBounds().height / 2;
    const canvasWidth = this.scene.game.canvas.width;
    const canvasHeight = this.scene.game.canvas.height;

    if (this.x < halfWidth) {
      this.setX(halfWidth);
    } else if (this.x > canvasWidth - halfWidth) {
      this.setX(canvasWidth - halfWidth);
    }

    if (this.y < halfHeight) {
      this.setY(halfHeight);
    } else if (this.y > canvasHeight - halfHeight) {
      this.setY(canvasHeight - halfHeight);
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
