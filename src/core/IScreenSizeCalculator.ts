/**
 * Contract for screen size and aspect ratio calculation.
 * The `SceneManager` delegates all screen size measurements to an `IScreenSizeCalculator` instance.
 * @remarks An implementor can return any value it sees fit for a particular implementation.
 * 
 * The `CalculateSize()` could always return a fixed value like 800x600, regardless of the actual screen size.
 * 
 * The IScreenSizeCalculator is used in resize events in the following manner:
 * ```
 * const avlSize = this.screenSizeCalculator.GetAvailableSize();
 * const aspect = this.screenSizeCalculator.GetAspectRatio();
 * const size = this.screenSizeCalculator.CalculateSize(avlSize, aspect);
 * this.renderer.resize(size.x, size.y);
 * ```
 */
export interface IScreenSizeCalculator {

  /**
   * Returns the available or desired screen size. This value is passed to the `CalculateSize()` and `CalculateScale` functions.
   */
  GetAvailableSize: () => ISize;

  /**
   * Returns the desired aspect ratio. This value is passed to the `CalculateSize()` function.
   */
  GetAspectRatio: () => number;

  /**
   * Returns the screen size the renderer will actually use.
   * 
   * @param availableSize - the available screen dimensions.
   * @param aspect - the required aspect ratio
   */
  CalculateSize(availableSize: ISize, aspect: number) : ISize;

  /**
   * Returns the scale to be applied to all scenes.
   * @param availableScreenSize 
   */
  CalculateScale(availableScreenSize: ISize): ISize;
}

export interface ISize {
  x: number;
  y: number;
}
