import {Loader, Sprite, Texture, Text} from 'pixi.js';
// eslint-disable-next-line import/extensions
import * as FancyText from '../assets/fancytext.json';

export default class SpinButton extends Sprite {

	normalTexture: Texture;
	disabledTexture: Texture;
	hoverTexture: Texture;
	pressedTexture: Texture;

	textLabel: Text = new Text('', FancyText);

	isEnabled = true;

	constructor () {
		super();

		const atlasTextures: any = Loader.shared.resources['atlas'].textures;
		this.normalTexture = atlasTextures['ui/btn_spin_normal.png'];
		this.disabledTexture = atlasTextures['ui/btn_spin_disabled.png'];
		this.hoverTexture = atlasTextures['ui/btn_spin_hover.png'];
		this.pressedTexture = atlasTextures['ui/btn_spin_pressed.png'];

		this.setupButtonParameters();
		this.createAndPositionTextOverlay();
		this.createEventListeners();
		this.setAsNormal();
	}

	private setupButtonParameters(): void
	{
		this.isEnabled = true;
		this.interactive = true;
		this.buttonMode = true;
	}

	private createEventListeners(): void
	{
		this.on('pointerdown', () =>{if (this.isEnabled) this.setAsPressed();});
		this.on('pointerover', () =>{if (this.isEnabled) this.setAsHover();});
		this.on('pointerout', () =>{if (this.isEnabled) this.setAsNormal();});
	}

	public setAsDisabled() {this.texture = this.disabledTexture; this.textLabel.text = ''; this.alpha = 0.5;}
	public setAsNormal() {this.texture = this.normalTexture; this.textLabel.text = 'Spin'; this.alpha = 1;}
	public setAsHover() {this.texture = this.hoverTexture;}
	public setAsPressed() {this.texture = this.pressedTexture;}
	public getIsEnabled() {return this.isEnabled;}
	public setIsEnabled(state: boolean) {
		this.isEnabled = state;
		!state ? this.setAsDisabled() : this.setAsNormal();
	}

	private createAndPositionTextOverlay()
	{
		this.textLabel.text = 'Spin';
		this.textLabel.anchor.set(0.5);
		this.textLabel.alpha = 0.75;
		this.textLabel.position.x = this.width / 2 + 5;
		this.textLabel.position.y = this.height / 2 - (this.textLabel.height / 1.35);
		this.addChild(this.textLabel);
	}
}