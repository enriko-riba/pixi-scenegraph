import { Scene } from './Scene';

/**
 * Defines a controller. Controllers are non renderable objects are invoked per frame.
 */
export interface IController {
    /**
     * The unique controller id.
     */
    readonly id: string;

    /**
     * A scene name, if present activates the controller only while the scene is active.
     * If no scope is defined the controller is active regardless of the active scene.
     */
    readonly scope: string | undefined;

    /**
     * Invoked once per frame, depending on scope.
     * @param dt - the ellapsed time in milliseconds
     * @param activeScene - the current scene
     */
    update(dt: number, activeScene: Scene | null): void;
}
