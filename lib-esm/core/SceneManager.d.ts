import * as PIXI from 'pixi.js';
import { IScreenSizeCalculator } from './IScreenSizeCalculator';
import { Scene } from './Scene';
import { IRendererOptions } from './IRendererOptions';
import { IController } from './IController';
export declare class SceneManager {
    private static logVersion;
    private masterContainer;
    private masterHudOverlay;
    private modalDialog;
    private currentScene;
    private lastScene;
    private scenes;
    private controllers;
    private app;
    private designWidth;
    private designHeight;
    private screenSizeCalculator;
    private startTime;
    private timeStamp;
    private animationFrameHandle;
    constructor(options: IRendererOptions, screenSizeCalculator?: IScreenSizeCalculator);
    get Renderer(): PIXI.Renderer;
    get Application(): PIXI.Application;
    AddController(controller: IController): void;
    RemoveController(controllerOrId: IController | string): void;
    get CurrentScene(): Scene;
    AddScene(scene: Scene): void;
    RemoveAllScenes(): void;
    RemoveScene(scene: Scene): void;
    HasScene(name: string): boolean;
    GetScene(name: string): Scene;
    ActivateScene(sceneOrName: Scene | string): void;
    ActivatePreviousScene(): void;
    get MasterHudOverlay(): PIXI.Container;
    set MasterHudOverlay(hud: PIXI.Container);
    ShowDialog(dialog: PIXI.Container): void;
    CloseDialog(): void;
    CaptureScene(): PIXI.RenderTexture;
    Destroy: () => void;
    onResize(screenSizeCalculator: IScreenSizeCalculator): void;
    private resizeHandler;
    private onRender;
}
