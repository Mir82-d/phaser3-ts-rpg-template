import { Direction } from "grid-engine";
import * as Phaser from "phaser";

export default class TitleMenu extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key

    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.z_key = this.input.keyboard.addKey('Z');
    }
    
    preload() {
        this.load.atlasXML('ui-texture','assets/img/uipack_rpg_sheet.png','assets/img/uipack_rpg_sheet.xml')

        this.load.glsl('background', 'assets/shaders/background-blue.glsl.js');
    }

    create() {
        this.add.shader('Background_Blue', 0, 0, 800, 600).setOrigin(0);

        const{ width, height } = this.scale
        //set the background color
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 1)')

        //title
        const title = this.add.text(width*0.5, height*0.3,'title-text',{ "fontSize": "40px" }).setOrigin(0.5)
        title.text = "Game title here"

        //play
        const playButton = this.add.image(width*0.5, height*0.7,'ui-texture','buttonLong_blue.png')
        playButton.scaleX = 1.2
        playButton.setInteractive()

        this.add.text(playButton.x, playButton.y, 'はじめる').setOrigin(0.5)

        //settings
        const settingButton = this.add.image(width*0.5, playButton.y+playButton.displayHeight+10, 'ui-texture','buttonLong_blue.png')
        settingButton.scaleX = 1.2
        settingButton.setInteractive()

        this.add.text(settingButton.x, settingButton.y, 'せってい').setOrigin(0.5)

        //credits
        const creditsButton = this.add.image(width*0.5, settingButton.y+settingButton.displayHeight+10, 'ui-texture','buttonLong_blue.png')
        creditsButton.scaleX = 1.2
        creditsButton.setInteractive()

        this.add.text(settingButton.x, creditsButton.y, 'Credits').setOrigin(0.5)
        //push to buttons array
        this.buttons.push(playButton)
        this.buttons.push(settingButton)
        this.buttons.push(creditsButton)

        this.selectButton(0)

        playButton.on('selected', () => {
            playButton.setFrame('buttonLong_blue.png')
            this.scene.start('mapManager',{key:"testMap",pos:{x: 15,y: 21},dire:Direction.UP})
        })
        settingButton.on('selected', () => {
            settingButton.setFrame('buttonLong_blue.png')
            //TODO
        })
        creditsButton.on('selected', () => {
            creditsButton.setFrame('buttonLong_blue.png')
            //TODO
        })

        //for buttons animation
        playButton.on('pressing', () => {
            playButton.setFrame('buttonLong_blue_pressed.png')
        })
        settingButton.on('pressing', () => {
            settingButton.setFrame('buttonLong_blue_pressed.png')
        })
        creditsButton.on('pressing', () => {
            creditsButton.setFrame('buttonLong_blue_pressed.png')
        })

        //for mouse compatible
        playButton.on('pointerover',() =>{
            this.selectButton(0)
        })
        settingButton.on('pointerover',() =>{
            this.selectButton(1)
        })
        creditsButton.on('pointerover',() =>{
            this.selectButton(2)
        })
        playButton.on('pointerup',() =>{
            playButton.emit('selected')
        })
        settingButton.on('pointerup',() =>{
            settingButton.emit('selected')
        })
        creditsButton.on('pointerup',() =>{
            creditsButton.emit('selected')
        })
        playButton.on('pointerdown',() =>{
            playButton.emit('pressing')
        })
        settingButton.on('pointerdown',() =>{
            settingButton.emit('pressing')
        })
        creditsButton.on('pointerdown',() =>{
            creditsButton.emit('pressing')
        })
        
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
            playButton.off('selected')
            playButton.off('pointerover')
            playButton.off('pointerdown')
            playButton.off('pointerup')
            playButton.off('pressing')
            settingButton.off('selected')
            settingButton.off('pointerover')
            settingButton.off('pointerdown')
            settingButton.off('pointerup')
            settingButton.off('pressing')
            creditsButton.off('selected')
            creditsButton.off('pointerover')
            creditsButton.off('pointerdown')
            creditsButton.off('pointerup')
            creditsButton.off('pressing')
        })
    }   

    selectButton(index: number) {
        const currentButton = this.buttons[this.selectedButtonIndex]
        currentButton.setFrame('buttonLong_blue.png')
        // set the current selected button to a white tint
	    currentButton.setTint(0xffffff)

        const button = this.buttons[index]
        // set the newly selected button to a green tint
	    button.setTint(0x66ff7f)

        this.selectedButtonIndex = index
    }

    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change

        if(index >= this.buttons.length){
            index = 0
        }
        else if(index < 0){
            index = this.buttons.length-1
        }
        this.selectButton(index)
    }

    confirmSelection() {
        // get the currently selected button
	    const button = this.buttons[this.selectedButtonIndex]

        // emit the 'selected' event
	    button.emit('selected')
    }

    confirmPressing(){
        // get the currently selected button
	    const button = this.buttons[this.selectedButtonIndex]

        // emit the 'pressing' event
	    button.emit('pressing')
    }

    update() {
        const up = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        const down = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
        const z_up = Phaser.Input.Keyboard.JustUp(this.z_key)
        const z_down = Phaser.Input.Keyboard.JustDown(this.z_key)

        if(up){
            this.selectNextButton(-1)
        }
        else if(down){
            this.selectNextButton(1)
        }
        else if(z_up){
            this.confirmSelection()
        }
        else if(z_down){
            this.confirmPressing()
        }
    }
}