import * as PIXI from 'pixi.js';
import { SceneManager } from './SceneManager';

/**
 *   Represents a scene instance.
 *   Only one scene at a time is rendered.
 */
export abstract class Scene extends PIXI.Container {
  public sceneManager: SceneManager;
  public Name: string;

  private paused: boolean = false;
  private hudScene: PIXI.Container | null = null;
  private backgroundColor: number;
  private clearValue: boolean = true;

  /**
   *   Creates a new scene instance.
   *   @param name the scene name.
   */
  constructor(scm: SceneManager, name: string) {
    super();
    this.sceneManager = scm;
    this.backgroundColor = 0x0;
    this.Name = name;
  }

  /**
   * Fired every time the scene is to be activated.
   * @remarks If a new scene is activated, `currentScene.onDeactivate()` is fired first followed by `newScene.onActivate()`
   */
  public onActivate(): void { }

  /**
   * Fired every time the scene is deactivated.
   */
  public onDeactivate(): void { }

  /**
   * Fired every time the window resizes, the scene is about to be activated (before `onActivate`) and after a MasterHudOverlay is set.
   * @remarks Note that this function is fired only for the current (active) scene! 
   */
  public onResize(): void { }

  /**
   * Fired on each animation frame
   * @param dt - ellapsed time delta
   * @param timestamp - total time, usefull for TWEEN.update and other libs depending on total time
   */
  public onUpdate(dt: number, timestamp: number): void { }

  public onDestroy(options?: PIXI.DestroyOptions | boolean): void { }

  /**
   * Gets the scene background color.
   */
  public get BackGroundColor(): number {
    return this.backgroundColor;
  }
  /**
   * Sets the scene background color.
   */
  public set BackGroundColor(color: number) {
    this.backgroundColor = color;
  }

  /**
   * Gets the scene hud overlay container.
   */
  public get HudOverlay(): PIXI.Container | null {
    return this.hudScene;
  }
  /**
   * Sets the scene hud overlay container.
   */
  public set HudOverlay(hud: PIXI.Container | null) {
    if (this.hudScene) {
      this.removeChild(this.hudScene);
    }
    this.hudScene = hud;

    if (this.hudScene) {
      const maxIndex = this.children.length;
      this.addChildAt(this.hudScene, maxIndex);
    }
  }

  /**
   * Adds a child object to the scene.
   * @param child PIXI.DisplayObject
   */
  public addChild<T extends PIXI.DisplayObject>(child: T): T {
    const dispObj = super.addChild(child);
    if (this.hudScene) {
      const maxIndex = this.children.length - 1;
      this.setChildIndex(this.hudScene, maxIndex);
    }
    return dispObj;
  }

  /**
   * Adds a child object to the scene.
   * @param child PIXI.DisplayObject 
   * @param index position in the display object list where the child is inserted 
   */
  public addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T {
    const dispObj = super.addChildAt(child, index);
    if (this.hudScene) {
      const maxIndex = this.children.length - 1;
      this.setChildIndex(this.hudScene, maxIndex);
    }
    return dispObj;
  }

  /**
   * Pauses the scene. A paused scene is not rendered and its onUpdate events are not fired.
   */
  public pause(): void {
    this.paused = true;
  }
  /**
   * Resumes the scene.
   */
  public resume(): void {
    this.paused = false;
  }
  /**
   * Returns true if the scene is paused.
   */
  public isPaused(): boolean {
    return this.paused;
  }
  /**
   * Gets the clear flag used by the PIXI renderer.
   */
  public get clear() {
    return this.clearValue;
  }
  
  /**
   * Sets the clear flag used by the PIXI renderer.
   */
  public set clear(clearFlag: boolean) {
    this.clearValue = clearFlag;
  }
}
