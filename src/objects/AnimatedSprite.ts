import { AnimationSequence, Dictionary } from '..';

/**
 * Animated sprite display object. Holds a collection of `AnimationSequence` objects that can be started and stopped on demand.
 */
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

  /**
   * Adds one or multiple animation sequences.
   * @example
   * ```
   * explode.addAnimations(new AnimationSequence("exp", "assets/atlas.json@big_bang.png", [0, 1, 2, 3, 4, 5], 32, 32));
   * ```
   * @param sequences - animation sequence instances to be added. All animation sequences added to an `AnimatedSprite` **must** have unique names.
   */
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
   * Plays the animation sequence by name.
   * @param name - animation sequence to be played
   * @param fps - animation speed in frames per second
   * @param loop - if true the animation keeps looping else the animation stops once last frame is reached
   * @remarks The `onComplete` callback will be invoked only if the `loop` parameter is false 
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

  /**
   * Used by the framework to update internal state on each frame.
   */
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

  /**
   * Sets the callback function to be invoked after the animation ends.
   * @example Use it to trigger actions on animation end `explode.onComplete = () => this.container.removeChild(explode);`
   * @remarks This callback will be invoked only if the animated sprite is not looping. 
   */
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
