import { IScreenSizeCalculator, ISize } from '..';

/**
 * Simply returns the available screen size without any scaling.
 */
export class NoResizeScreenSizeCalculator implements IScreenSizeCalculator {
    constructor() {}

    /**
     * Returns the largest physical screen dimensions.
     */
    public CalculateSize(): ISize {
        return { x: window.innerWidth, y: window.innerHeight };
    }

    /**
     * Returns a fixed scale with value (1, 1).
     * @param calculatedSize - unused, represents the maximum available screen size usually returned by `CalculateSize()`
     */
    public CalculateScale(calculatedSize: ISize): ISize {
        return {
            x: 1,
            y: 1,
        };
    }
}
