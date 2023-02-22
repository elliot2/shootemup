import "phaser";
import { API, GameStatusType } from "./classes/api";
import { Bullet } from "./classes/bullet";
import { Enemy } from "./classes/enemy";
import { EnemyBullet } from "./classes/enemybullet";
import { Explosion } from "./classes/explosition";
import { Mothership } from "./classes/mothership";
import { Phantom } from "./classes/phantom";
import { Player } from "./classes/player";
import { Raptor } from "./classes/raptor";
import { Starfield } from "./classes/starfield";
import TubePostFX from "./classes/tubePostFX";

const BUILD_INFO: string = `v1.15`;

export class GameManager extends Phaser.Scene {
  public player: Player | undefined = undefined;

  public mothership: Mothership | undefined = undefined;

  private spawningWave: boolean = false;
  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text | undefined = undefined;

  private lives: number = 3;
  private livesImages: Phaser.GameObjects.Image[] = [];

  private isGameOver: boolean = true;
  private gameOverText: Phaser.GameObjects.Text | undefined = undefined;

  private startKey: Phaser.Input.Keyboard.Key | undefined = undefined;
  private startPressed: boolean = false;

  private waveText: Phaser.GameObjects.Text | undefined = undefined;
  private wave: number = 1;
  private backgroundMusic: Phaser.Sound.BaseSound | undefined = undefined;
  private gameOverLogo: Phaser.GameObjects.Image | undefined = undefined;
  private versionText: Phaser.GameObjects.Text | undefined = undefined;
  private transferring: boolean = true; // set to true so it does not transfer until the first game.

  // game state
  public gameStatus: GameStatusType = {
    wave: 0,
    score: 0,
    lastUpdate: 0,
  };
  private customPipeline: Phaser.Renderer.WebGL.PipelineManager | undefined;
  private highscoresTimeout: number | undefined;
  private transferringHighScore: boolean = false;
  private map: Phaser.Tilemaps.Tilemap | undefined;
  private tileset: Phaser.Tilemaps.Tileset | undefined;
  public layer: Phaser.Tilemaps.TilemapLayer | undefined;
  // public collisionsLayer: Phaser.Tilemaps.TilemapLayer | undefined;
  private debugGraphics: Phaser.GameObjects.Graphics | undefined;
  private mapScrollY: number = 0;

  constructor() {
    super("GameManager");
  }

  preload() {
    // preload assets here
    this.load.image("gameOverLogo", "assets/logo.png");
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("enemy2", "assets/enemy2.png");
    this.load.image("mothership", "assets/mothership.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("missile", "assets/missile.png");
    this.load.spritesheet("explosion_animation", "assets/explosion.png", {
      frameWidth: 192,
      frameHeight: 192,
      endFrame: 20,
    });
    this.load.audio("bullet-fired", "assets/shoot.wav");
    this.load.audio("explosion-sound", "assets/explosion.wav");
    this.load.audio("bgm", "assets/loop.mp3");
    this.load.audio("mothership-loop", "assets/mothership.mp3");
    this.load.image("starfield", "assets/starfield.png");
    this.load.image("frameTexture", "assets/crt.png");
    this.load.image("tiles", "assets/tiles.png");
    this.load.tilemapTiledJSON("map", "assets/map1.json");
  }

  drawLives() {
    // reset lives
    let life = this.livesImages.pop();
    do {
      if (life) {
        life.destroy();
        life = this.livesImages.pop();
      }
    } while (life);

    for (let i = 0; i < this.lives; i++) {
      let life = this.add.image(50 + i * 48, 48, "player").setScale(0.08);
      this.livesImages.push(life);
    }
  }

  startScene() {
    if (this.highscoresTimeout) {
      clearTimeout(this.highscoresTimeout);
      this.highscoresTimeout = undefined;
    }
    this.transferringHighScore = false;

    this.transferring = false;
    this.lives = 3;
    this.drawLives();

    // reset score, create player, enemies
    this.startPressed = false;
    this.score = 0;
    this.player = new Player(this, 640, this.game.canvas.height - 55);

    // call game init
    API.gameInit().then((game) => (this.gameStatus.uuid = game.uuid));
    this.gameStatus.score = 0;
    this.gameStatus.wave = 0;
    this.gameStatus.name = ""; // Clear name so scores don't all get replaced on each update.

    // wave 1
    this.wave = 1;
    if (this.waveText) this.waveText.setText(`Wave ${this.wave}`);
    this.tweens.add({
      targets: this.waveText,
      alpha: 1,
      duration: 1000,
      ease: "Power1",
    });
    this.spawningWave = true;
    setTimeout(() => {
      this.spawnWave();
      this.spawningWave = false;
    }, 2000);
  }

  gameOver() {
    this.isGameOver = true;
    this.children.list
      .filter((value) => value.name)
      .forEach((gameObj) => {
        if (gameObj.name === "bullet") (gameObj as Bullet).destroy();
        if (gameObj.name === "enemy") (gameObj as Enemy).destroy();
        if (gameObj.name === "enemyBullet") (gameObj as EnemyBullet).destroy();
      });
    this.gameOverText?.setAlpha(0);

    // Create a transition that fades the text in over 2 seconds
    this.tweens.add({
      targets: this.gameOverText,
      alpha: 1,
      duration: 1000,
      ease: "Power1",
    });
    this.tweens.add({
      targets: this.gameOverLogo,
      alpha: 0.5,
      scale: 1,
      duration: 1000,
      ease: "Power1",
    });
  }

  create() {
    // Change game scene size
    this.game.scale.setGameSize(1280, 720);

    this.transferringHighScore = false;

    // Post fx
    const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    this.customPipeline = renderer.pipelines.addPostPipeline(
      "TubePostFX",
      TubePostFX
    );
    this.cameras.main.setPostPipeline("TubePostFX");

    // key input
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    // star field
    new Starfield(this, 0, 0, 5);
    new Starfield(this, 0, -this.game.canvas.height, 5);

    // map
    this.map = this.make.tilemap({ key: "map", tileWidth: 64, tileHeight: 64 });
    this.tileset = this.map.addTilesetImage("tiles1", "tiles");
    this.layer = this.map.createLayer(0, this.tileset, 0, 0);

    // Tiled editor tile ID + 1
    this.layer.setCollisionBetween(1, 3, true);
    this.layer.setCollisionBetween(6, 8, true);
    this.layer.setCollisionBetween(11, 13, true);
    this.layer.setCollisionBetween(18, 18, true);
    this.layer.setCollisionBetween(21, 23, true);

    this.debugGraphics = this.add.graphics();
    // this.physics.world.createDebugGraphic();
    this.mapScrollY = -this.map.heightInPixels;
    this.layer.setPosition(0, this.mapScrollY);

    this.layer.setTileIndexCallback(
      [1, 2, 3, 6, 7, 8, 11, 12, 13, 18, 21, 22, 23],
      (sprite: any, tile: any) => ((sprite as Player).imDie = true),
      this
    );

    // Lives
    this.drawLives();

    // Score text
    this.scoreText = this.add.text(640, 20, `Score: ${this.score}`, {
      fontFamily: "Monospace",
      fontSize: "24px",
      color: "#ffffff",
      align: "center",
    });
    this.scoreText.setOrigin(0.5, 0);
    this.scoreText.depth = 100;

    // Version
    this.versionText = this.add.text(1280, 0, BUILD_INFO, {
      fontFamily: "Monospace",
      fontSize: "12px",
      color: "#ffffff",
      align: "center",
    });
    this.versionText.setOrigin(1, 0);
    this.versionText.depth = 100;

    // Wave text
    this.waveText = this.add.text(
      640,
      this.game.canvas.height / 2,
      `Wave ${this.wave}`,
      {
        fontFamily: "Monospace",
        fontSize: "48px",
        color: "#ffffff",
        align: "center",
      }
    );
    this.waveText.setOrigin(0.5, 0.5);
    this.waveText.depth = 100;
    this.waveText.setAlpha(0);

    // logo
    this.gameOverLogo = this.add.image(900, 300, "gameOverLogo");
    this.gameOverLogo.alpha = 0;
    this.gameOverLogo.scale = 0.1;

    // Game Over text
    this.gameOverText = this.add.text(
      640,
      this.game.canvas.height / 2,
      `GAME OVER\nPress ENTER to start`,
      {
        fontFamily: "Monospace",
        fontSize: "48px",
        color: "#ffffff",
        align: "center",
      }
    );
    this.gameOverText.setOrigin(0.5, 0.5);
    this.gameOverText.depth = 100;
    this.gameOverText.setAlpha(0);

    // Create a transition that fades the text in over 2 seconds
    this.tweens.add({
      targets: this.gameOverText,
      alpha: 1,
      duration: 1000,
      ease: "Power1",
    });
    this.tweens.add({
      targets: this.gameOverLogo,
      alpha: 0.5,
      scale: 1,
      duration: 1000,
      ease: "Power1",
    });

    // Explosion Animation
    this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNumbers("explosion_animation", {
        start: 0,
        end: 20,
      }),
      frameRate: 24,
      repeat: 0,
    });

    this.input.on("pointerup", () => {
      this.scale.startFullscreen();
      this.input.setDefaultCursor("none");
    });

    // Prevent it from being created each time the scene is switched.
    if (!this.backgroundMusic) {
      this.backgroundMusic = this.sound.add("bgm");
      this.backgroundMusic.play({ loop: true, volume: 0.3 });
    }
  }

  spawnWave() {
    this.tweens.add({
      targets: this.waveText,
      alpha: 0,
      duration: 1000,
      ease: "Power1",
    });

    for (let i = 0; i < Math.min(this.wave, 10); i++) {
      new Phantom(
        this,
        i * 100 + 50,
        -1000,
        90 + this.wave * 2,
        1100 - this.wave * 40
      );
    }
    if (this.wave > 15) {
      for (let i = 0; i < Math.min(this.wave / 15, 10); i++) {
        new Raptor(
          this,
          i * 100 + 50,
          -1000,
          90 + this.wave * 2,
          1100 - this.wave * 20
        );
      }
    }
  }

  initialsScene() {
    if (this.transferring) return;
    this.transferring = true;
    this.scene.start("InitialsScene");
  }

  playerBang() {
    if (!this.player) return;

    this.player.destroy();

    // Update lives
    this.lives -= 1;
    if (this.lives >= 0) {
      let life = this.livesImages.pop();
      if (life) {
        life.destroy();
      }
      // respawn player
      setTimeout(() => {
        this.player = new Player(this, 640, this.game.canvas.height - 55);
      }, 1000);
    } else {
      // game over
      this.gameOver();
    }

    // create explosion
    new Explosion(this, this.player.x, this.player.y);
    this.player = undefined;
  }

  update(time: number, delta: number) {
    if (this.isGameOver) {
      this.gameStatus.score = this.score;

      // If score is in top 5 go here, condition not implemented.
      if (!this.transferring) {
        this.initialsScene();
      } else if (!this.transferringHighScore) {
        this.transferringHighScore = true;
        this.highscoresTimeout = setTimeout(
          () => this.scene.start("HighScores"),
          10000
        );
      }

      if (this.startKey?.isDown && !this.startPressed) {
        this.startPressed = true;
        this.tweens.add({
          targets: this.gameOverText,
          alpha: 0,
          duration: 1000,
          ease: "Power1",
        });
        this.tweens.add({
          targets: this.gameOverLogo,
          alpha: 0,
          scale: 0.5,
          duration: 1000,
          ease: "Power1",
        });
        setTimeout(() => {
          this.startScene();
          this.isGameOver = false;
        }, 1000); // 1 seconds delay
      }
    }

    // Update score
    if (this.scoreText) this.scoreText.setText(`Score: ${this.score}`);

    // Don't do anything else.
    if (this.isGameOver) {
      return;
    }

    // scroll camera
    if (this.layer) {
      this.layer.setPosition(0, this.mapScrollY);
      this.mapScrollY += delta * 0.1;
    }

    // debug collisions
    // if (this.debugGraphics && this.map) {
    //   this.debugGraphics.clear();
    //   this.map.renderDebug(this.debugGraphics, {
    //     tileColor: null, // Non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Colliding face edges
    //   });
    // }

    // spawn mothership
    if (Math.random() * 1000 < 1 && !this.mothership && this.wave > 10) {
      // spawn mothership
      this.mothership = new Mothership(this, -100, 70);
    }

    if (!this.player?.invincible) {
      this.children.list
        .filter((value) => value.name == "enemyBullet" || value.name == "enemy")
        .forEach((enemyBullet) => {
          if (
            this.player &&
            Phaser.Geom.Intersects.RectangleToRectangle(
              (enemyBullet as EnemyBullet).getBounds(),
              this.player.getBounds()
            )
          ) {
            enemyBullet.destroy();
            this.playerBang();
          }
        });
      // player reports it collided.
      if (this.player) {
        if (this.player.imDie) this.playerBang();
      }
    }

    this.children.list
      .filter((value) => value.name == "bullet")
      .forEach((bullet) => {
        this.children.list
          .filter((value) => value.name == "enemy")
          .forEach((enemy) => {
            if (
              Phaser.Geom.Intersects.RectangleToRectangle(
                (bullet as Bullet).getBounds(),
                (enemy as Enemy).getBounds()
              )
            ) {
              this.score += (enemy as Enemy).pointReward; // increase the score
              this.lives += (enemy as Enemy).livesReward; // increase lives
              if ((enemy as Enemy).livesReward > 0) {
                this.drawLives();
              }
              enemy.destroy();
              bullet.destroy();
              // create explosion
              new Explosion(this, (enemy as Enemy).x, (enemy as Enemy).y);
            }
          });
      });

    if (
      this.children.list.filter((value) => value.name == "enemy").length == 0 &&
      !this.isGameOver
    ) {
      if (!this.spawningWave) {
        // Update wave
        this.spawningWave = true;
        this.wave++;

        // Post API update
        this.gameStatus.score = this.score;
        this.gameStatus.wave = this.wave;
        API.updateStatus(this.gameStatus);

        if (this.waveText) this.waveText.setText(`Wave ${this.wave}`);
        this.tweens.add({
          targets: this.waveText,
          alpha: 1,
          duration: 1000,
          ease: "Power1",
        });
        setTimeout(() => {
          this.spawnWave();
          this.spawningWave = false;
          this.score += 100; // increase the score
        }, 2000);
      }
    }
  }
}
