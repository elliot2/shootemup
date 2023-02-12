var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import "phaser";
import { Enemy } from "./classes/enemy";
import { Explosion } from "./classes/explosition";
import { Player } from "./classes/player";
import { Starfield } from "./classes/starfield";
var GameManager = /** @class */ (function (_super) {
    __extends(GameManager, _super);
    function GameManager() {
        var _this = _super.call(this, "GameManager") || this;
        _this.player = undefined;
        _this.spawningWave = false;
        _this.score = 0;
        _this.scoreText = undefined;
        _this.lives = 3;
        _this.livesImages = [];
        _this.isGameOver = true;
        _this.gameOverText = undefined;
        _this.startKey = undefined;
        _this.startPressed = false;
        _this.waveText = undefined;
        _this.wave = 1;
        _this.backgroundMusic = undefined;
        return _this;
    }
    GameManager.prototype.preload = function () {
        // preload assets here
        this.load.image("player", "assets/player.png");
        this.load.image("enemy", "assets/enemy.png");
        this.load.image("bullet", "assets/bullet.png");
        this.load.spritesheet("explosion_animation", "assets/explosion.png", {
            frameWidth: 192,
            frameHeight: 192,
            endFrame: 20,
        });
        this.load.audio("bullet-fired", "assets/shoot.wav");
        this.load.audio("explosion-sound", "assets/explosion.wav");
        this.load.audio("bgm", "assets/loop.mp3");
        this.load.image("starfield", "assets/starfield.png");
    };
    GameManager.prototype.drawLives = function () {
        for (var i = 0; i < this.lives; i++) {
            var life = this.add.image(50 + i * 48, 48, "player").setScale(0.08);
            this.livesImages.push(life);
        }
    };
    GameManager.prototype.startScene = function () {
        var _this = this;
        // reset lives
        var life = this.livesImages.pop();
        do {
            if (life) {
                life.destroy();
                life = this.livesImages.pop();
            }
        } while (life);
        this.lives = 3;
        this.drawLives();
        // reset score, create player, enemies
        this.startPressed = false;
        this.score = 0;
        this.player = new Player(this, 640, this.game.canvas.height - 55);
        // wave 1
        this.wave = 1;
        if (this.waveText)
            this.waveText.setText("Wave ".concat(this.wave));
        this.tweens.add({
            targets: this.waveText,
            alpha: 1,
            duration: 1000,
            ease: "Power1",
        });
        this.spawningWave = true;
        setTimeout(function () {
            _this.spawnWave();
            _this.spawningWave = false;
        }, 2000);
    };
    GameManager.prototype.gameOver = function () {
        var _a;
        this.isGameOver = true;
        this.children.list
            .filter(function (value) { return value.name; })
            .forEach(function (gameObj) {
            if (gameObj.name === "bullet")
                gameObj.destroy();
            if (gameObj.name === "enemy")
                gameObj.destroy();
            if (gameObj.name === "enemyBullet")
                gameObj.destroy();
        });
        (_a = this.gameOverText) === null || _a === void 0 ? void 0 : _a.setAlpha(0);
        // Create a transition that fades the text in over 2 seconds
        this.tweens.add({
            targets: this.gameOverText,
            alpha: 1,
            duration: 1000,
            ease: "Power1",
        });
    };
    GameManager.prototype.create = function () {
        var _this = this;
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        new Starfield(this, 0, 0, 10);
        new Starfield(this, 0, -this.game.canvas.height, 10);
        // Lives
        this.drawLives();
        // Score text
        this.scoreText = this.add.text(640, 20, "Score: ".concat(this.score), {
            fontFamily: "Monospace",
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
        });
        this.scoreText.setOrigin(0.5, 0);
        this.scoreText.depth = 100;
        // Wave text
        this.waveText = this.add.text(640, this.game.canvas.height / 2, "Wave ".concat(this.wave), {
            fontFamily: "Monospace",
            fontSize: "48px",
            color: "#ffffff",
            align: "center",
        });
        this.waveText.setOrigin(0.5, 0.5);
        this.waveText.depth = 100;
        this.waveText.setAlpha(0);
        // Game Over text
        this.gameOverText = this.add.text(640, this.game.canvas.height / 2, "GAME OVER\nPress ENTER to start", {
            fontFamily: "Monospace",
            fontSize: "48px",
            color: "#ffffff",
            align: "center",
        });
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
        this.input.on("pointerup", function () {
            _this.scale.startFullscreen();
            _this.input.setDefaultCursor("none");
        });
        this.backgroundMusic = this.sound.add("bgm");
        this.backgroundMusic.play({ loop: true, volume: 0.3 });
    };
    GameManager.prototype.spawnWave = function () {
        this.tweens.add({
            targets: this.waveText,
            alpha: 0,
            duration: 1000,
            ease: "Power1",
        });
        for (var i = 0; i < this.wave; i++) {
            new Enemy(this, i * 100 + 50, -1000, 90 + this.wave * 2, 1100 - this.wave * 40);
        }
    };
    GameManager.prototype.update = function () {
        var _this = this;
        var _a, _b;
        if (this.isGameOver) {
            if (((_a = this.startKey) === null || _a === void 0 ? void 0 : _a.isDown) && !this.startPressed) {
                this.startPressed = true;
                this.tweens.add({
                    targets: this.gameOverText,
                    alpha: 0,
                    duration: 1000,
                    ease: "Power1",
                });
                setTimeout(function () {
                    _this.startScene();
                    _this.isGameOver = false;
                }, 1000); // 1 seconds delay
            }
        }
        // Update score
        if (this.scoreText)
            this.scoreText.setText("Score: ".concat(this.score));
        // Don't do anything.
        if (this.isGameOver) {
            return;
        }
        if (!((_b = this.player) === null || _b === void 0 ? void 0 : _b.invincible))
            this.children.list
                .filter(function (value) { return value.name == "enemyBullet"; })
                .forEach(function (enemyBullet) {
                if (_this.player &&
                    Phaser.Geom.Intersects.RectangleToRectangle(enemyBullet.getBounds(), _this.player.getBounds())) {
                    enemyBullet.destroy();
                    _this.player.destroy();
                    // Update lives
                    _this.lives -= 1;
                    if (_this.lives >= 0) {
                        var life = _this.livesImages.pop();
                        if (life) {
                            life.destroy();
                        }
                        // respawn player
                        setTimeout(function () {
                            _this.player = new Player(_this, 640, _this.game.canvas.height - 55);
                        }, 1000);
                    }
                    else {
                        // game over
                        _this.gameOver();
                    }
                    // create explosion
                    new Explosion(_this, _this.player.x, _this.player.y);
                    _this.player = undefined;
                }
            });
        this.children.list
            .filter(function (value) { return value.name == "bullet"; })
            .forEach(function (bullet) {
            _this.children.list
                .filter(function (value) { return value.name == "enemy"; })
                .forEach(function (enemy) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), enemy.getBounds())) {
                    enemy.destroy();
                    bullet.destroy();
                    // create explosion
                    new Explosion(_this, enemy.x, enemy.y);
                    _this.score += 5; // increase the score
                }
            });
        });
        if (this.children.list.filter(function (value) { return value.name == "enemy"; }).length == 0 &&
            !this.isGameOver) {
            if (!this.spawningWave) {
                // Update wave
                this.spawningWave = true;
                this.wave++;
                if (this.waveText)
                    this.waveText.setText("Wave ".concat(this.wave));
                this.tweens.add({
                    targets: this.waveText,
                    alpha: 1,
                    duration: 1000,
                    ease: "Power1",
                });
                setTimeout(function () {
                    _this.spawnWave();
                    _this.spawningWave = false;
                    _this.score += 100; // increase the score
                }, 2000);
            }
        }
    };
    return GameManager;
}(Phaser.Scene));
export { GameManager };
//# sourceMappingURL=gamemanager.js.map