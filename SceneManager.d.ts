/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
import { Scene } from "./Scene";
export declare enum State {
    GLOBAL = 0,
    MENU = 1,
    IN_GAME = 2,
    CUSTOM1 = 3,
    CUSTOM2 = 4,
    CUSTOM3 = 5,
    CUSTOM4 = 6,
    CUSTOM5 = 7,
}
/**
 *   Handles multiple scenes, scene activation, rendering and updates.
 */
export declare class SceneManager {
    private masterHudOverlay;
    PIXI: any;
    Container: any;
    /**
     * This object is only to support rendering masterHudOverlay together with the current scene!!!
     */
    private masterContainer;
    private currentScene;
    private lastScene;
    Scene: any;
    private scenes;
    private renderer;
    private designWidth;
    private designHeight;
    private sceneResizer;
    private startTime;
    number: any;
    private animationFrameHandle;
    /**
     *   Creates a new SceneManager instance.
     *
     *   @param width the width of the scene
     *   @param height the height of the scene
     *   @param resizer custom resize function
     */
    constructor(width: number, height: number, options?: PIXI.RendererOptions, resizer?: ISceneResizer);
    /**
     *   Returns the renderer instance.
     */
    readonly Renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    /**
     *   Returns the current scene instance.
     */
    readonly CurrentScene: Scene;
    /**
     *   Adds a scene.
     */
    AddScene(scene: Scene): void;
    /**
     *   Removes all scenes.
     */
    RemoveAllScenes(): void;
    /**
     *   Removes a scene.
     */
    RemoveScene(scene: Scene): void;
    /**
     * Returns true if the scene exists.
     * @param name
     */
    HasScene(name: string): boolean;
    /**
     * Returns the scene by its name.
     * @param name
     */
    GetScene(name: string): Scene;
    /**
     *   Activates the given scene.
     */
    ActivateScene(sceneOrName: Scene | string): void;
    ActivatePreviousScene(): void;
    /**
     * gets the master HUD overlay object.
     */
    /**
     * Sets the master HUD overlay object.
     */
    MasterHudOverlay: PIXI.Container;
    /**
     *  Renders the current scene in a rendertexture.
     */
    CaptureScene(): PIXI.RenderTexture;
    /**
     *   Cancels the animationFrame loop, removes all scenes and finally destroys the renderer.
     */
    Destroy: () => void;
    private resizeHandler;
    private render;
}
export declare class DefaultResizer implements ISceneResizer {
    protected designedWidth: number;
    protected designedHeight: number;
    constructor(designedWidth: number, designedHeight: number);
    GetAvailableSize(): ISize;
    GetAspectRatio(): number;
    CalculateSize(availableSize: ISize, aspect: number): ISize;
    CalculateScale(newSize: ISize): number;
}
export interface ISize {
    x: number;
    y: number;
}
/**
 *   Object passed to the SceneManager handling various aspects of scene resizing.
 */
export interface ISceneResizer {
    GetAvailableSize: () => ISize;
    GetAspectRatio: () => number;
    CalculateSize: (availableSize: ISize, aspect: number) => ISize;
    CalculateScale(newSize: ISize): number;
}
