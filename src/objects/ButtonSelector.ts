import * as Phaser from "phaser";

/**
 * Config of ButtonSelector
 * @enableArrow whether to turn on the pointer
 * @enableTint whether to accept input
 * @depth the depth of ButtonSelector
 */
export type ButtonSelectorConfig = {
    enableArrow: boolean,
    enableTint: boolean,
    depth?: number
}

export class ButtonSelector extends Phaser.GameObjects.Container{

    private selectedButtonIndex = 0
    private config: ButtonSelectorConfig
    private buttonSelector!: Phaser.GameObjects.Image

    constructor(public scene: Phaser.Scene,{ enableArrow, enableTint, depth }:ButtonSelectorConfig){
        super(scene,0,0)
        
        this.config = {enableArrow,enableTint}
        //replace texture on your own
        if(enableArrow){
            scene.load.atlasXML('ui-texture','assets/img/uipack_rpg_sheet.png','assets/img/uipack_rpg_sheet.xml')
            this.buttonSelector = new Phaser.GameObjects.Image(this.scene,0,0,'ui-texture',"arrowSilver_right.png")
            this.add(this.buttonSelector)
            //this.scene.add.existing(this.buttonSelector)
        }
        if(depth){
            this.buttonSelector.depth = depth
        }
    }

    /**
     * Select the button.
     * @param index index of the selected button
     * @param buttonsArray the array of buttons
     */
    public selectButton(index: number,buttonsArray: any) {
        const currentButton = buttonsArray[this.selectedButtonIndex]
        const button = buttonsArray[index]

        if(this.config.enableTint){
            // set the current selected button to a white tint
	        currentButton.setTint(0xffffff)

	        // set the newly selected button to a green tint
	        button.setTint(0x66ff7f)
        }
	    
        if(this.config.enableArrow){
            // move the cursor to the left edge
	        this.buttonSelector.x = button.x - button.displayWidth / 2 - 20
	        this.buttonSelector.y = button.y - 2
        }

	    // store the new selected index
	    this.selectedButtonIndex = index
    }

    /**
     * Select nex button.
     * @param change number of indices to change
     * @param buttonsArray the array of buttons
     */
    public selectNextButton(change = 1,buttonsArray: any) {
        let index = this.selectedButtonIndex + change

        if(index >= buttonsArray.length){
            index = 0
        }
        else if(index < 0){
            index = buttonsArray.length-1
        }
        this.selectButton(index,buttonsArray)
    }
    /**
     * Confirm the button selection.
     * @param buttonsArray the array of buttons
     */
    public confirmSelection(buttonsArray: any) {
        // get the currently selected button
	    const button = buttonsArray[this.selectedButtonIndex]

        // emit the 'selected' event
	    button.emit('selected',this.selectedButtonIndex)
    }
    /**
     * Get the selected button index.
     * @returns selected button index
     */
    public getSelectedIndex(){
        return this.selectedButtonIndex
    }
}