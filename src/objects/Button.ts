import * as PIXI from 'pixi.js';
import { OutlineFilter } from '@pixi/filter-outline';
import { TextureLoader } from '..';

export enum OutlineMode {
  /**
   * The outline is backed in the buttons texture.
   * This looks excelent if the button's size matches the texture.
   */
  Texture,
  /**
   * The outline is created with the OutlineFilter.
   * Best to be used with small uniform textures (so scaling will not affect the texture).
   */
  Filter,
}

/**
 * Sprite based button.
 */
export class Button extends PIXI.Sprite {
  public onClick: (event: any) => void;
  public mouseover: (event: any) => void;
  public mouseout: (event: any) => void;

  private textureUp: PIXI.Texture;
  private textureHighlight: PIXI.Texture;
  private textureDown: PIXI.Texture;
  private outlineModeValue: OutlineMode = OutlineMode.Filter;
  private outlineColorValue: number;
  private isHighlightedValue: boolean = false;
  private isPressedValue: boolean = false;
  private isDisabledValue: boolean = false;
  private isClickStartedValue: boolean = false;
  private textValue: PIXI.Text;
  private requestedWidth: number = 0;
  private requestedHeight: number = 0;

  constructor(texturePath: string, x: number = 0, y: number = 0, width: number = 128, height: number = 32) {
    super();
    this.position.set(x || 0, y || 0);
    this.requestedHeight = height;
    this.requestedWidth = width;

    //  setup button textures
    this.setTexture(texturePath);

    this.buttonMode = false;
    this.interactive = true;
    this.cursor = 'hover';

    // set the mousedown and touchstart callback...
    this.on('pointerdown', this.onButtonDown);
    this.on('pointerup', this.onButtonUp);
    this.on('pointerupoutside', this.onButtonUpOutside);
    this.on('pointerover', this.onButtonOver);
    this.on('pointerout', this.onButtonOut);

    this.isPressed = false;
  }

  public get outlineMode() {
    return this.outlineModeValue;
  }
  public set outlineMode(state: OutlineMode) {
    this.outlineModeValue = state;
    this.filters =
      this.outlineModeValue === OutlineMode.Filter ? [new OutlineFilter(1, this.outlineColorValue, 0.5)] : null;
  }

  public get outlineColor() {
    return this.outlineColorValue;
  }
  public set outlineColor(value: number) {
    this.outlineColorValue = value;
    this.filters =
      this.outlineModeValue === OutlineMode.Filter ? [new OutlineFilter(1, this.outlineColorValue, 0.5)] : null;
  }

  public get disabled() {
    return this.isDisabledValue;
  }
  public set disabled(state: boolean) {
    this.isDisabledValue = state;
    this.cursor = state ? '' : 'hover';
    this.applyTexture();
  }

  public get isPressed() {
    return this.isPressedValue;
  }
  public set isPressed(state: boolean) {
    this.isPressedValue = state;
    this.applyTexture();
  }

  public get isHighlighted() {
    return this.isHighlightedValue;
  }
  public set isHighlighted(state: boolean) {
    this.isHighlightedValue = state;
    this.applyTexture();
  }

  public get text() {
    return this.textValue;
  }
  public set text(text: PIXI.Text) {
    if (this.textValue) {
      this.removeChild(this.textValue);
    }
    this.textValue = text;
    if (this.textValue) {
      this.textValue.anchor.set(0.5, 0.5);
      const x = this.width / this.scale.x / 2;
      const y = this.height / this.scale.y / 2;
      this.textValue.position.set(x, y);
      this.addChild(this.textValue);
    }
  }

  public performClick(event: any) {
    this.onClickHandler(event);
  }

  public setTexture(textureAtlasName: string) {
    const spriteSheet: PIXI.Texture = TextureLoader.Get(textureAtlasName)!;
    spriteSheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    const btnHeight = spriteSheet.height / 3;
    const btnWidth = spriteSheet.width;
    this.textureUp = new PIXI.Texture(
      spriteSheet.baseTexture,
      new PIXI.Rectangle(spriteSheet.frame.x, spriteSheet.frame.y, btnWidth, btnHeight),
    );
    this.textureHighlight = new PIXI.Texture(
      spriteSheet.baseTexture,
      new PIXI.Rectangle(spriteSheet.frame.x, spriteSheet.frame.y + 1 * btnHeight, btnWidth, btnHeight),
    );
    this.textureDown = new PIXI.Texture(
      spriteSheet.baseTexture,
      new PIXI.Rectangle(spriteSheet.frame.x, spriteSheet.frame.y + 2 * btnHeight, btnWidth, btnHeight),
    );

    //  calc the scale based on desired height/width
    const scaleW = (this.requestedWidth || btnWidth) / btnWidth;
    const scaleH = (this.requestedHeight || btnHeight) / btnHeight;
    this.scale.set(scaleW, scaleH);

    this.applyTexture();
  }

  private onClickHandler(event: any) {
    if (!this.onClick) {
      console.warn('onClick() empty, did you forget to attach a handler?');
    } else {
      this.onClick(event);
    }
  }

  private onButtonDown = () => {
    if (this.isDisabledValue) {
      return;
    }
    this.isClickStartedValue = true;
    this.texture = this.textureDown;
  };

  private onButtonUp = (event: any) => {
    if (this.isDisabledValue) {
      return;
    }
    if (this.isClickStartedValue) {
      this.isClickStartedValue = false;
      this.onClickHandler(event);
    }
    this.applyTexture();
  };

  private onButtonUpOutside = () => {
    if (this.isDisabledValue) {
      return;
    }
    this.applyTexture();
    this.isClickStartedValue = false;
  };

  private onButtonOver = (event: any) => {
    if (this.isDisabledValue) {
      return;
    }
    this.texture = this.textureHighlight;
    if (this.mouseover) {
      this.mouseover(event);
    }
  };

  private onButtonOut = (event: any) => {
    if (this.isDisabledValue) {
      return;
    }
    this.isClickStartedValue = false;
    this.applyTexture();
    if (this.mouseout) {
      this.mouseout(event);
    }
  };

  private applyTexture() {
    if (this.isDisabledValue) {
      this.texture = this.textureUp;
      this.tint = 0x606060;
    } else if (this.isHighlightedValue) {
      this.texture = this.textureHighlight;
      this.tint = 0x666666;
    } else {
      this.texture = this.isPressedValue ? this.textureDown : this.textureUp;
      this.tint = 0xffffff;
    }
  }
}
