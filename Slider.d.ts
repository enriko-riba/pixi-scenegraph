/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
export declare class Slider extends PIXI.Container {
    private textureHandle;
    PIXI: any;
    Texture: any;
    private textureControl;
    PIXI: any;
    Texture: any;
    private frameUpControl;
    PIXI: any;
    Rectangle: any;
    private frameHighlightControl;
    PIXI: any;
    Rectangle: any;
    private frameDownControl;
    PIXI: any;
    Rectangle: any;
    private frameUpHandle;
    PIXI: any;
    Rectangle: any;
    private frameHighlightHandle;
    PIXI: any;
    Rectangle: any;
    private frameDownHandle;
    PIXI: any;
    Rectangle: any;
    private isPressed;
    private text;
    PIXI: any;
    Text: any;
    private requestedWidth;
    private requestedHeight;
    private control;
    private handle;
    private handleWidth;
    private value;
    private maxX;
    number: any;
    private minX;
    number: any;
    private _outlineColor;
    number: any;
    /**
     *
     * @param textureAtlas slider texture, two columns (outline, handle) and three rows (normal, highlight, pressed).
     * @param sliderFrameWidth width of the second column holding the slider handle
     * @param x
     * @param y
     * @param width
     * @param height
     */
    constructor(textureAtlas: string, sliderFrameWidth: number, x: number | undefined, y: number | undefined, width: number, height: number);
    Value: number;
    outlineColor: number;
    IsPressed: boolean;
    Text: PIXI.Text;
    onClick: (e: PIXI.interaction.InteractionEvent) => boolean;
    private dragOffsetX;
    private isDragging;
    private getCalculatedValue();
    private onDragStart;
    private onDragEnd;
    private onDragMove;
    private setSliderFromeEvent(e);
    private precise_round(num, decimals);
    private onButtonDown;
    private onButtonUp;
    private onButtonUpOutside;
    private onButtonOver;
    private onButtonOut;
    private applyTextureFrames();
    SetTexture(textureName: string, handleWidth: number): void;
}
