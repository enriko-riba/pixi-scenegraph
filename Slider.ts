import * as PIXI from 'pixi.js';
import { OutlineFilter } from '@pixi/filter-outline';
import { TextureLoader } from '.';

let COLUMN_PADDING = 1;

export class Slider extends PIXI.Container {
    private textureHandle: PIXI.Texture;
    private textureControl: PIXI.Texture;
    private frameUpControl: PIXI.Rectangle;
    private frameHighlightControl: PIXI.Rectangle;
    private frameDownControl: PIXI.Rectangle;

    private frameUpHandle: PIXI.Rectangle;
    private frameHighlightHandle: PIXI.Rectangle;
    private frameDownHandle: PIXI.Rectangle;

    private isPressed: boolean = false;
    private text: PIXI.Text;
    private requestedWidth: number;
    private requestedHeight: number;

    private control : PIXI.Sprite;

    private handle: PIXI.Sprite;
    private handleWidth: number;
    private value: number = 0;

    private maxX: number;
    private minX: number;

    private _outlineColor: number;

    /**
     * 
     * @param textureAtlas slider texture, two columns (outline, handle) and three rows (normal, highlight, pressed).
     * @param sliderFrameWidth width of the second column holding the slider handle
     * @param x
     * @param y
     * @param width
     * @param height
     */
    constructor(textureAtlas: string, sliderFrameWidth: number, x: number = 0, y: number = 0 , width: number, height: number) {
        super();
        this.position.set(x || 0, y || 0);
        this.requestedHeight = height;
        this.requestedWidth = width;

        this.control = new PIXI.Sprite();
        this.control.anchor.set(0);
        this.control.interactive = true;
        this.control.buttonMode = false;
        this.control.cursor = "hover";
        this.addChild(this.control);
        this.control
            .on('pointerdown', this.onButtonDown)
            .on('pointerup', this.onButtonUp)
            .on('pointertap', this.onClick)
            .on('pointerupoutside', this.onButtonUpOutside)
            .on('mouseover', this.onButtonOver)
            .on('mouseout', this.onButtonOut);


        this.handleWidth = sliderFrameWidth;
        this.handle = new PIXI.Sprite();
        this.handle.position.set(0, this.requestedHeight/2);
        this.handle.anchor.set(0, 0.5);
        this.addChild(this.handle);
        this.handle.interactive = true;
        this.handle.buttonMode = false;
        this.handle.cursor = "hover";
        this.handle
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);
           

        //  setup textures
        this.SetTexture(textureAtlas, sliderFrameWidth);
        this.IsPressed = false;
        this.applyTextureFrames();

        this.Value = 0.1;
    }


    public get Value() {
        return this.value;
    }
    public set Value(value: number) {
        if (this.value !== value) {
            this.value = value;            
            this.handle.position.x = this.maxX * value;
            this.emit('valueChange', value);
            this.emit('valueChanged', value);
        }        
    }

    public get outlineColor(){
        return this._outlineColor;
    }
    public set outlineColor(value: number) {
        this._outlineColor = value;
        this.control.filters = [new OutlineFilter(1, this._outlineColor, 0.5)];      
    }

    public get IsPressed() {
        return this.isPressed;
    }
    public set IsPressed(state: boolean) {
        this.isPressed = state;
        this.applyTextureFrames();
    }

    public get Text() {
        return this.text;
    }
    public set Text(text: PIXI.Text) {
        if (this.text) {
            this.removeChild(this.text);
        }
        this.text = text;
        if (this.text) {
            this.text.anchor.set(0.5, 0.5);
            var x = (this.width / this.scale.x) / 2;
            var y = (this.height / this.scale.y) / 2;
            this.text.position.set(x, y);
            this.addChild(this.text);
        }
    }


    public onClick = (e:PIXI.interaction.InteractionEvent) => {
        this.setSliderFromeEvent(e);
        this.Value = this.getCalculatedValue();
        return false;
    }

    private dragOffsetX: number = 0;
    private isDragging: boolean = false;

    private getCalculatedValue() {
        var position = this.handle.x - this.minX;
        var pct = position / this.maxX;
        return this.precise_round(pct, 2);
    }

    private onDragStart = (e: PIXI.interaction.InteractionEvent) => {
        this.isDragging = true;
        var pos = e.data.getLocalPosition(this.handle);
        this.dragOffsetX = pos.x;
    }
    private onDragEnd = (e: PIXI.interaction.InteractionEvent) => {
        this.isDragging = false;
        this.Value = this.getCalculatedValue();
        e.stopped = true;
    }

    private onDragMove = (e:PIXI.interaction.InteractionEvent) => {
        if (this.isDragging) {
            this.setSliderFromeEvent(e);
            return false;
        }
        return true;
    }

    private setSliderFromeEvent(e: PIXI.interaction.InteractionEvent) {
        var newPosition = e.data.getLocalPosition(this.handle.parent);
        if (this.isDragging && this.dragOffsetX) {
            newPosition.x -= this.dragOffsetX;
        }
        this.handle.x = Math.min(this.maxX, Math.max(this.minX, newPosition.x));
        this.emit('valueChange', this.getCalculatedValue());
    }
    private precise_round(num: number, decimals: number): number {
        var t = Math.pow(10, decimals);
        var result = (Math.round((num * t) + (decimals > 0 ? 1 : 0) * ((Math as any).sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
        return parseFloat(result);
    }

    private onButtonDown = () => {
        this.textureControl.frame = this.frameDownControl;
        this.textureHandle.frame = this.frameDownHandle;
    };

    private onButtonUp = () => {
        this.applyTextureFrames();
    };

    private onButtonUpOutside = () => {
        this.applyTextureFrames();
    };

    private onButtonOver = () => {
        this.control.texture.frame = this.frameHighlightControl;
        this.textureHandle.frame = this.frameHighlightHandle;
    };

    private onButtonOut = () => {
        this.applyTextureFrames();
    };


    private applyTextureFrames() {
        this.textureControl.frame = this.isPressed ? this.frameDownControl : this.frameUpControl;
        this.textureHandle.frame = this.isPressed ? this.frameDownHandle : this.frameUpHandle;
    }

    public SetTexture(textureName: string, handleWidth: number) {
        let t = TextureLoader.Get(textureName)!;
        //  prepare textures
        this.textureControl = new PIXI.Texture(t.baseTexture);
        this.textureControl.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.textureHandle = new PIXI.Texture(t.baseTexture);
        
        //  calculate rect frames for textures
        var frameHeight = this.textureControl.height / 3;
        var frameWidth = this.textureControl.width - handleWidth - COLUMN_PADDING;
        this.frameUpControl = new PIXI.Rectangle(0, 0 * frameHeight, frameWidth, frameHeight);
        this.frameHighlightControl = new PIXI.Rectangle(0, 1 * frameHeight, frameWidth, frameHeight);
        this.frameDownControl = new PIXI.Rectangle(0, 2 * frameHeight, frameWidth, frameHeight);
        
        var x = frameWidth + COLUMN_PADDING; //  texture elements are separated by padding pixels
        this.frameUpHandle = new PIXI.Rectangle(x, 0 * frameHeight, handleWidth, frameHeight);
        this.frameHighlightHandle = new PIXI.Rectangle(x, 1 * frameHeight, handleWidth, frameHeight);
        this.frameDownHandle = new PIXI.Rectangle(x, 2 * frameHeight, handleWidth, frameHeight);

        // set frames
        this.applyTextureFrames();
        
        this.control.texture = this.textureControl;
        this.control.width = this.requestedWidth;     
        this.control.height = this.requestedHeight;     

        // handle
        this.handle.texture = this.textureHandle;
        this.handle.height = this.requestedHeight;


        this.maxX = this.requestedWidth - this.handleWidth;
        this.minX = 0;
    }
}
