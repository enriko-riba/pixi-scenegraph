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

  public onActivate(): void {}
  public onDeactivate(): void {}
  public onResize(): void {}
  public onUpdate(dt: number): void {}
  public onDestroy(options?: PIXI.DestroyOptions | boolean): void {}

  public get BackGroundColor(): number {
    return this.backgroundColor;
  }
  public set BackGroundColor(color: number) {
    this.backgroundColor = color;
  }

  public get HudOverlay(): PIXI.Container | null {
    return this.hudScene;
  }
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

  public pause(): void {
    this.paused = true;
  }
  public resume(): void {
    this.paused = false;
  }
  public isPaused(): boolean {
    return this.paused;
  }
  public get clear() {
    return this.clearValue;
  }

  public set clear(clearFlag: boolean) {
    this.clearValue = clearFlag;
  }
}
