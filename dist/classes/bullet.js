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
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "bullet") || this;
        _this.scene = scene;
        // Set the bullet's movement speed
        _this.speed = 100;
        _this.name = "bullet";
        // Add the bullet's sprite to the game world
        _this.scene.add.existing(_this);
        return _this;
    }
    Bullet.prototype.preUpdate = function (time, delta) {
        // Move the bullet up or down based on its direction
        this.y -= this.speed * (delta * 0.01);
        // Destroy the bullet if it goes off the screen
        if (this.y < -this.getBounds().height ||
            this.y > this.scene.game.canvas.height) {
            this.destroy();
        }
    };
    return Bullet;
}(Phaser.GameObjects.Sprite));
export { Bullet };
//# sourceMappingURL=bullet.js.map