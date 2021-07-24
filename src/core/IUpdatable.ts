/**
 * Supports onUpdate, fired on each animation frame.
 * @param dt - ellapsed time delta
 * @param timestamp - total time, usefull for TWEEN.update and other libs depending on total time
 */
export interface IUpdatable {
    onUpdate(dt: number, timestamp: number): void;
}
