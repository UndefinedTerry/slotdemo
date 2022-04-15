import {Application} from 'pixi.js';
import {Actions} from 'pixi-actions';
import Core from './Core'

let core: Core;

const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;

const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: 1,
	antialias: true,
	autoDensity: true,
	backgroundColor: 0x000,
	width: GAME_WIDTH,
	height: GAME_HEIGHT
});

window.onload = () =>
{
	core = new Core(app);
	app.ticker.add(()=>{core.updateCore()});
	app.ticker.add((delta) => Actions.tick(delta / 60));
}
