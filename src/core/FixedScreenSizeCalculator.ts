import { IScreenSizeCalculator, ISize } from '..';

const Aspect = {
    x: 1,
    y: 1,
};

/**
 * Returns the designed width and height with aspect ratio 1.
 */
export class NoResizeScreenSizeCalculator implements IScreenSizeCalculator {
    constructor(private designedWidth: number, private designedHeight: number) {}

    /**
     * Returns the largest physical screen dimensions.
     */
    public CalculateSize(): ISize {
        return { x: this.designedWidth, y: this.designedHeight };
    }

    /**
     * Returns a fixed scale with value (1, 1).
     */
    public CalculateScale(): ISize {
        return Aspect;
    }
}
