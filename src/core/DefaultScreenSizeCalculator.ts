import { IScreenSizeCalculator, ISize } from '..';

/**
 * Calculates screen dimensions that horizontaly fit in the real screen and preserve the aspect ratio for the designed size.
 */
export class DefaultScreenSizeCalculator implements IScreenSizeCalculator {
  constructor(protected designedWidth: number, protected designedHeight: number) {}

  /**
   * Returns the available screen size.
   */
  public GetAvailableSize(): ISize {
    return { x: window.innerWidth, y: window.innerHeight };
  }
  /**
   * Returns the aspect ratio of the designedWidth and designedHeight.
   */
  public GetAspectRatio(): number {
    return this.designedWidth / this.designedHeight;
  }

  /**
   * Returns the largest size that fits in the `availableSize` and preserves the aspect ratio.
   * @param availableSize - the screen size that can be used
   * @param aspect - the aspect ratio that must be preserved
   */
  public CalculateSize(availableSize: ISize, aspect: number): ISize {
    const maxWidth = Math.floor(aspect * availableSize.y);
    const maxHeight = Math.floor(window.innerHeight);
    return { x: Math.min(maxWidth, availableSize.x), y: Math.min(maxHeight, availableSize.y) };
  }

  /**
   * Returns a scale applied to scenes so that they fit inside the calculated size.
   * @param calculatedSize - the maximum allowed screen size, usually returned by `CalculateSize()`
   */
  public CalculateScale(calculatedSize: ISize): ISize {
    return {
      x: calculatedSize.x / this.designedWidth,
      y: calculatedSize.x / this.designedWidth,
    };
  }
}
