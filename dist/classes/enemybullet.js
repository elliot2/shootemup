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
var EnemyBullet = /** @class */ (function (_super) {
    __extends(EnemyBullet, _super);
    function EnemyBullet(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "bullet") || this;
        // Set the bullet's movement speed
        _this.speed = 100;
        // Rotate sprite
        _this.angle = 180;
        _this.name = "enemyBullet";
        // Add the bullet's sprite to the game world
        _this.scene.add.existing(_this);
        return _this;
    }
    EnemyBullet.prototype.preUpdate = function (time, delta) {
        // Move the bullet up or down based on its direction
        this.y += this.speed * (delta * 0.01);
        // Destroy the bullet if it goes off the screen
        if (this.y < -this.getBounds().height ||
            this.y > this.scene.game.canvas.height) {
            this.destroy();
        }
    };
    return EnemyBullet;
}(Phaser.GameObjects.Sprite));
export { EnemyBullet };
//# sourceMappingURL=enemybullet.js.map