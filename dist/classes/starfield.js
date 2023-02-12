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
var Starfield = /** @class */ (function (_super) {
    __extends(Starfield, _super);
    function Starfield(scene, x, y, speed) {
        var _this = _super.call(this, scene, x, y, "starfield") || this;
        _this.speed = speed;
        _this.setOrigin(0, 0);
        // add the sprite to the scene and make it display in the background
        scene.add.existing(_this).setDepth(-1);
        return _this;
    }
    Starfield.prototype.preUpdate = function (time, delta) {
        // update the sprite position along the y-axis based on its speed
        this.y += this.speed * (delta * 0.01);
        // if the sprite goes off the screen, reset its position to the top
        if (this.y > this.scene.game.canvas.height) {
            this.y = -this.scene.game.canvas.height;
        }
    };
    return Starfield;
}(Phaser.GameObjects.Sprite));
export { Starfield };
//# sourceMappingURL=starfield.js.map