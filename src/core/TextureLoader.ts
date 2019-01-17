/**
 * Utility for loading single textures or atlas textures from PIXI.loader.resources.
 */
export class TextureLoader {
  public static IsAtlas(texture: PIXI.Texture) {
    return texture.frame.width !== texture.baseTexture.width || texture.frame.height !== texture.baseTexture.height;
  }

  public static Get = (
    fullName: string,
    mipmap: boolean = false,
    scaleMode: number = PIXI.SCALE_MODES.LINEAR,
  ): PIXI.Texture | null => {
    const idx = fullName.indexOf('.json@');
    const textureName = idx > 0 ? fullName.substr(idx + 6) : fullName;
    const resourceName = idx > 0 ? fullName.substr(0, idx + 5) : fullName;
    let res = TextureLoader.resourceCache[resourceName];

    if (!res) {
      //  try to get resource from loader
      TextureLoader.resourceCache[resourceName] = PIXI.loader.resources[resourceName];
      res = TextureLoader.resourceCache[resourceName];

      //  get base texture & set params
      const baseTexture = res.loadType === 1 ? res.spritesheet.baseTexture : res.texture.baseTexture;
      baseTexture.mipmap = mipmap;
      baseTexture.scaleMode = scaleMode;
    }

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
   * simple cache used to apply mipmap and scaleMode only the first time an atlas is loaded.
   */
  private static resourceCache: any = {};
}
