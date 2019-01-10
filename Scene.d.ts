/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
import { SceneManager } from "./SceneManager";
/**
 *   Represents a scene.
 *   Only one scene at a time is rendered.
 */
export declare abstract class Scene extends PIXI.Container {
    private paused;
    private hudScene;
    private backgroundColor;
    sceneManager: SceneManager;
    onActivate(): void;
    onDeactivate(): void;
    onResize(): void;
    onUpdate(dt: number): void;
    onDestroy(options?: PIXI.DestroyOptions | boolean): void;
    /**
     *   Creates a new scene instance.
     *   @param name the scene name.
     */
    constructor(scm: SceneManager, name: string);
    Name: string;
    BackGroundColor: number;
    HudOverlay: PIXI.Container | null;
    addChild<T extends PIXI.DisplayObject>(child: T): T;
    addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T;
    pause(): void;
    resume(): void;
    isPaused(): boolean;
    private _clear;
    clear: boolean;
}
