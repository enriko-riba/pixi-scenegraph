var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as PIXI from 'pixi.js';
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene(name) {
        var _this = _super.call(this) || this;
        _this.paused = false;
        _this.hudScene = null;
        _this.clearValue = true;
        _this.backgroundColor = 0x0;
        _this.Name = name;
        return _this;
    }
    Scene.prototype.onActivate = function () {
    };
    Scene.prototype.onDeactivate = function () {
    };
    Scene.prototype.onResize = function () {
    };
    Scene.prototype.onUpdate = function (dt, timestamp) {
    };
    Scene.prototype.onDestroy = function () {
    };
    Object.defineProperty(Scene.prototype, "BackGroundColor", {
        get: function () {
            return this.backgroundColor;
        },
        set: function (color) {
            this.backgroundColor = color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "HudOverlay", {
        get: function () {
            return this.hudScene;
        },
        set: function (hud) {
            if (this.hudScene) {
                this.removeChild(this.hudScene);
            }
            this.hudScene = hud;
            if (this.hudScene) {
                var maxIndex = this.children.length;
                this.addChildAt(this.hudScene, maxIndex);
            }
        },
        enumerable: false,
        configurable: true
    });
    Scene.prototype.addChild = function () {
        var child = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            child[_i] = arguments[_i];
        }
        var dispObj = _super.prototype.addChild.apply(this, child);
        if (this.hudScene) {
            var maxIndex = this.children.length - 1;
            this.setChildIndex(this.hudScene, maxIndex);
        }
        return dispObj;
    };
    Scene.prototype.addChildAt = function (child, index) {
        var dispObj = _super.prototype.addChildAt.call(this, child, index);
        if (this.hudScene) {
            var maxIndex = this.children.length - 1;
            this.setChildIndex(this.hudScene, maxIndex);
        }
        return dispObj;
    };
    Scene.prototype.pause = function () {
        this.paused = true;
    };
    Scene.prototype.resume = function () {
        this.paused = false;
    };
    Scene.prototype.isPaused = function () {
        return this.paused;
    };
    Object.defineProperty(Scene.prototype, "clear", {
        get: function () {
            return this.clearValue;
        },
        set: function (clearFlag) {
            this.clearValue = clearFlag;
        },
        enumerable: false,
        configurable: true
    });
    return Scene;
}(PIXI.Container));
export { Scene };
//# sourceMappingURL=Scene.js.map