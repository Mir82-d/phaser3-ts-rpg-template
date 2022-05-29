import * as Phaser from "phaser";
import { GameConfig } from "../config";
// You can write more code here

/* START OF COMPILED CODE */

export default class BattleMenu extends Phaser.Scene {

	constructor() {
		super(GameConfig);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	create(): void {
		this.scene.bringToTop()
		// status_ally1
		const status_ally1 = this.add.rectangle(151, 483, 128, 150);
		status_ally1.isFilled = true;
		status_ally1.fillColor = 0;
		status_ally1.isStroked = true;

		// status_ally2
		const status_ally2 = this.add.rectangle(325, 483, 128, 150);
		status_ally2.isFilled = true;
		status_ally2.fillColor = 0;
		status_ally2.isStroked = true;

		// status_ally3
		const status_ally3 = this.add.rectangle(503, 483, 128, 150);
		status_ally3.isFilled = true;
		status_ally3.fillColor = 0;
		status_ally3.isStroked = true;

		// status_ally4
		const status_ally4 = this.add.rectangle(670, 483, 128, 150);
		status_ally4.isFilled = true;
		status_ally4.fillColor = 0;
		status_ally4.isStroked = true;

		// layer_1
		const layer_1 = this.add.layer();

		// selectRectangle
		const selectRectangle = this.add.rectangle(230, 121, 320, 128);
		selectRectangle.isFilled = true;
		selectRectangle.fillColor = 196608;
		selectRectangle.isStroked = true;
		layer_1.add(selectRectangle);

		// fight
		const fight = this.add.text(129, 90, "", {});
		fight.text = "たたかう";
		fight.setStyle({ "fontSize": "20px" });
		layer_1.add(fight);

		// magic
		const magic = this.add.text(129, 131, "", {});
		magic.text = "まほう";
		magic.setStyle({ "fontSize": "20px" });
		layer_1.add(magic);

		// guard
		const guard = this.add.text(256, 90, "", {});
		guard.text = "ガード";
		guard.setStyle({ "fontSize": "20px" });
		layer_1.add(guard);

		// text
		const text = this.add.text(256, 131, "", {});
		text.text = "にげる";
		text.setStyle({ "fontSize": "20px" });
		layer_1.add(text);

		// eventLogWindow
		const eventLogWindow = this.add.rectangle(399, 121, 500, 128);
		eventLogWindow.isFilled = true;
		eventLogWindow.fillColor = 0;
		eventLogWindow.isStroked = true;

		// eventLog
		const eventLog = this.add.text(179, 85, "", {});
		eventLog.text = "New text";
		eventLog.setStyle({ "fontSize": "20px", "maxLines":2});
		eventLog.setWordWrapWidth(410);

		// layer_2
		const layer_2 = this.add.layer();

		this.layer_1 = layer_1;
		this.selectRectangle = selectRectangle;
		this.fight = fight;
		this.magic = magic;
		this.guard = guard;
		this.text = text;
		this.layer_2 = layer_2;

		this.events.emit("scene-awake");
	}

	private layer_1!: Phaser.GameObjects.Layer;
	private selectRectangle!: Phaser.GameObjects.Rectangle;
	private fight!: Phaser.GameObjects.Text;
	private magic!: Phaser.GameObjects.Text;
	private guard!: Phaser.GameObjects.Text;
	private text!: Phaser.GameObjects.Text;
	private layer_2!: Phaser.GameObjects.Layer;

	/* START-USER-CODE */

	// Write your code here

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
