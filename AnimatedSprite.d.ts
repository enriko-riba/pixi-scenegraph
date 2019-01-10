/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
export declare class AnimatedSprite extends PIXI.Sprite {
  constructor();
  private animations;
  protected currentSequence: AnimationSequence | null;
  addAnimations(...sequences: AnimationSequence[]): void;
  clearAnimations(): void;
  /**
   *  Plays the animation sequence by name
   */
  play: (name: string, fps?: number | undefined, loop?: boolean) => void;
  private accumulator;
  private isPlaying;
  private isLooping;
  private frameIndex;
  private currentFps;
  private onCompleteCallBack;
}
export declare class AnimationSequence {
  sequenceName: string;
  spriteSheet: PIXI.Texture;
  frames: PIXI.Rectangle[];
  constructor(
    sequenceName: string,
    spriteSheetName: string,
    frames: number[] | undefined,
    frameWidth: number,
    frameHeight: number,
  );
  readonly frameCount: number;
}
