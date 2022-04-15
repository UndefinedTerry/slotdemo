import Reel from './Reel';
import {Container, Graphics} from 'pixi.js';
import Core from './Core';

export default class ReelManager {

	private reelsContainer: Container = new Container;
	private reelsArray: Array<Reel> = [];
	private readonly core: Core;

	constructor(core: Core)
	{
		this.core = core;
	}

	public getReelsArray(): Array<Reel> {return this.reelsArray;}

	public createInitialReels(): void
	{
		for (let i = 0; i < this.core.getNumReels(); i++)
		{
			const newReel = new Reel(this.core, i);
			this.reelsArray.push(newReel);
			this.reelsContainer.addChild(newReel);
		}
		this.scaleAndAddReelsContainer();
	}

	public generateNewReelResult(): Array<number>
	{
		// Just generate 3 new random numbers
		const newReelResult: Array<number> = [];
		for (let i = 0; i < 3; i++)
		{
			newReelResult.push(Math.floor(Math.random() * this.core.getNumUniqueSymbols() + 1));
		}
		return newReelResult;
	}

	private scaleAndAddReelsContainer(): void
	{
		// Scale the container to fit the current stage, just makes it fit nice, useless for rescaling the app itself
		this.reelsContainer.scale.set((this.core.getApp().renderer.width / this.reelsContainer.width));
		this.core.getApp().stage.addChild(this.reelsContainer);
		// Mask the reels so we don't get any ugliness
		this.reelsContainer.mask = this.createReelsMask();
	}

	private createReelsMask() : Graphics
	{
		const mask = new Graphics();
		mask.beginFill(0xff0000);
		mask.drawRect(0, 0, this.core.getApp().renderer.width, this.reelsContainer.height);
		mask.endFill();
		mask.cacheAsBitmap = true;
		return mask;
	}

}