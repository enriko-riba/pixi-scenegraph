/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';
/**
 *
 */
export declare class TextureLoader {
  /**
   * simple cache used to apply mipmap and scaleMode only the first time an atlas is loaded.[]
   */
  private static resourceCache;
  static Get: (fullName: string, mipmap?: boolean) => PIXI.Texture | null;
  static IsAtlas(texture: PIXI.Texture): boolean;
}
