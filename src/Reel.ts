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
		this.reelResult = core.generateNewReelResult();
		this.populateInitialSymbols();
		this.position.x = reelId * this.width;
		this.reelNumber = reelId;
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

	public animateCurrentSymbolsOut(): void
	{
		const timeline = gsap.timeline({onComplete: this.clearOldSymbolsAndCreateNewOnes.bind(this)});
		this.symbols.forEach((symbol) =>
		{
			timeline.to(symbol, {
				delay: 0.1 + (0.025 * this.reelNumber),
				duration: 0.3,
				y: this.core.getApp().renderer.height + symbol.height,
				ease: Power1.easeIn,
			});
		});

	}

	private clearOldSymbolsAndCreateNewOnes(): void
	{
		this.clearOldSymbols();
		this.reelResult = this.core.generateNewReelResult();
		this.populateNewSymbols();
		this.animateNewSymbolsIn();
	}

	private animateNewSymbolsIn(): void
	{
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
					this.playRandomReelStopSound();
				},
			}, '<50%');
		});

	}

	private checkIfLastReelAndResetButtonState(): void
	{
		if (this.reelNumber === (this.core.getNumReels() - 1))
		{
			this.core.resetSpinButton();
		}
	}

	private playRandomReelStopSound(): void
	{
		const id = Math.floor(Math.random() * 5 + 1);
		this.core.getHowl().play('Reel_Stop_' + id);
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