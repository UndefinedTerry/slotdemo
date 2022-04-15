import {Application, Loader} from 'pixi.js';
import {Howl} from 'howler';
import SpinButtonManager from './SpinButtonManager';
import ReelManager from './ReelManager';
// eslint-disable-next-line import/extensions
import * as AudioData from '../assets/audio/audiosprite.json';

export default class Core
{
	// Constants - Only a couple so might as well keep them here
	private numUniqueSymbols = 8;
	private numReels = 5;

	private loader: Loader = Loader.shared;

	private readonly app: Application;
	private readonly howl: Howl;
	private readonly reelManager: ReelManager;
	private spinButtonManager: SpinButtonManager;

	constructor(app: Application)
	{
		// Initialize classes
		this.app = app;
		this.reelManager = new ReelManager(this);
		this.spinButtonManager = new SpinButtonManager(this);
		this.howl = new Howl(AudioData as any);
		// Load Audio then load texture atlas
		this.howl.once('load', this.loadTextures.bind(this));
	}

	public getApp(): Application {return this.app;}
	public getNumUniqueSymbols(): number {return this.numUniqueSymbols;}
	public getNumReels(): number {return this.numReels;}
	public getHowl(): Howl {return this.howl;}
	public resetSpinButton(): void {this.spinButtonManager.getSpinButton().setIsEnabled(true);}
	public getReelManager(): ReelManager {return this.reelManager}

	private loadTextures(): void
	{
		// Load texture atlas then initialize
		this.loader.add('atlas', 'assets/images/atlas.json').load(this.onAssetsLoaded.bind(this));
	}

	private onAssetsLoaded(): void
	{
		// Initialize Reels & Button
		this.reelManager.createInitialReels();
		this.spinButtonManager.createSpinButton();
	}
}