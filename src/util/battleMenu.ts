
// You can write more code here

/* START OF COMPILED CODE */

//import * as Phaser from "phaser";
/* START-USER-IMPORTS */
import * as Phaser from "phaser";
/* END-USER-IMPORTS */

export default class BattleMenu extends Phaser.Scene {

	constructor() {
		super("BattleMenu");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	create(): void {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
