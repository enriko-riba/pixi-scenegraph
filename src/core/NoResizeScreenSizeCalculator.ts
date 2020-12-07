import { IScreenSizeCalculator, ISize } from '..';

/**
 * Simply returns the available screen size without any scaling.
 */
export class NoResizeScreenSizeCalculator implements IScreenSizeCalculator {
    constructor(protected designedWidth: number, protected designedHeight: number) {}

    /**
     * Returns the available window size.
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
     * @param aspect - the aspect ratio
     */
    public CalculateSize(availableSize: ISize, aspect: number): ISize {
        return { x: window.innerWidth, y: window.innerHeight };
    }

    /**
     * Returns a scale applied to scenes so that they fit inside the calculated size.
     * @param calculatedSize - the maximum available screen size, usually returned by `CalculateSize()`
     */
    public CalculateScale(calculatedSize: ISize): ISize {
        return {
            x: 1,
            y: 1,
        };
    }
}
