import { Scene } from './Scene';

/**
 * Defines a controller. Controllers are non renderable objects whos update() method is invoked once per frame.
 * A controller can run either for all scopes or in the scope of a scene. If scope is defined, the Controller.update() is invoked only if the ActiveScene.Name matches the scope.
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
