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
import { GameManager } from "./gamemanager";
var game = null;
var config = {
    width: 1280,
    height: 720,
    backgroundColor: "#000000",
    type: Phaser.AUTO,
    parent: "game",
    scene: [GameManager],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: Phaser.Scale.Orientation.LANDSCAPE,
    },
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true,
    },
    debug: {
        marker: true,
        add: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: {
                y: 0,
            },
        },
    },
};
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game(config) {
        return _super.call(this, config) || this;
    }
    return Game;
}(Phaser.Game));
export { Game };
window.addEventListener("load", function () {
    game = new Game(config);
});
//# sourceMappingURL=index.js.map