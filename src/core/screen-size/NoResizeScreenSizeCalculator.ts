import { IScreenSizeCalculator, ISize } from '../IScreenSizeCalculator';

const Aspect = {
    x: 1,
    y: 1,
};

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
     */
    public CalculateScale(): ISize {
        return Aspect;
    }
}
