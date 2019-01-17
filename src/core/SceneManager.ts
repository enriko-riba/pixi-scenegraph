import * as PIXI from 'pixi.js';
import { IScreenSizeCalculator, DefaultScreenSizeCalculator, Scene } from '..';

/**
 *   Handles multiple scenes, scene activation, rendering and updates.
 */
export class SceneManager {
  /**
   * This object is only to support rendering masterHudOverlay together with the current scene!
   */
  private masterContainer: PIXI.Container;

  private masterHudOverlay: PIXI.Container;
  private currentScene: Scene | null = null;
  private lastScene: Scene;
  private scenes: Scene[] = [];
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

  private designWidth: number;
  private designHeight: number;
  private screenSizeCalculator: IScreenSizeCalculator;

  private startTime: number;
  private animationFrameHandle: number = -1;

  /**
   * Creates a new SceneManager instance.
   *
   * @param width - the width of the scene
   * @param height - the height of the scene
   * @param screenSizeCalculator - custom screen size calculator implementation, if undefined the default is used
   * @remarks The DefaultScreenSizeCalculator returns screen dimensions that horizontaly fit in the real screen and preserve the aspect ratio of the given width and height values.
   */
  constructor(
    width: number,
    height: number,
    options?: PIXI.RendererOptions,
    screenSizeCalculator?: IScreenSizeCalculator,
  ) {
    this.designWidth = width;
    this.designHeight = height;
    this.screenSizeCalculator =
      screenSizeCalculator || new DefaultScreenSizeCalculator(this.designWidth, this.designHeight);
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
   *   Adds a scene to the graph.
   */
  public AddScene(scene: Scene): void {
    this.scenes.push(scene);
    scene.sceneManager = this;
  }

  /**
   *   Removes all scenes from the graph.
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
   *   Removes a scene from the graph.
   */
  public RemoveScene(scene: Scene): void {
    this.scenes = this.scenes.filter((item: Scene, index: number, arr) => {
      return item !== scene;
    });
    (scene.sceneManager as any) = undefined;
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
    const avlSize = this.screenSizeCalculator.GetAvailableSize();
    const aspect = this.screenSizeCalculator.GetAspectRatio();
    const size = this.screenSizeCalculator.CalculateSize(avlSize, aspect);
    this.renderer.resize(size.x, size.y);

    const scale = this.screenSizeCalculator.CalculateScale(size);

    if (this.currentScene) {
      this.currentScene.scale.set(scale.x, scale.y);
      this.currentScene.onResize();
    }

    if (this.masterHudOverlay) {
      this.masterHudOverlay.scale.set(scale.x, scale.y);
    }
  };

  private render = (timestamp: number) => {
    this.animationFrameHandle = requestAnimationFrame(this.render);

    //  exit if no scene or paused
    if (!this.currentScene || this.currentScene.isPaused()) {
      return;
    }

    if (!this.startTime) {
      this.startTime = timestamp;
    }

    let dt = timestamp - this.startTime;
    if (dt > 50) {
      dt = 50;
    }
    this.currentScene.onUpdate(dt, timestamp);

    this.startTime = timestamp;
    this.renderer.render(this.masterContainer, undefined, this.currentScene.clear);
  };
}
