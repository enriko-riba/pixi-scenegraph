import * as PIXI from 'pixi.js';
import { VERSION } from '../_version';
import { IScreenSizeCalculator } from './IScreenSizeCalculator';
import { DefaultScreenSizeCalculator } from './DefaultScreenSizeCalculator';
import { Scene } from './Scene';
import { IRendererOptions } from './IRendererOptions';
import { IController } from './IController';

/**
 *   Handles multiple scenes, scene activation, rendering and updates.
 */
export class SceneManager {
    private static logVersion() {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            const fmtPurp = 'color:#fa1;background:#ff66a5;padding:5px 0;';
            const fmtTxt = 'color:#fa1;background:#000;padding:5px 0;';
            const fmtHearts = 'color:#f55;background:#ffc3dc;padding:5px 0;';
            const args = [
                ` %c  %c pixi-scenegraph: ${VERSION} ✰  %c  %c https://github.com/enriko-riba/pixi-scenegraph#readme ❤❤❤\t`,
                fmtPurp,
                fmtTxt,
                fmtPurp,
                fmtHearts,
            ];
            console.info.apply(console, args);
        } else if (window.console) {
            console.info(`pixi-scenegraph: ${VERSION} ✰ https://github.com/enriko-riba/pixi-scenegraph#readme  ❤❤❤`);
        }
    }

    /**
     * This object is only to support rendering masterHudOverlay together with the current scene!
     */
    private masterContainer: PIXI.Container;

    private masterHudOverlay: PIXI.Container;
    private currentScene: Scene | null = null;
    private lastScene: Scene;
    private scenes: Scene[] = [];
    private controllers: IController[] = [];
    private app: PIXI.Application;

    private designWidth: number;
    private designHeight: number;
    private screenSizeCalculator: IScreenSizeCalculator;

    private startTime: number;
    private timeStamp: number;
    private animationFrameHandle: number = -1;

    /**
     * Creates a new SceneManager instance.
     *
     * @param options - the PIXI RendererOptions
     * @param screenSizeCalculator - custom screen size calculator implementation, if undefined the default is used
     * @remarks The DefaultScreenSizeCalculator returns screen dimensions that horizontaly fit in available screen
     * space but preserve the aspect ratio of the given width and height values.
     */
    constructor(options: IRendererOptions, screenSizeCalculator?: IScreenSizeCalculator) {
        SceneManager.logVersion();

        this.masterContainer = new PIXI.Container();

        this.app = new PIXI.Application(options);
        this.app.ticker.add(this.onRender, this);
        this.app.stage = this.masterContainer;

        this.designWidth = options.width || window.innerWidth;
        this.designHeight = options.height || window.innerHeight;
        this.screenSizeCalculator = screenSizeCalculator || new DefaultScreenSizeCalculator(this.designWidth, this.designHeight);

        window.removeEventListener('resize', this.resizeHandler);
        window.addEventListener('resize', this.resizeHandler, true);
    }

    /**
     *   Returns the PIXI.Renderer instance.
     */
    public get Renderer(): PIXI.Renderer {
        return this.app.renderer;
    }

    /**
     *   Returns the PIXI.Application instance.
     */
    public get Application(): PIXI.Application {
        return this.app;
    }

    /**
     * Adds a controller.
     * @param controller - the controller instance
     */
    public AddController(controller: IController) {
        this.controllers.push(controller);
    }

    /**
     * Removes a controller.
     * @param controllerOrId - the controller name or instance to be removed.
     */
    public RemoveController(controllerOrId: IController | string) {
        const id = typeof controllerOrId !== 'string' ? controllerOrId.id : controllerOrId;
        this.controllers = this.controllers.filter(ctrl => ctrl.id !== id);
    }

    /**
     *   Returns the current scene instance.
     */
    public get CurrentScene(): Scene {
        return this.currentScene as Scene;
    }

    /**
     *   Adds a scene to the graph.
     */
    public AddScene(scene: Scene): void {
        this.scenes.push(scene);
    }

    /**
     *   Removes all scenes from the graph.
     */
    public RemoveAllScenes(): void {
        this.scenes.forEach((scene: Scene) => {
            scene.onDestroy();
            scene.destroy({ children: true, texture: true, baseTexture: true });
        });
        this.scenes = [];
        this.currentScene = null;
    }

    /**
     *   Removes a scene from the graph.
     */
    public RemoveScene(scene: Scene): void {
        this.scenes = this.scenes.filter((item: Scene, index: number, arr) => {
            return item !== scene;
        });
        scene.onDestroy();
        scene.destroy({ children: true, texture: true, baseTexture: true });
    }

    /**
     * Returns true if the named scene exists.
     * @param name - the scene name
     */
    public HasScene(name: string): boolean {
        const found = this.scenes.filter((item: Scene) => item.Name === name);
        return found && found.length > 0;
    }

    /**
     * Returns the scene by its name.
     * @param name - the scene name
     */
    public GetScene(name: string): Scene {
        const found = this.scenes.filter((item: Scene) => item.Name === name);
        if (!found || found.length === 0) {
            throw Error("Scene: '" + name + "' not found");
        }
        if (found.length > 1) {
            throw Error("Multiple scenes: '" + name + "' found");
        }
        return found[0];
    }

    /**
     * Activates a scene.
     * @param sceneOrName - the scene instance or scene name
     */
    public ActivateScene(sceneOrName: Scene | string): void {
        let scene: Scene;
        if (typeof sceneOrName === 'string') {
            const found = this.scenes.filter((item: Scene) => item.Name === sceneOrName);
            if (!found || found.length === 0) {
                throw Error("Scene: '" + sceneOrName + "' not found");
            }
            if (found.length > 1) {
                throw Error("Multiple scenes: '" + sceneOrName + "' found");
            }
            scene = found[0];
        } else {
            scene = sceneOrName as Scene;
        }

        if (this.currentScene && this.currentScene !== scene) {
            console.log('DeactivateScene ' + this.currentScene.Name);
            this.currentScene.onDeactivate();
        }

        console.log('ActivateScene ' + scene.Name);
        this.startTime = 0;
        this.lastScene = (this.currentScene !== scene ? this.currentScene : this.lastScene) as Scene;
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
    }

    /**
     * Activates the previous scene.
     */
    public ActivatePreviousScene() {
        this.ActivateScene(this.lastScene);
    }

    /**
     * Gets the master HUD overlay container.
     */
    public get MasterHudOverlay() {
        return this.masterHudOverlay;
    }

    /**
     * Sets the master HUD overlay container.
     */
    public set MasterHudOverlay(hud: PIXI.Container) {
        this.masterHudOverlay = hud;
        if (!!hud) {
            this.masterContainer.removeChildren();
            this.masterContainer.addChild(this.currentScene as Scene);
            if (this.masterHudOverlay) {
                this.masterContainer.addChild(this.masterHudOverlay);
            }
            this.resizeHandler();
        }
    }

    /**
     * Renders the current scene in a rendertexture.
     */
    public CaptureScene(): PIXI.RenderTexture {
        console.log(`Capturing scene, width: ${this.app.renderer.width}, height: ${this.app.renderer.height}`);
        const renderTexture = PIXI.RenderTexture.create({ width: this.app.renderer.width, height: this.app.renderer.height });
        this.app.renderer.render(this.currentScene as Scene, renderTexture);
        return renderTexture;
    }

    /**
     *   Cancels the animationFrame loop, removes all scenes and finally destroys the renderer.
     */
    public Destroy = () => {
        cancelAnimationFrame(this.animationFrameHandle);
        if (this.currentScene) {
            this.currentScene.pause();
        }
        this.scenes.forEach((scene: Scene) => {
            this.RemoveScene(scene);
        });
        this.app.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true,
        });
    };

    /**
     * Resize handler, invoked on screen size change. Override to change default implementation.
     */
    public onResize(screenSizeCalculator: IScreenSizeCalculator) {
        const avlSize = this.screenSizeCalculator.GetAvailableSize();
        const aspect = this.screenSizeCalculator.GetAspectRatio();
        const size = this.screenSizeCalculator.CalculateSize(avlSize, aspect);
        this.app.renderer.resize(size.x, size.y);

        const scale = this.screenSizeCalculator.CalculateScale(size);

        if (this.currentScene) {
            this.currentScene.scale.set(scale.x, scale.y);
            this.currentScene.onResize();
        }

        if (this.masterHudOverlay) {
            this.masterHudOverlay.scale.set(scale.x, scale.y);
        }
    }

    /**
     * DOM event handler, invokes onResize to allow overriding resize logic.
     */
    private resizeHandler = () => {
        this.onResize(this.screenSizeCalculator);
    };

    private onRender = (time: number) => {
        if (!this.startTime) {
            this.startTime = Date.now();
        }

        this.timeStamp = Date.now();
        let dt = this.timeStamp - this.startTime;
        if (dt > 50) {
            dt = 50;
        }

        this.controllers.forEach(ctrl => {
            if (!ctrl.scope || (this.currentScene && this.currentScene.name === ctrl.scope)) {
                ctrl.update(dt, this.currentScene);
            }
        });

        //  exit if no scene or paused
        if (!this.currentScene || this.currentScene.isPaused()) {
            return;
        }

        this.currentScene.onUpdate(dt, this.timeStamp);
        this.startTime = this.timeStamp;
    };
}
