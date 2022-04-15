import {Container, Loader, Sprite, Texture} from 'pixi.js';
import {gsap, Power1} from 'gsap';
import Core from './Core';

export default class Reel extends Container {

	symbols: Array<Sprite> = [];
	reelResult: Array<number> = [];
	reelNumber: number;
	core: Core;

	constructor (core: Core, reelId: number)
	{
		super();
		this.core = core;
		this.reelResult = core.getReelManager().generateNewReelResult();
		this.populateInitialSymbols();
		this.position.x = reelId * this.width;
		this.reelNumber = reelId;
	}

	public animateCurrentSymbolsOut(): void
	{
		// Drops away all the current symbols, then moves the chain along the chain
		const timeline = gsap.timeline({onComplete: this.clearOldSymbolsAndCreateNewOnes.bind(this)});

		// Little randomization to order the tiles drop away
		if (Math.random() > 0.49)
			this.symbols.reverse();

		this.symbols.forEach((symbol) =>
		{
			timeline.to(symbol, {
				delay: 0.1 + (0.025 * this.reelNumber),
				duration: 0.3,
				rotation: (Math.random()-Math.random()), // Slight rotation for visual collapse feel
				y: this.core.getApp().renderer.height + symbol.height,
				ease: Power1.easeIn,
			}, '<25%');
		});

	}

	private populateInitialSymbols(): void
	{
		for (let i = 0; i < 3; i++) {
			const symbol: Sprite = new Sprite(this.getReelSymbolTexture(i));
			this.positionAndAnchorSymbol(symbol, i);
			this.symbols.push(symbol);
			this.addChild(symbol);
		}
	}

	private populateNewSymbols(): void
	{
		for (let i = 0; i < 3; i++)
		{
			const symbol: Sprite = new Sprite(this.getReelSymbolTexture(i));
			this.positionAndAnchorSymbol(symbol, i);
			this.positionAsNewSymbol(symbol);
			this.symbols.push(symbol);
			this.addChild(symbol);
		}
	}

	private positionAsNewSymbol(symbol: Sprite): void
	{
		symbol.position.y -= this.core.getApp().renderer.height;
	}

	private positionAndAnchorSymbol(symbol: Sprite, i: number):void
	{
		symbol.anchor.set(0.5);
		symbol.x = symbol.height * 0.5;
		symbol.position.y = ((i + 1) * symbol.height) - (symbol.height / 2);
	}

	private getReelSymbolTexture(index: number): Texture
	{
		const symbolNum = this.reelResult[index];
		const atlasTextures: any = Loader.shared.resources['atlas'].textures;
		return atlasTextures[`symbols/symbol_${symbolNum}.png`];
	}

	private clearOldSymbolsAndCreateNewOnes(): void
	{
		// Remove old symbols from the stage and from the array, then go fetch what the new ones should be from the core and move the chain along
		this.clearOldSymbols();
		this.reelResult = this.core.getReelManager().generateNewReelResult();
		this.populateNewSymbols();
		this.animateNewSymbolsIn();
	}

	private animateNewSymbolsIn(): void
	{
		// Drop in the new symbols, fairly uniform drop for predictability, check if we're the last reel to animate
		const timeline = gsap.timeline({onComplete: this.checkIfLastReelAndResetButtonState.bind(this)});
		this.symbols.reverse().forEach((symbol) =>
		{
			timeline.to(symbol, {
				delay: 0.1+(0.05*this.reelNumber),
				duration: 0.3,
				y: symbol.position.y + this.core.getApp().renderer.height,
				angle: 0,
				ease: Power1.easeInOut,
				onComplete: () => {
					this.core.getHowl().play(`Reel_Stop_${this.reelNumber+1}`);
				},
			}, '<200%');
		});

	}

	private checkIfLastReelAndResetButtonState(): void
	{
		// Just check if we're the final reel and if so the full spin animation has completed
		if (this.reelNumber === (this.core.getNumReels() - 1))
		{
			this.core.resetSpinButton();
		}
	}

	private clearOldSymbols(): void
	{
		this.symbols.forEach((symbol) =>
		{
			symbol.parent.removeChild(symbol);
		});
		this.symbols = [];
	}


}