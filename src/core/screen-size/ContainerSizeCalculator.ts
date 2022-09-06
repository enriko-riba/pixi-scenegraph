import { IScreenSizeCalculator, ISize } from '../IScreenSizeCalculator';

const Aspect = {
    x: 1,
    y: 1,
};

/**
 * Preserves the container width and height, no aspect ratio is calculated.
 */
export class ContainerSizeCalculator implements IScreenSizeCalculator {
    constructor(private canvas: HTMLCanvasElement) {}

    /**
     * Returns the designed dimensions.
     */
    public CalculateSize(): ISize {
        return { x: this.canvas.clientWidth, y: this.canvas.clientHeight };
    }

    /**
     * Returns a fixed scale with value (1, 1).
     */
    public CalculateScale(): ISize {
        return Aspect;
    }
}
