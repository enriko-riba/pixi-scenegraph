/**
 * Contract for screen size and aspect ratio calculation.
 * The `SceneManager` delegates all screen size measurements to an `IScreenSizeCalculator` instance.
 * @remarks The calculated screen size is game specific and can return any value fit for a particular game design.
 * Two implementations are provided out of the box: the default {@link DefaultScreenSizeCalculator} and {@link NoResizeScreenSizeCalculator}.
 * The {@link DefaultScreenSizeCalculator} calculates a viewport that horizontally fits on screen and preserves the given aspect rastio
 * while the {@link NoResizeScreenSizeCalculator} always returns the full screen size disregarding any aspect ratio constraints.
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
     * Returns the screen size the renderer will actually use.
     */
    CalculateSize(): ISize;

    /**
     * Returns the scale to be applied to all scenes.
     * @param size
     */
    CalculateScale(size: ISize): ISize;
}

export interface ISize {
    x: number;
    y: number;
}
