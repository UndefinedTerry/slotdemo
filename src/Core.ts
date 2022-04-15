import {Application, Container, Graphics, Loader} from 'pixi.js';
import {Howl} from 'howler';
// eslint-disable-next-line import/extensions
import * as AudioData from '../assets/audio/audiosprite.json';
import Reel from './Reel';
import SpinButton from './SpinButton';

export default class Core
{
	private numUniqueSymbols = 8;
	private numReels = 5;

	private readonly app: Application;
	private loader: Loader = Loader.shared;
	private readonly howl: Howl;
	private reelsArray: Array<Reel> = [];
	private reelsContainer: Container = new Container;
	private spinButton: SpinButton | any;

	constructor(app: Application)
	{
		this.app = app;
		this.howl = new Howl(AudioData as any);
		this.howl.once('load', this.loadTextures.bind(this));
	}

	public getApp(): Application {return this.app;}
	public getNumUniqueSymbols(): number {return this.numUniqueSymbols;}
	public getNumReels(): number {return this.numReels;}
	public getHowl(): Howl {return this.howl;}
	public resetSpinButton(): void {this.spinButton.setIsEnabled(true);}

	private loadTextures(): void
	{
		this.loader.add('atlas', '../assets/images/atlas.json').load(this.onAssetsLoaded.bind(this));
	}

	private onAssetsLoaded(): void
	{
		this.createInitialReels();
		this.createSpinButton();
	}

	private createInitialReels(): void
	{
		for (let i = 0; i < this.numReels; i++)
		{
			const newReel = new Reel(this, i);
			this.reelsArray.push(newReel);
			this.reelsContainer.addChild(newReel);
		}
		this.scaleAndAddReelsContainer();
	}

	private scaleAndAddReelsContainer(): void
	{
		this.reelsContainer.scale.set((this.app.renderer.width / this.reelsContainer.width));
		this.app.stage.addChild(this.reelsContainer);
		this.reelsContainer.mask = this.createReelsMask();
	}

	private createReelsMask() : Graphics
	{
		const mask = new Graphics();
		mask.beginFill(0xff0000);
		mask.drawRect(0, 0, this.getApp().renderer.width, this.reelsContainer.height);
		mask.endFill();
		mask.cacheAsBitmap = true;
		return mask;
	}

	public generateNewReelResult(): Array<number>
	{
		const newReelResult: Array<number> = [];
		for (let i = 0; i < 3; i++)
		{
			newReelResult.push(Math.floor(Math.random() * this.getNumUniqueSymbols() + 1));
		}
		return newReelResult;
	}

	private createSpinButton()
	{
		this.spinButton = new SpinButton();
		this.spinButton.setAsNormal();
		this.spinButton.anchor.set(0.5);
		this.spinButton.position.y = this.app.renderer.height - (this.spinButton.height/2);
		this.spinButton.position.x = (this.app.renderer.width/2);
		this.app.stage.addChild(this.spinButton);
		this.spinButton.on('pointerup', () =>{
			if (this.spinButton.getIsEnabled())
				this.doSpinButtonPressed();
		});
	}

	private doSpinButtonPressed()
	{
		this.howl.play('Start_Button');
		this.spinButton.setIsEnabled(false);
		this.reelsArray.forEach((reel) => {
			reel.animateCurrentSymbolsOut();
		})
	}
}