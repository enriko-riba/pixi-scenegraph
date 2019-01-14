import { TextureLoader } from '..';

/**
 *  Defines a single animation. Consists of a a texture and individual animation frames.
 *  @remarks The texture (`spriteSheetName`) is either a spritesheet or an image inside a larger texture atlas.
 */
export class AnimationSequence {
  public spriteSheet: PIXI.Texture;
  public frames: PIXI.Rectangle[] = [];

  /**
   * Creates a new AnimationSequence instance.
   * @param sequenceName - the unique name of this animation
   * @param spriteSheetName - the texture name holding all animation frames or atlas/image name
   * @param frames - sequential list of frame indices defining the frame animation order. 
   * @param frameWidth - width of a single frame in pixels
   * @param frameHeight - height of a single frame in pixels
   */
  constructor(
    public sequenceName: string,
    spriteSheetName: string,
    frames: number[] = [],
    frameWidth: number,
    frameHeight: number,
  ) {
    const tempTexure = TextureLoader.Get(spriteSheetName)!;
    const isAtlas = TextureLoader.IsAtlas(tempTexure);

    this.spriteSheet = new PIXI.Texture(tempTexure.baseTexture);
    const xFrames = isAtlas
      ? Math.floor(tempTexure.frame.width / frameWidth)
      : Math.floor(this.spriteSheet.width / frameWidth);

    frames.forEach((frame: number) => {
      const y = Math.floor(frame / xFrames);
      const x = frame % xFrames;
      let rect: PIXI.Rectangle;
      if (isAtlas) {
        rect = new PIXI.Rectangle(
          tempTexure.frame.x + x * frameWidth,
          tempTexure.frame.y + y * frameHeight,
          frameWidth,
          frameHeight,
        );
      } else {
        rect = new PIXI.Rectangle(x * frameWidth, y * frameHeight, frameWidth, frameHeight);
      }
      this.frames.push(rect);
    });
  }

  /**
   * Returns the number of frames defined in this animation instance.
   */
  public get frameCount(): number {
    return this.frames.length;
  }
}
