import * as PIXI from 'pixi.js';
import { VERSION } from '../_version';
import { DefaultScreenSizeCalculator } from './DefaultScreenSizeCalculator';
var SceneManager = (function () {
    function SceneManager(options, screenSizeCalculator) {
        var _this = this;
        this.modalDialog = null;
        this.currentScene = null;
        this.scenes = [];
        this.controllers = [];
        this.animationFrameHandle = -1;
        this.Destroy = function () {
            cancelAnimationFrame(_this.animationFrameHandle);
            if (_this.currentScene) {
                _this.currentScene.pause();
            }
            _this.scenes.forEach(function (scene) {
                _this.RemoveScene(scene);
            });
            _this.app.destroy(true, {
                children: true,
                texture: true,
                baseTexture: true,
            });
        };
        this.resizeHandler = function () {
            _this.onResize(_this.screenSizeCalculator);
        };
        this.onRender = function () {
            if (!_this.startTime) {
                _this.startTime = Date.now();
            }
            _this.timeStamp = Date.now();
            var dt = _this.timeStamp - _this.startTime;
            if (dt > 50) {
                dt = 50;
            }
            _this.controllers.forEach(function (ctrl) {
                if (!ctrl.scope || (_this.currentScene && _this.currentScene.name === ctrl.scope)) {
                    ctrl.update(dt, _this.currentScene);
                }
            });
            if (!_this.currentScene || _this.currentScene.isPaused()) {
                return;
            }
            _this.currentScene.onUpdate(dt, _this.timeStamp);
            _this.startTime = _this.timeStamp;
        };
        SceneManager.logVersion();
        this.masterContainer = new PIXI.Container();
        this.app = new PIXI.Application(options);
        this.app.ticker.add(this.onRender, this);
        this.app.stage = this.masterContainer;
        console.info('pixi-scenegraph: renderer plugins: ', this.app.renderer.plugins);
        this.designWidth = options.width || window.innerWidth;
        this.designHeight = options.height || window.innerHeight;
        this.screenSizeCalculator = screenSizeCalculator || new DefaultScreenSizeCalculator(this.designWidth, this.designHeight);
        window.removeEventListener('resize', this.resizeHandler);
        window.addEventListener('resize', this.resizeHandler, true);
    }
    SceneManager.logVersion = function () {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var fmtPurp = 'color:#fa1;background:#ff66a5;padding:5px 0;';
            var fmtTxt = 'color:#fa1;background:#000;padding:5px 0;';
            var fmtHearts = 'color:#f55;background:#ffc3dc;padding:5px 0;';
            var args = [
                " %c  %c pixi-scenegraph: " + VERSION + " \u2730  %c  %c https://github.com/enriko-riba/pixi-scenegraph#readme \u2764\u2764\u2764\t",
                fmtPurp,
                fmtTxt,
                fmtPurp,
                fmtHearts,
            ];
            console.info.apply(console, args);
        }
        else if (window.console) {
            console.info("pixi-scenegraph: " + VERSION + " \u2730 https://github.com/enriko-riba/pixi-scenegraph#readme  \u2764\u2764\u2764");
        }
    };
    Object.defineProperty(SceneManager.prototype, "Renderer", {
        get: function () {
            return this.app.renderer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneManager.prototype, "Application", {
        get: function () {
            return this.app;
        },
        enumerable: false,
        configurable: true
    });
    SceneManager.prototype.AddController = function (controller) {
        this.controllers.push(controller);
    };
    SceneManager.prototype.RemoveController = function (controllerOrId) {
        var id = typeof controllerOrId !== 'string' ? controllerOrId.id : controllerOrId;
        this.controllers = this.controllers.filter(function (ctrl) { return ctrl.id !== id; });
    };
    Object.defineProperty(SceneManager.prototype, "CurrentScene", {
        get: function () {
            return this.currentScene;
        },
        enumerable: false,
        configurable: true
    });
    SceneManager.prototype.AddScene = function (scene) {
        this.scenes.push(scene);
    };
    SceneManager.prototype.RemoveAllScenes = function () {
        this.scenes.forEach(function (scene) {
            scene.onDestroy();
            scene.destroy({ children: true, texture: true, baseTexture: true });
        });
        this.scenes = [];
        this.currentScene = null;
    };
    SceneManager.prototype.RemoveScene = function (scene) {
        this.scenes = this.scenes.filter(function (item) {
            return item !== scene;
        });
        scene.onDestroy();
        scene.destroy({ children: true, texture: true, baseTexture: true });
    };
    SceneManager.prototype.HasScene = function (name) {
        var found = this.scenes.filter(function (item) { return item.Name === name; });
        return found && found.length > 0;
    };
    SceneManager.prototype.GetScene = function (name) {
        var found = this.scenes.filter(function (item) { return item.Name === name; });
        if (!found || found.length === 0) {
            throw Error("Scene: '" + name + "' not found");
        }
        if (found.length > 1) {
            throw Error("Multiple scenes: '" + name + "' found");
        }
        return found[0];
    };
    SceneManager.prototype.ActivateScene = function (sceneOrName) {
        var scene;
        if (typeof sceneOrName === 'string') {
            var found = this.scenes.filter(function (item) { return item.Name === sceneOrName; });
            if (!found || found.length === 0) {
                throw Error("Scene: '" + sceneOrName + "' not found");
            }
            if (found.length > 1) {
                throw Error("Multiple scenes: '" + sceneOrName + "' found");
            }
            scene = found[0];
        }
        else {
            scene = sceneOrName;
        }
        if (this.currentScene && this.currentScene !== scene) {
            console.log('DeactivateScene ' + this.currentScene.Name);
            this.currentScene.onDeactivate();
        }
        console.log('ActivateScene ' + scene.Name);
        this.startTime = 0;
        this.lastScene = (this.currentScene !== scene ? this.currentScene : this.lastScene);
        this.currentScene = scene;
        this.app.renderer.backgroundColor = scene.BackGroundColor;
        this.resizeHandler();
        scene.onActivate();
        this.masterContainer.removeChildren();
        this.masterContainer.addChild(this.currentScene);
        if (this.masterHudOverlay) {
            this.masterContainer.addChild(this.masterHudOverlay);
        }
        PIXI.settings.RESOLUTION = window.devicePixelRatio;
    };
    SceneManager.prototype.ActivatePreviousScene = function () {
        this.ActivateScene(this.lastScene);
    };
    Object.defineProperty(SceneManager.prototype, "MasterHudOverlay", {
        get: function () {
            return this.masterHudOverlay;
        },
        set: function (hud) {
            this.masterHudOverlay = hud;
            if (!!hud) {
                this.masterContainer.removeChildren();
                this.masterContainer.addChild(this.currentScene);
                if (this.masterHudOverlay) {
                    this.masterContainer.addChild(this.masterHudOverlay);
                }
                this.resizeHandler();
            }
        },
        enumerable: false,
        configurable: true
    });
    SceneManager.prototype.ShowDialog = function (dialog) {
        if (this.modalDialog) {
            this.masterContainer.removeChild(this.modalDialog);
        }
        if (dialog) {
            this.modalDialog = dialog;
            this.masterContainer.addChild(this.modalDialog);
            this.resizeHandler();
        }
    };
    SceneManager.prototype.CloseDialog = function () {
        if (this.modalDialog) {
            this.masterContainer.removeChild(this.modalDialog);
            this.modalDialog = null;
        }
    };
    SceneManager.prototype.CaptureScene = function () {
        console.log("Capturing scene, width: " + this.app.renderer.width + ", height: " + this.app.renderer.height);
        var renderTexture = PIXI.RenderTexture.create({ width: this.app.renderer.width, height: this.app.renderer.height });
        this.app.renderer.render(this.currentScene, renderTexture);
        return renderTexture;
    };
    SceneManager.prototype.onResize = function (screenSizeCalculator) {
        var avlSize = screenSizeCalculator.GetAvailableSize();
        var aspect = screenSizeCalculator.GetAspectRatio();
        var size = screenSizeCalculator.CalculateSize(avlSize, aspect);
        this.app.renderer.resize(size.x, size.y);
        var scale = screenSizeCalculator.CalculateScale(size);
        this.masterContainer.scale.set(scale.x, scale.y);
    };
    return SceneManager;
}());
export { SceneManager };
//# sourceMappingURL=SceneManager.js.map