import { ISceneResizer, ISize } from '..';

export class DefaultResizer implements ISceneResizer {
  constructor(protected designedWidth: number, protected designedHeight: number) {}
  public GetAvailableSize(): ISize {
    return { x: window.innerWidth, y: window.innerHeight };
  }
  public GetAspectRatio(): number {
    return this.designedWidth / this.designedHeight;
  }
  public CalculateSize(availableSize: ISize, aspect: number): ISize {
    const maxWidth = Math.floor(aspect * availableSize.y);
    const maxHeight = Math.floor(window.innerHeight);
    return { x: Math.min(maxWidth, availableSize.x), y: Math.min(maxHeight, availableSize.y) };
  }
  public CalculateScale(newSize: ISize): number {
    return newSize.x / this.designedWidth;
  }
}
