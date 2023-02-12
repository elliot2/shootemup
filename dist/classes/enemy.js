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
import * as Phaser from "phaser";
import { EnemyBullet } from "./enemybullet";
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(scene, x, y, maxSpeed, minFireDelay) {
        if (maxSpeed === void 0) { maxSpeed = 100; }
        if (minFireDelay === void 0) { minFireDelay = 1000; }
        var _this = _super.call(this, scene, x, y, "enemy") || this;
        _this.fireRate = 2000;
        _this.time = 0;
        _this.lastFireTime = 0;
        _this.speed = Phaser.Math.Between(30, maxSpeed); // 100
        if (Math.random() > 0.5)
            _this.speed *= -1;
        _this.fireRate = Phaser.Math.Between(minFireDelay, 2000); // 1000
        _this.lastFireTime = 0;
        _this.scale = 0.8;
        _this.bulletSound = _this.scene.game.sound.add("bullet-fired");
        _this.targetY = Phaser.Math.Between(_this.scene.game.canvas.height / 5, _this.scene.game.canvas.height / 2);
        _this.delay = Phaser.Math.Between(0, 1000); // Add a random delay between 0 and 5000 milliseconds
        _this.currentY = -Phaser.Math.Between(_this.scene.game.canvas.height / 5, _this.scene.game.canvas.height / 2);
        _this.x = Phaser.Math.Between(1, _this.scene.game.canvas.width - 1);
        _this.name = "enemy";
        _this.scene.add.existing(_this);
        return _this;
    }
    Enemy.prototype.preUpdate = function (time, delta) {
        this.time += delta;
        this.x += this.speed * (delta * 0.01);
        if (this.currentY < this.targetY) {
            this.currentY += Math.abs(this.speed) * (delta * 0.01);
        }
        this.y = this.currentY + Math.sin(this.time * 0.01) * 60;
        // Fire a bullet towards the player every fireRate in 1000ths of second
        if (this.time - this.lastFireTime > this.fireRate &&
            this.time > this.delay) {
            this.fireBullet();
            this.lastFireTime = this.time;
        }
        // Change the enemy's direction if it reaches the edge of the screen
        if (this.x < 0 || this.x > this.scene.game.canvas.width) {
            this.speed *= -1;
        }
    };
    Enemy.prototype.fireBullet = function () {
        var bullet = new EnemyBullet(this.scene, this.x, this.y + this.getBounds().height / 2);
        this.bulletSound.play();
    };
    return Enemy;
}(Phaser.GameObjects.Sprite));
export { Enemy };
//# sourceMappingURL=enemy.js.map