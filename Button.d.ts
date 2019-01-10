/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
export declare enum OutlineMode {
    /**
     * The outline is backed in the buttons texture.
     * This looks excelent if the button's size matches the texture.
     * */
    Texture = 0,
    /**
     * The outline is created with the OutlineFilter.
     * Best to be used with small uniform textures (so scaling will not affect the texture).
     */
    Filter = 1,
}
export declare class Button extends PIXI.Sprite {
    private textureUp;
    PIXI: any;
    Texture: any;
    private textureHighlight;
    PIXI: any;
    Texture: any;
    private textureDown;
    PIXI: any;
    Texture: any;
    private _outlineMode;
    private _outlineColor;
    number: any;
    private _isHighlighted;
    private _isPressed;
    private _isDisabled;
    private _isClickStarted;
    private _text;
    PIXI: any;
    Text: any;
    private requestedWidth;
    private requestedHeight;
    constructor(texturePath: string, x?: number, y?: number, width?: number, height?: number);
    outlineMode: OutlineMode;
    outlineColor: number;
    disabled: boolean;
    isPressed: boolean;
    isHighlighted: boolean;
    text: PIXI.Text;
    onClick: boolean;
}
