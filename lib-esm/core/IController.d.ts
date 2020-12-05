import { Scene } from './Scene';
export interface IController {
    readonly id: string;
    readonly scope: string | undefined;
    update(dt: number, activeScene: Scene | null): void;
}
