//  infrastructure
export { Dictionary } from './utility/Dictionary';
export { KeyboardMapper } from './utility/KeyboardMapper';
export { KeyboardAction } from './utility/KeyboardAction';
export { LinkedList } from './utility/LinkedList';
export { TextureLoader } from './core/TextureLoader';

//  resizing
export { ISize, IScreenSizeCalculator } from './core/IScreenSizeCalculator';
export { DefaultScreenSizeCalculator } from './core/DefaultScreenSizeCalculator';

//  scenegraph
export { SceneManager } from './core/SceneManager';
export { Scene } from './core/Scene';

//  prefab objects
export { Parallax } from './objects/Parallax';
export { AnimatedSprite } from './objects/AnimatedSprite';
export { AnimationSequence } from './objects/AnimationSequence';
export { SpriteButton} from './objects/SpriteButton';
export { Slider } from './objects/Slider';

export const VERSION = "1.3.1";