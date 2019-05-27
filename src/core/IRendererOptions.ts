/**
 * Defines PIXI.RenderOptions
 */
export interface IRendererOptions {
    width?: number;
    height?: number;
    view?: HTMLCanvasElement;
    transparent?: boolean;
    autoDensity?: boolean;
    antialias?: boolean;
    preserveDrawingBuffer?: boolean;
    backgroundColor?: number;
    clearBeforeRender?: boolean;
    resolution?: number;
    forceCanvas?: boolean;
    forceFXAA?: boolean;
    powerPreference?: string;
}
