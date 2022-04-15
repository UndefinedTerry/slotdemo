import SpinButton from './SpinButton';
import Core from './Core';

/**
 * Manager class, not much managing to do really just logically separates out function related to the Spin Button
 */
export default class SpinButtonManager {

	private core: Core;
	private spinButton: SpinButton | any;

	constructor (core: Core)
	{
		this.core = core;
	}

	public getSpinButton(): SpinButton {return this.spinButton;}

	public createSpinButton(): void
	{
		this.spinButton = new SpinButton();
		this.positionAnchorAndAddButton();
		this.spinButton.on('pointerup', () =>
		{
			if (this.spinButton.getIsEnabled())
				this.doSpinButtonPressed();
		});
	}

	private positionAnchorAndAddButton()
	{
		const app = this.core.getApp();
		this.spinButton.anchor.set(0.5);
		this.spinButton.position.y = app.renderer.height - (this.spinButton.height / 2);
		this.spinButton.position.x = (app.renderer.width / 2);
		app.stage.addChild(this.spinButton);
	}

	private doSpinButtonPressed(): void
	{
		this.core.getHowl().play('Start_Button');
		this.spinButton.setIsEnabled(false);
		this.core.getReelManager().getReelsArray().forEach((reel) =>
		{
			// Start the spin process by animating out the current icons, the spin itself is then chained
			reel.animateCurrentSymbolsOut();
		})
	}
}