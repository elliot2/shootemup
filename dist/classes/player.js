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
import { Bullet } from "./bullet";
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "player") || this;
        _this.fired = false;
        _this.invincible = true;
        _this.invincibilityCounter = 2000;
        // Load the bullet sound effect
        _this.bulletSound = _this.scene.game.sound.add("bullet-fired");
        _this.scale = 0.2;
        _this.name = "player";
        _this.scene.add.existing(_this);
        _this.cursors = _this.scene.input.keyboard.createCursorKeys();
        _this.fireKey = _this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        return _this;
    }
    Player.prototype.preUpdate = function (time, delta) {
        var _this = this;
        if (this.invincible) {
            this.invincibilityCounter -= delta;
            if (this.invincibilityCounter <= 0) {
                this.invincible = false;
                clearInterval(this.intervalId);
                this.setVisible(true);
            }
            else if (!this.intervalId) {
                this.intervalId = setInterval(function () {
                    _this.setVisible(!_this.visible);
                }, 100);
            }
        }
        // Move the player left or right based on user input
        if (this.cursors.left.isDown) {
            this.x = Math.max(0 + this.getBounds().width / 2, this.x - 50 * (delta * 0.01));
        }
        else if (this.cursors.right.isDown) {
            this.x = Math.min(this.scene.game.canvas.width - this.getBounds().width / 2, this.x + 50 * (delta * 0.01));
        }
        if (this.cursors.up.isDown) {
            this.y = Math.max(0 + this.getBounds().height / 2, this.y - 50 * (delta * 0.01));
        }
        else if (this.cursors.down.isDown) {
            this.y = Math.min(this.scene.game.canvas.height - this.getBounds().height / 2, this.y + 50 * (delta * 0.01));
        }
        // Fire a bullet if the fire button is pressed
        if (this.fireKey.isDown && !this.fired) {
            var bullet = new Bullet(this.scene, this.x, this.y - this.getBounds().height / 2);
            this.bulletSound.play();
            this.fired = true;
        }
        if (this.fireKey.isUp) {
            this.fired = false;
        }
    };
    return Player;
}(Phaser.GameObjects.Sprite));
export { Player };
//# sourceMappingURL=player.js.map