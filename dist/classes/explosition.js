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
var Explosion = /** @class */ (function (_super) {
    __extends(Explosion, _super);
    function Explosion(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "explosion") || this;
        _this.explosionSound = _this.scene.game.sound.add("explosion-sound");
        _this.scale = 1.5;
        _this.scene.add.existing(_this);
        _this.play("explosion");
        _this.explosionSound.play();
        return _this;
    }
    return Explosion;
}(Phaser.GameObjects.Sprite));
export { Explosion };
//# sourceMappingURL=explosition.js.map