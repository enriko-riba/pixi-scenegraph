import * as PIXI from 'pixi.js';
export declare abstract class Scene extends PIXI.Container {
    Name: string;
    private paused;
    private hudScene;
    private backgroundColor;
    private clearValue;
    constructor(name: string);
    onActivate(): void;
    onDeactivate(): void;
    onResize(): void;
    onUpdate(dt: number, timestamp: number): void;
    onDestroy(): void;
    get BackGroundColor(): number;
    set BackGroundColor(color: number);
    get HudOverlay(): PIXI.Container | null;
    set HudOverlay(hud: PIXI.Container | null);
    addChild<T extends PIXI.DisplayObject[]>(...child: T): T[0];
    addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T;
    pause(): void;
    resume(): void;
    isPaused(): boolean;
    get clear(): boolean;
    set clear(clearFlag: boolean);
}
