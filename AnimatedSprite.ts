import * as PIXI from 'pixi.js';
import { AnimationSequence, Dictionary } from '.';

export class AnimatedSprite extends PIXI.Sprite {
  protected currentSequence: AnimationSequence | null = null;

  private accumulator: number = 0;
  private isPlaying: boolean = false;
  private isLooping: boolean = false;
  private frameIndex: number = 0;
  private currentFps: number = 8;
  private onCompleteCallBack: (seq: AnimationSequence) => void;
  private animations = new Dictionary<AnimationSequence>();

  constructor() {
    super();
    this.pivot.set(0.5);
    this.anchor.set(0.5);
  }

  public addAnimations(...sequences: AnimationSequence[]): void {
    sequences.forEach((seq: AnimationSequence, idx: number) => {
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
  public play = (name: string, fps?: number, loop = true): void => {
    if (!this.currentSequence || this.currentSequence.sequenceName !== name) {
      this.resetAnimation();
      this.currentSequence = this.animations.get(name);
      this.texture = this.currentSequence.spriteSheet;
      this.texture.frame = this.currentSequence.frames[0];
      this.isPlaying = true;
    }
    this.fps = fps || this.fps;
    this.isLooping = loop;
  };

  public onUpdate(dt: number) {
    if (this.isPlaying && this.texture.valid && this.currentSequence) {
      this.accumulator += dt;
      const secForFrame = 1000 / this.fps;
      if (this.accumulator > secForFrame) {
        this.accumulator -= secForFrame;
        this.texture.frame = this.currentSequence.frames[++this.frameIndex];
        if (this.frameIndex === this.currentSequence.frames.length - 1) {
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

  public stop(): void {
    this.isPlaying = false;
  }
  public get fps(): number {
    return this.currentFps;
  }
  public set fps(fps: number) {
    this.currentFps = fps;
  }
  public set loop(isLooping: boolean) {
    this.isLooping = isLooping;
  }
  public get loop(): boolean {
    return this.isLooping;
  }

  protected resetAnimation(): void {
    this.stop();
    this.currentSequence = null;
    this.accumulator = 0;
    this.frameIndex = -1;
  }
}
