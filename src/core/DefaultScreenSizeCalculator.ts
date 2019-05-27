import { IScreenSizeCalculator, ISize } from '..';

/**
 * Calculates viewport that horizontaly fits in the device and still preserves the aspect ratio.
 */
export class DefaultScreenSizeCalculator implements IScreenSizeCalculator {
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
        const maxWidth = Math.floor(aspect * availableSize.y);
        const maxHeight = Math.floor(window.innerHeight);
        return { x: Math.min(maxWidth, availableSize.x), y: Math.min(maxHeight, availableSize.y) };
    }

    /**
     * Returns a scale applied to scenes so that they fit inside the calculated size.
     * @param calculatedSize - the maximum available screen size, usually returned by `CalculateSize()`
     */
    public CalculateScale(calculatedSize: ISize): ISize {
        return {
            x: calculatedSize.x / this.designedWidth,
            y: calculatedSize.x / this.designedWidth,
        };
    }
}
