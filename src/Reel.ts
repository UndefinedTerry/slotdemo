import {Container, Loader, Sprite, Texture} from 'pixi.js';
import {gsap, Power1} from 'gsap';
import Core from './Core';

export default class Reel extends Container {

	symbols: Array<Sprite> = [];
	reelResult: Array<number> = [];
	reelNumber: number;
	core: Core;

	constructor (core: Core, reelId: number) {
		super();
		this.core = core;
		this.reelResult = core.generateNewReelResult();
		this.populateInitialSymbols();
		this.position.x = reelId * this.width;
		this.reelNumber = reelId;
	}

	private populateInitialSymbols(): void {
		for (let i = 0; i < 3; i++) {
			const symbol: Sprite = new Sprite(this.getReelSymbolTexture(i));
			this.positionAndAnchorSymbol(symbol, i);
			this.symbols.push(symbol);
			this.addChild(symbol);
		}
	}

	private populateNewSymbols(): void {
		for (let i = 0; i < 3; i++) {
			const symbol: Sprite = new Sprite(this.getReelSymbolTexture(i));
			this.positionAndAnchorSymbol(symbol, i);
			this.positionAsNewSymbol(symbol);
			this.symbols.push(symbol);
			this.addChild(symbol);
		}
	}

	private positionAsNewSymbol(symbol: Sprite)
	{
		symbol.position.y -= this.core.getApp().renderer.height;
		//symbol.rotation = Math.random()*720-360;
	}

	private positionAndAnchorSymbol(symbol: Sprite, i: number):void {
		symbol.anchor.set(0.5);
		symbol.x = symbol.height * 0.5;
		symbol.position.y = ((i + 1) * symbol.height) - (symbol.height / 2);
	}

	private getReelSymbolTexture(index: number): Texture {
		const symbolNum = this.reelResult[index];
		const atlasTextures: any = Loader.shared.resources['atlas'].textures;
		return atlasTextures[`symbols/symbol_${symbolNum}.png`];
	}

	public animateCurrentSymbolsOut()
	{
		const timeline = gsap.timeline({onComplete: () => {
			this.clearOldSymbols();
			this.reelResult = this.core.generateNewReelResult();
			this.animateNewSymbolsIn();
		}});
		timeline.pause();
		this.symbols.forEach((symbol) =>
		{
			timeline.to(symbol, {
				delay: 0.1+(0.05*this.reelNumber),
				duration: 0.3,
				y: this.core.getApp().renderer.height + symbol.height,
				ease: Power1.easeIn,
			});
		});
		timeline.play();
	}

	private animateNewSymbolsIn()
	{
		this.populateNewSymbols();
		const timeline = gsap.timeline({onComplete: () => {
			if (this.reelNumber === (this.core.getNumReels()-1))
			{
				this.core.resetSpinButton();
			}
		}});
		timeline.pause();
		this.symbols.reverse();
		this.symbols.forEach((symbol) =>
		{
			timeline.to(symbol, {
				delay: 0.1+(0.05*this.reelNumber),
				duration: 0.3,
				y: symbol.position.y + this.core.getApp().renderer.height,
				angle: 0,
				ease: Power1.easeInOut,
				onComplete: () => {
					const id = Math.floor(Math.random() * 5 + 1);
					this.core.getHowl().play('Reel_Stop_' + id);
				},
			}, '<50%');
		});
		timeline.play();
	}

	private clearOldSymbols()
	{
		this.symbols.forEach((symbol) =>
		{
			symbol.parent.removeChild(symbol);
		});
		this.symbols = [];
	}


}