import { IScreenSizeCalculator, ISize } from '..';
export declare class DefaultScreenSizeCalculator implements IScreenSizeCalculator {
    protected designedWidth: number;
    protected designedHeight: number;
    constructor(designedWidth: number, designedHeight: number);
    GetAvailableSize(): ISize;
    GetAspectRatio(): number;
    CalculateSize(availableSize: ISize, aspect: number): ISize;
    CalculateScale(calculatedSize: ISize): ISize;
}
