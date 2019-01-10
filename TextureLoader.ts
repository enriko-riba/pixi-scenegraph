import * as PIXI from 'pixi.js';

/**
 * 
 */
export class TextureLoader {

    /**
     * simple cache used to apply mipmap and scaleMode only the first time an atlas is loaded.[]
     */
    private static resourceCache : any = {};

    public static Get = (fullName: string, mipmap: boolean = false): PIXI.Texture | null => {
        var idx = fullName.indexOf('.json@');
        var textureName = (idx > 0) ? fullName.substr(idx + 6) : fullName;
        var resourceName = (idx > 0) ? fullName.substr(0, idx + 5) : fullName;
        if (!TextureLoader.resourceCache[resourceName]) {
            TextureLoader.resourceCache[resourceName] = PIXI.loader.resources[resourceName];
            TextureLoader.resourceCache[resourceName].spritesheet.baseTexture.mipmap = mipmap;
            TextureLoader.resourceCache[resourceName].spritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        }
        var res = TextureLoader.resourceCache[resourceName];

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
    }

    public static IsAtlas(texture: PIXI.Texture) {
        return texture.frame.width != texture.baseTexture.width || texture.frame.height != texture.baseTexture.height;
    }
}