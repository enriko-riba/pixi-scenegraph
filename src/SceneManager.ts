import * as PIXI from 'pixi.js';
import { Scene } from './Scene';
export enum State {
  GLOBAL,
  MENU,
  IN_GAME,
  CUSTOM1,
  CUSTOM2,
  CUSTOM3,
  CUSTOM4,
  CUSTOM5,
}

// declare var stats: Stats;

/**
 *   Handles multiple scenes, scene activation, rendering and updates.
 */
export class SceneManager {
  private masterHudOverlay: PIXI.Container;

  /**
   * This object is only to support rendering masterHudOverlay together with the current scene!!!
   */
  private masterContainer: PIXI.Container;

  private currentScene: Scene | null = null;
  private lastScene: Scene;
  private scenes: Scene[] = [];
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

  private designWidth: number;
  private designHeight: number;
  private sceneResizer: ISceneResizer;

  private startTime: number;
  private animationFrameHandle: number = -1;

  /**
   *   Creates a new SceneManager instance.
   *
   *   @param width the width of the scene
   *   @param height the height of the scene
   *   @param resizer custom resize function
   */
  constructor(width: number, height: number, options?: PIXI.RendererOptions, resizer?: ISceneResizer) {
    this.designWidth = width;
    this.designHeight = height;
    this.sceneResizer = resizer || new DefaultResizer(this.designWidth, this.designHeight);
    this.masterContainer = new PIXI.Container();

    if (!options) {
      options = { antialias: false, roundPixels: true, backgroundColor: 0x012135, transparent: true };
    }
    this.renderer = PIXI.autoDetectRenderer(width, height, options);
    this.renderer.autoResize = true;

    //  textureGC is only used for web GL renderer
    if ((this.render as any).textureGC) {
      (this.render as any).textureGC.mode = PIXI.GC_MODES.AUTO;
    }

    window.removeEventListener('resize', this.resizeHandler);
    window.addEventListener('resize', this.resizeHandler, true);

    /*
        stats.showPanel(0); // 0 – use the FPS mode, 1 – use the milliseconds mode

        // Position the meter in the top-left corner
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "";
        stats.domElement.style.right = "20px";
        stats.domElement.style.bottom = "20px";
        stats.domElement.style.top = ""; 

        // Append the meter to the body of your HTML5 document.
        document.body.appendChild(stats.domElement);
        */

    this.render(0);
  }

  /**
   *   Returns the renderer instance.
   */
  public get Renderer(): PIXI.WebGLRenderer | PIXI.CanvasRenderer {
    return this.renderer;
  }

  /**
   *   Returns the current scene instance.
   */
  public get CurrentScene(): Scene {
    return this.currentScene as Scene;
  }

  /**
   *   Adds a scene.
   */
  public AddScene(scene: Scene): void {
    this.scenes.push(scene);
    scene.sceneManager = this;
  }

  /**
   *   Removes all scenes.
   */
  public RemoveAllScenes(): void {
    this.scenes.forEach((scene: Scene) => {
      (scene.sceneManager as any) = undefined;
      scene.onDestroy(true);
    });
    this.scenes = [];
    this.currentScene = null;
  }

  /**
   *   Removes a scene.
   */
  public RemoveScene(scene: Scene): void {
    this.scenes = this.scenes.filter((item: Scene, index: number, arr) => {
      return item !== scene;
    });
    (scene.sceneManager as any) = undefined;
  }

  /**
   * Returns true if the scene exists.
   * @param name
   */
  public HasScene(name: string): boolean {
    const found = this.scenes.filter((item: Scene) => item.Name === name);
    return found && found.length > 0;
  }

  /**
   * Returns the scene by its name.
   * @param name
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
   *   Activates the given scene.
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

    if (this.currentScene /*&& this.currentScene.onDeactivate*/ && this.currentScene !== scene) {
      console.log('DeactivateScene ' + this.currentScene.Name);
      this.currentScene.onDeactivate();
    }

    console.log('ActivateScene ' + scene.Name);
    this.startTime = 0;
    this.lastScene = (this.currentScene !== scene ? this.currentScene : this.lastScene) as Scene;
    this.currentScene = scene;
    this.renderer.backgroundColor = scene.BackGroundColor;
    this.resizeHandler();

    scene.onActivate();

    this.masterContainer.removeChildren();
    this.masterContainer.addChild(this.currentScene);
    if (this.masterHudOverlay) {
      this.masterContainer.addChild(this.masterHudOverlay);
    }

    PIXI.settings.RESOLUTION = window.devicePixelRatio;
  }

  public ActivatePreviousScene() {
    this.ActivateScene(this.lastScene);
  }

  /**
   * gets the master HUD overlay object.
   */
  public get MasterHudOverlay() {
    return this.masterHudOverlay;
  }
  /**
   * Sets the master HUD overlay object.
   */
  public set MasterHudOverlay(hud: PIXI.Container) {
    this.masterHudOverlay = hud;
    this.masterContainer.removeChildren();
    this.masterContainer.addChild(this.currentScene as Scene);
    if (this.masterHudOverlay) {
      this.masterContainer.addChild(this.masterHudOverlay);
    }
    this.resizeHandler();
  }

  /**
   *  Renders the current scene in a rendertexture.
   */
  public CaptureScene(): PIXI.RenderTexture {
    console.log(`Capturing scene, width: ${this.renderer.width}, height: ${this.renderer.height}`);
    const renderTexture = PIXI.RenderTexture.create(this.renderer.width, this.renderer.height);
    this.renderer.render(this.currentScene as Scene, renderTexture);
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
    this.renderer.destroy(true);
  };

  private resizeHandler = () => {
    const avlSize = this.sceneResizer.GetAvailableSize();
    const aspect = this.sceneResizer.GetAspectRatio();
    const size = this.sceneResizer.CalculateSize(avlSize, aspect);
    this.renderer.resize(size.x, size.y);

    if (this.currentScene) {
      this.currentScene.scale.set(this.sceneResizer.CalculateScale(size));
      this.currentScene.onResize();
    }

    if (this.masterHudOverlay) {
      this.masterHudOverlay.scale.set(this.sceneResizer.CalculateScale(size));
    }
  };

  private render = (timestamp: number) => {
    // stats.begin();

    this.animationFrameHandle = requestAnimationFrame(this.render);

    //  for tween support
    // TWEEN.update(timestamp);

    //  exit if no scene or paused
    if (!this.currentScene || this.currentScene.isPaused()) {
      return;
    }

    if (!this.startTime) {
      this.startTime = timestamp;
    }

    let dt = timestamp - this.startTime!;
    if (dt > 50) {
      dt = 50;
    }
    this.currentScene.onUpdate(dt);

    this.startTime = timestamp;
    this.renderer.render(this.masterContainer, undefined, this.currentScene.clear);

    // stats.end();
  };
}

export class DefaultResizer implements ISceneResizer {
  constructor(protected designedWidth: number, protected designedHeight: number) {}
  public GetAvailableSize(): ISize {
    return { x: window.innerWidth, y: window.innerHeight };
  }
  public GetAspectRatio(): number {
    return this.designedWidth / this.designedHeight;
  }
  public CalculateSize(availableSize: ISize, aspect: number): ISize {
    const maxWidth = Math.floor(aspect * availableSize.y);
    const maxHeight = Math.floor(window.innerHeight);
    return { x: Math.min(maxWidth, availableSize.x), y: Math.min(maxHeight, availableSize.y) };
  }
  public CalculateScale(newSize: ISize): number {
    return newSize.x / this.designedWidth;
  }
}

export interface ISize {
  x: number;
  y: number;
}

/**
 *   Object passed to the SceneManager handling various aspects of scene resizing.
 */
export interface ISceneResizer {
  /*
   *   Returns the available width.
   */
  GetAvailableSize: () => ISize;

  /*
   *   Returns the desired aspect ratio for the stage.
   */
  GetAspectRatio: () => number;

  CalculateSize: (availableSize: ISize, aspect: number) => ISize;

  CalculateScale(newSize: ISize): number;
}
