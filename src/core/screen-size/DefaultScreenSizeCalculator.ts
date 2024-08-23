import { IScreenSizeCalculator, ISize } from '../IScreenSizeCalculator';

/**
 * Calculates viewport that horizontally fits in the device and still preserves the designed aspect ratio.
 */
export class DefaultScreenSizeCalculator implements IScreenSizeCalculator {
    private aspect: number;
    constructor(
        protected designedWidth: number,
        protected designedHeight: number,
    ) {
        this.aspect = this.designedWidth / this.designedHeight;
    }

    /**
     * Returns the largest size that fits in the physical screen dimensions while preserving the aspect ratio.
     */
    public CalculateSize(): ISize {
        const availableSize = { x: window.innerWidth, y: window.innerHeight };
        const maxWidth = Math.floor(this.aspect * availableSize.y);
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
