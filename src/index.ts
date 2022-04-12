import {Application} from 'pixi.js';
import {Actions} from 'pixi-actions';
import Core from './Core'

let core: Core;

// This is 99.999% likely not the best way to handle rescaling for mobile.
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;
let xScale = 1;
let yScale = 1;

if (window.innerWidth < GAME_WIDTH) {xScale = (window.innerWidth / GAME_WIDTH);}
if (window.innerHeight < GAME_HEIGHT) {yScale = (window.innerHeight / GAME_HEIGHT);}

const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: 1,
	antialias: true,
	autoDensity: true,
	backgroundColor: 0x000,
	width: GAME_WIDTH * xScale,
	height: GAME_HEIGHT * yScale
});

window.onload = () =>
{
	core = new Core();
	app.ticker.add(()=>{core.updateCore()});
	app.ticker.add((delta) => Actions.tick(delta / 60));
}
