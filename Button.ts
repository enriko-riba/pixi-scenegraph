import * as PIXI from 'pixi.js';
import { OutlineFilter } from '@pixi/filter-outline';
import { TextureLoader } from '.';

export enum OutlineMode {
    /**
     * The outline is backed in the buttons texture.
     * This looks excelent if the button's size matches the texture.  
     * */
    Texture,
    /**
     * The outline is created with the OutlineFilter.
     * Best to be used with small uniform textures (so scaling will not affect the texture). 
     */
    Filter
}
export class Button extends PIXI.Sprite {

    private textureUp: PIXI.Texture;
    private textureHighlight: PIXI.Texture;
    private textureDown: PIXI.Texture;
    private _outlineMode: OutlineMode = OutlineMode.Filter;
    private _outlineColor: number;
    private _isHighlighted: boolean = false;
    private _isPressed: boolean = false;
    private _isDisabled: boolean = false;
    private _isClickStarted: boolean = false;
    private _text: PIXI.Text;
    private requestedWidth: number = 0;
    private requestedHeight: number = 0;

    constructor(texturePath: string, x: number = 0, y: number = 0, width: number = 128, height: number = 32) {
        super();
        this.position.set(x || 0, y || 0);
        this.requestedHeight = height;
        this.requestedWidth = width;

        //  setup button textures
        this.setTexture(texturePath);

        this.buttonMode = false;
        this.interactive = true;
        this.cursor = "hover";

        // set the mousedown and touchstart callback...
        this.on('pointerdown', this.onButtonDown)
        this.on('pointerup', this.onButtonUp)
        this.on('pointerupoutside', this.onButtonUpOutside)
        this.on('pointerover', this.onButtonOver)
        this.on('pointerout', this.onButtonOut)

        this.isPressed = false;       
    }

    public get outlineMode(){
        return this._outlineMode;
    }
    public set outlineMode(state: OutlineMode) {
        this._outlineMode = state;
        this.filters = this._outlineMode == OutlineMode.Filter ? [new OutlineFilter(1, this._outlineColor, 0.5)]  : null;      
    }

    public get outlineColor(){
        return this._outlineColor;
    }
    public set outlineColor(value: number) {
        this._outlineColor = value;
        this.filters = this._outlineMode == OutlineMode.Filter ? [new OutlineFilter(1, this._outlineColor, 0.5)]  : null;      
    }

    public get disabled() {
        return this._isDisabled;
    }
    public set disabled(state: boolean) {
        this._isDisabled = state;
        this.cursor = state ? "" : "hover";
        this.applyTexture();
    }

    public get isPressed() {
        return this._isPressed;
    }
    public set isPressed(state: boolean) {
        this._isPressed = state;
        this.applyTexture();
    }

    public get isHighlighted() {
        return this._isHighlighted;
    }
    public set isHighlighted(state: boolean) {
        this._isHighlighted = state;
        this.applyTexture();
    }

    public get text() {
        return this._text;
    }
    public set text(text: PIXI.Text) {
        if (this._text) {
            this.removeChild(this._text);
        }
        this._text = text;
        if (this._text) {
            this._text.anchor.set(0.5, 0.5);
            var x = (this.width / this.scale.x) / 2;
            var y = (this.height / this.scale.y) / 2;
            this._text.position.set(x, y);
            this.addChild(this._text);
        }
    }

    public onClick: (event:any) => void;
    public mouseover:(event:any) => void;
    public mouseout:(event:any) => void;

    private onClickHandler(event:any){
        if(!this.onClick){
            console.warn("onClick() empty, did you forget to attach a handler?");
        } 
        else {
            this.onClick(event);
        }
    }
    
    private onButtonDown = () => {
        if(this._isDisabled) return;
        this._isClickStarted = true;
        this.texture = this.textureDown;
    }

    private onButtonUp = (event:any) => {
        if(this._isDisabled) return;
        if (this._isClickStarted) {
            this._isClickStarted = false;
            this.onClickHandler(event);
        }
        this.applyTexture();
    }

    private onButtonUpOutside = () => {
        if(this._isDisabled) return;
        this.applyTexture();
        this._isClickStarted = false;
    }

    private onButtonOver = (event:any) => {
        if(this._isDisabled) return;
        this.texture = this.textureHighlight;
        if(this.mouseover)this.mouseover(event);
    }

    private onButtonOut = (event:any) => {
        if(this._isDisabled) return;
        this._isClickStarted = false;
        this.applyTexture();
        if(this.mouseout)this.mouseout(event);
    }

    private applyTexture() {
        if(this._isDisabled){
            this.texture = this.textureUp;
            this.tint = 0x606060;
        }else if(this._isHighlighted){
            this.texture = this.textureHighlight;
            this.tint = 0x666666;
        }
        else{
            this.texture = this._isPressed ? this.textureDown : this.textureUp;
            this.tint = 0xffffff;
        }
    }

    public performClick(event:any){
        this.onClickHandler(event);
    }
    
    public setTexture(textureAtlasName: string) {
        //var spriteSheet = PIXI.loader.resources[textureAtlasName].texture;
        let spriteSheet: PIXI.Texture = TextureLoader.Get(textureAtlasName)!;
        spriteSheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        var btnHeight = spriteSheet.height / 3;
        var btnWidth = spriteSheet.width;
        this.textureUp = new PIXI.Texture(spriteSheet.baseTexture, new PIXI.Rectangle(spriteSheet.frame.x, spriteSheet.frame.y, btnWidth, btnHeight));
        this.textureHighlight = new PIXI.Texture(spriteSheet.baseTexture, new PIXI.Rectangle(spriteSheet.frame.x, spriteSheet.frame.y +  1 * btnHeight, btnWidth, btnHeight));
        this.textureDown = new PIXI.Texture(spriteSheet.baseTexture, new PIXI.Rectangle(spriteSheet.frame.x, spriteSheet.frame.y + 2 * btnHeight, btnWidth, btnHeight));

        //  calc the scale based on desired height/width
        var scaleW = (this.requestedWidth || btnWidth ) / btnWidth;
        var scaleH = (this.requestedHeight || btnHeight) / btnHeight;
        this.scale.set(scaleW, scaleH);

        this.applyTexture();
    }
}
