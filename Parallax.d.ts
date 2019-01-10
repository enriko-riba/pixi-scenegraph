/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
/**
 *   Represents a parallax background with textures that tile inside the viewport.
 */
export declare class Parallax extends PIXI.Container {
    private textureScale;
    private viewPortSize;
    PIXI: any;
    Point: any;
    private worldPosition;
    private parallaxFactor;
    private spriteBuffer;
    private spriteOrderList;
    /**
     * total width of all textures
     */
    private totalWidth;
    /**
     *   Creates a new ParalaxSprite instance.
     */
    constructor(size: PIXI.Point, parallaxFactor: number, textures: Array<string | PIXI.Texture>, textureScale?: number | undefined);
    readonly WorldPosition: number;
    SetViewPortX(newPositionX: number): void;
    ViewPortSize: PIXI.Point;
    ParallaxFactor: number;
    setTextures(textures: Array<string | PIXI.Texture>): void;
    private getTexture(textures, textureIndex);
    private recalculatePosition;
    private updatePositions(delta);
}
