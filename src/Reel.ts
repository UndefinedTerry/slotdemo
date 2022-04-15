import {Container, Loader, Sprite, Texture} from 'pixi.js';
import Core from './Core';

export default class Reel extends Container {

	symbols: Array<Sprite> = [];
	reelResult: Array<number> = [];
	core: Core;
	isDropping = false;

	constructor (core: Core, reelId: number) {
		super();
		this.core = core;
		this.reelResult = core.getReelResult(reelId);
		this.populateInitialSymbols();
		this.position.x = reelId * this.width;
	}

	private populateInitialSymbols(): void {
		for (let i = 0; i < 3; i++) {
			const symbol: Sprite = new Sprite(this.getReelSymbolTexture(i));
			Reel.positionAndAnchorSymbol(symbol, i);
			this.symbols.push(symbol);
			this.addChild(symbol);
		}
	}

	private static positionAndAnchorSymbol(symbol: Sprite, i: number):void {
		symbol.anchor.set(0.5);
		symbol.x = symbol.height * 0.5;
		symbol.position.y = ((i + 1) * symbol.height) - (symbol.height / 2);
	}

	private getReelSymbolTexture(index: number): Texture {
		const symbolNum = this.reelResult[index];
		const atlasTextures: any = Loader.shared.resources['atlas'].textures;
		return atlasTextures[`symbols/symbol_${symbolNum}.png`]
	}

}