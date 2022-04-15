import {Application, Container, Loader} from 'pixi.js';
import {Howl} from 'howler';
// eslint-disable-next-line import/extensions
import * as AudioData from '../assets/audio/audiosprite.json';
import Reel from './Reel';

export default class Core
{
	private numUniqueSymbols = 8;

	private app: Application;
	private loader: Loader = Loader.shared;
	private howl: Howl;
	private reelsArray: Array<Reel> = [];
	private reelsContainer: Container = new Container;
	private reelResults: Array<Array<number>> = [];

	constructor(app: Application)
	{
		this.app = app;
		this.howl = new Howl(AudioData as any);
		this.howl.once('load', this.loadTextures.bind(this));
	}

	public updateCore(): void
	{
		// Core update
	}

	public getApp(): Application {return this.app;}
	public getNumUniqueSymbols(): number {return this.numUniqueSymbols;}
	public getReelResult(reel: number): Array<number> {return this.reelResults[reel];}

	private loadTextures(): void {
		this.loader.add('atlas', '../assets/images/atlas.json').load(this.onAssetsLoaded.bind(this));

	}

	private onAssetsLoaded() {
		this.generateAllNewReelResults();
		this.createInitialReels();
	}

	private createInitialReels(): void {
		for (let i = 0; i < 5; i++)
		{
			const newReel = new Reel(this, i);
			this.reelsArray.push(newReel);
			this.reelsContainer.addChild(newReel);
		}
		this.scaleAndAddReelsContainer();
	}

	private scaleAndAddReelsContainer(): void {
		this.reelsContainer.scale.set((this.app.renderer.width / this.reelsContainer.width));
		this.app.stage.addChild(this.reelsContainer);
	}

	private generateAllNewReelResults()
	{
		for (let i=0; i< 5; i++)
		{
			this.reelResults.push(this.generateNewReelResult());
		}
	}

	private generateNewReelResult()
	{
		const newReelResult: Array<number> = [];
		for (let i = 0; i < 3; i++)
		{
			newReelResult.push(Math.floor(Math.random() * this.getNumUniqueSymbols() + 1));
		}
		return newReelResult;
	}
}