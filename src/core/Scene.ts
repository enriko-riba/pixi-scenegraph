﻿import { Color, ColorSource, Container, ContainerChild, IRenderLayer } from 'pixi.js';
import { IResizable } from './IResizable';
import { IUpdatable } from './IUpdatable';

/**
 *   Represents a scene instance.
 *   Only one scene at a time is rendered.
 */
export abstract class Scene extends Container implements IResizable, IUpdatable {
    public Name: string;

    private paused: boolean = false;
    private hud: Container | null = null;
    private backgroundColor: Color;
    private clearValue: boolean = true;

    /**
     *   Creates a new scene instance.
     *   @param name - the scene name.
     */
    constructor(name: string) {
        super();
        this.backgroundColor = new Color(0x0);
        this.Name = name;
    }

    /**
     * Fired every time the scene is to be activated.
     * @remarks If a new scene is activated, `currentScene.onDeactivate()` is fired first followed by `newScene.onActivate()`
     */
    public onActivate(): void {
        // tslint ignore
    }

    /**
     * Fired every time the scene is deactivated.
     * Note: this function has no implementation, override in derived class to add functionality.
     */
    public onDeactivate(): void {
        // tslint ignore
    }

    /**
     * Fired every time the window resizes, the scene is about to be activated (before `onActivate()`) and after a MasterHudOverlay is set.
     * Note: this function has no implementation, override in derived class to add functionality.
     * @remarks Note that this function is fired only for the current (active) scene!
     */
    public onResize(): void {
        // tslint ignore
    }

    /**
     * Fired on each animation frame.
     * Note: this function has no implementation, override in derived class to add functionality.
     * @param dt - elapsed time delta
     * @param timestamp - total time, useful for TWEEN.update and other libs depending on total time
     */
    public onUpdate(dt: number, timestamp: number): void {
        // tslint ignore
    }

    /**
     * Fired when the scene is destroyed.
     * Note: this function has no implementation, override in derived class to add functionality.
     */
    public onDestroy(): void {
        // tslint ignore
    }

    /**
     * Gets the scene background color.
     */
    public get BackGroundColor(): Color {
        return this.backgroundColor;
    }

    /**
     * Sets the scene background color.
     */
    public set BackGroundColor(color: ColorSource) {
        this.backgroundColor = new Color(color);
    }

    /**
     * Gets the scene hud overlay container.
     */
    public get HudOverlay(): Container | (Container & IUpdatable) | null {
        return this.hud;
    }

    /**
     * Sets the scene hud overlay container.
     */
    public set HudOverlay(hud: Container | (Container & IUpdatable) | null) {
        this.hud = hud;
    }

    /**
     * Invokes the action on every child display object, no matter how deep they are nested.
     */
    public enumerateChildren(action: (d: Container) => void): void {
        const container = this;
        Scene.enumerateChildren(container, action);
    }

    /**
     * Invokes the action on every child display object, no matter how deep they are nested.
     */
    public static enumerateChildren(container: Container, action: (d: Container) => void): void {
        for (let i = 0; i < container.children.length; i++) {
            let c = container.children[i] as Container;
            action(c);
            if (c.children && c.children.length > 0) {
                Scene.enumerateChildren(c, action);
            }
        }
    }

    /**
     * Adds one or more children to the container.
     * Multiple items can be added like: `myScene.addChild(childOne, childTwo, childThree)`
     * @param child PIXI.Container
     */
    public addChild<T extends (ContainerChild | IRenderLayer)[]>(...child: T): T[0] {
        const displayObject = super.addChild(...child);
        return displayObject;
    }

    /**
     * Adds a child object to the scene.
     * @param child PIXI.Container
     * @param index position in the display object list where the child is inserted
     */
    public addChildAt<T extends ContainerChild | IRenderLayer>(child: T, index: number): T {
        const displayObject = super.addChildAt(child, index);
        return displayObject as T;
    }

    /**
     * Pauses the scene. A paused scene is not rendered and its `onUpdate()` events are not fired.
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
