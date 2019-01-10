import { TextureLoader } from '.';

/**
 *   Creates textures for all individual frames of the sequence from the given texture atlas.
 */
export class AnimationSequence {
  public spriteSheet: PIXI.Texture;
  public frames: PIXI.Rectangle[] = [];

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

  public get frameCount(): number {
    return this.frames.length;
  }
}
