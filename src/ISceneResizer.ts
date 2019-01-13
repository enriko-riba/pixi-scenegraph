/**
 *   Object passed to the SceneManager handling various aspects of scene resizing.
 */
export interface ISceneResizer {
  /*
   *   Returns the available width.
   */
  GetAvailableSize: () => ISize;

  /*
   *   Returns the desired aspect ratio for the stage.
   */
  GetAspectRatio: () => number;

  CalculateSize: (availableSize: ISize, aspect: number) => ISize;

  CalculateScale(newSize: ISize): number;
}

export interface ISize {
  x: number;
  y: number;
}
