import * as PIXI from 'pixi.js';

/**
 * Utility for loading single textures or atlas textures from PIXI.loader.resources.
 */
export class TextureLoader {
  public static IsAtlas(texture: PIXI.Texture) {
    return texture.frame.width !== texture.baseTexture.width || texture.frame.height !== texture.baseTexture.height;
  }

  public static Get = (fullName: string, mipmap: boolean = false): PIXI.Texture | null => {
    const idx = fullName.indexOf('.json@');
    const textureName = idx > 0 ? fullName.substr(idx + 6) : fullName;
    const resourceName = idx > 0 ? fullName.substr(0, idx + 5) : fullName;
    if (!TextureLoader.resourceCache[resourceName]) {
      TextureLoader.resourceCache[resourceName] = PIXI.loader.resources[resourceName];
      TextureLoader.resourceCache[resourceName].spritesheet.baseTexture.mipmap = mipmap;
      TextureLoader.resourceCache[resourceName].spritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    }
    const res = TextureLoader.resourceCache[resourceName];

    if (!res) {
      console.error(`Resource:'${fullName}' not found!`);
      return null;
    }

    switch (res.loadType) {
      case 1: //  atlas
        return res.textures[textureName];
      case 2: //  single texture
        return res.texture;
    }
    console.error(`Resource:'${fullName}' unknown load type!`, res);
    return null;
  };

  /**
   * simple cache used to apply mipmap and scaleMode only the first time an atlas is loaded.[]
   */
  private static resourceCache: any = {};
}
