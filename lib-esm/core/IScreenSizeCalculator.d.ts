export interface IScreenSizeCalculator {
    GetAvailableSize: () => ISize;
    GetAspectRatio: () => number;
    CalculateSize(availableSize: ISize, aspect: number): ISize;
    CalculateScale(availableScreenSize: ISize): ISize;
}
export interface ISize {
    x: number;
    y: number;
}
