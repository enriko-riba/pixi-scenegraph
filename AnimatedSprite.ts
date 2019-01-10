import { Dictionary } from "./Dictionary";
import * as PIXI from 'pixi.js';
import { TextureLoader } from './TextureLoader';

export class AnimatedSprite extends PIXI.Sprite {
    constructor() {
        super();
        this.pivot.set(0.5);
        this.anchor.set(0.5);
    }
    private accumulator: number = 0;
    private isPlaying: boolean = false;
    private isLooping: boolean = false;
    private frameIndex: number = 0;
    private currentFps: number = 8;
    private onCompleteCallBack: (seq:AnimationSequence) => void;
    
    private animations = new Dictionary<AnimationSequence>();
    protected currentSequence: AnimationSequence | null = null;

    public addAnimations(...sequences: Array<AnimationSequence>):void {
        sequences.forEach((seq: AnimationSequence, idx:number) => {
            this.animations.set(seq.sequenceName, seq);

            //  if no clip exists create it from first animation sequence
            if (!this.texture.valid && idx === 0) {
                this.texture = seq.spriteSheet;
                this.texture.frame = seq.frames[0];
            }
        });
    }

    public clearAnimations() {
        this.stop();
        this.currentSequence = null;
        this.animations.clear();
    }

    /**
     *  Plays the animation sequence by name
     */
    public play = (name: string, fps?: number, loop = true) :void => {
        if (!this.currentSequence || this.currentSequence.sequenceName !== name) {
            this.resetAnimation();
            this.currentSequence = this.animations.get(name);
            this.texture = this.currentSequence.spriteSheet;
            this.texture.frame = this.currentSequence.frames[0];            
            this.isPlaying = true;
        }
        this.fps = fps || this.fps;
        this.isLooping = loop;
    }

   

    public onUpdate (dt: number) { 
        if (this.isPlaying && this.texture.valid && this.currentSequence) {
            this.accumulator += dt;
            let secForFrame = 1000 / this.fps;
            if (this.accumulator > secForFrame) {
                this.accumulator -= secForFrame;
                this.texture.frame = this.currentSequence.frames[++this.frameIndex];
                if (this.frameIndex == this.currentSequence.frames.length-1) {
                    this.frameIndex = 0;

                    //  end the animation if not looping
                    if (!this.isLooping) {
                        this.isPlaying = false;
                        if (this.onCompleteCallBack) {
                            this.onCompleteCallBack(this.currentSequence);
                        }
                    }
                }                
            }
        }
    }

    public set onComplete(cb: (seq: AnimationSequence) => void) {
        this.onCompleteCallBack = cb;
    }
    public get onComplete(): (seq: AnimationSequence) => void {
        return this.onCompleteCallBack;
    }

    public stop():void {
        this.isPlaying = false;
    }
    public get fps():number {
        return this.currentFps;
    }
    public set fps(fps: number) {
        this.currentFps = fps;
        if (fps < 2) debugger;
    }    
    public set loop(isLooping: boolean) {
        this.isLooping = isLooping;
    }
    public get loop(): boolean {
        return this.isLooping;
    }
    
    protected resetAnimation():void {
        this.stop();
        this.currentSequence = null;
        this.accumulator = 0;
        this.frameIndex = -1;
    }
    
}

/*
 *   Creates textures for all individual frames of the sequence from the given texture atlas.
 */
export class AnimationSequence  {
    public spriteSheet: PIXI.Texture;
    public frames: PIXI.Rectangle[] = [];

    constructor(public sequenceName: string, spriteSheetName:string, frames: Array<number> = [], frameWidth : number, frameHeight : number) {
        //let tempTexure : PIXI.Texture = PIXI.utils.TextureCache[spriteSheetName];
        let tempTexure = TextureLoader.Get(spriteSheetName)!;
        let isAtlas = TextureLoader.IsAtlas(tempTexure);
        
        this.spriteSheet = new PIXI.Texture(tempTexure.baseTexture);
        var xFrames = isAtlas ? Math.floor(tempTexure.frame.width / frameWidth) : Math.floor(this.spriteSheet.width / frameWidth);
        
        frames.forEach((frame:number) => {
            let y = Math.floor(frame / xFrames);
            let x = frame % xFrames;
            let rect : PIXI.Rectangle;
            if(isAtlas){
                rect = new PIXI.Rectangle(tempTexure.frame.x +  x * frameWidth, tempTexure.frame.y + y * frameHeight, frameWidth, frameHeight);
            }
            else{                
                rect = new PIXI.Rectangle(x * frameWidth, y * frameHeight, frameWidth, frameHeight);
            }
            this.frames.push(rect);
        });
    }
    
    public get frameCount(): number {
        return this.frames.length;
    }
}