import * as Phaser from "phaser";
import { soundDB } from "../data/soundDB";

export default class TitleMenu extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private hoverSe: any
    private forwardSe: any
    private errorSe: any
    private backSe: any

    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.z_key = this.input.keyboard.addKey('Z');
    }
    
    preload() {
        this.load.atlasXML('ui-texture','assets/img/uipack_rpg_sheet.png','assets/img/uipack_rpg_sheet.xml')

        this.load.glsl('background', 'assets/shaders/background-blue.glsl.js')

        this.load.audio('menu_hover',soundDB["se"].menu_hover.path)
        this.load.audio('menu_forward',soundDB["se"].menu_forward.path)
        this.load.audio('menu_error',soundDB["se"].menu_error.path)
        this.load.audio('menu_back',soundDB["se"].menu_back.path)
    }

    create() {
        this.add.shader('Background_Blue', 0, 0, 800, 600).setOrigin(0);
        //clear buttons array when restart this scene
        this.buttons.length = 0

        const{ width, height } = this.scale
        //set the background color
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 1)')

        //title
        const title = this.add.text(width*0.5, height*0.3,'title-text',{ "fontSize": "40px" }).setOrigin(0.5)
        title.text = "Game title here"

        //play
        const playButton = this.add.image(width*0.5, height*0.65,'ui-texture','buttonLong_blue.png')
        playButton.scaleX = 1.2
        playButton.setInteractive()

        this.add.text(playButton.x, playButton.y, 'はじめる').setOrigin(0.5)

        //continue
        const continueButton = this.add.image(width*0.5, playButton.y+playButton.displayHeight+10, 'ui-texture','buttonLong_blue.png')
        continueButton.scaleX = 1.2
        continueButton.setInteractive()

        this.add.text(continueButton.x,continueButton.y, 'つづける').setOrigin(0.5)

        //settings
        const settingButton = this.add.image(width*0.5, continueButton.y+continueButton.displayHeight+10, 'ui-texture','buttonLong_blue.png')
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
        this.buttons.push(continueButton)
        this.buttons.push(settingButton)
        this.buttons.push(creditsButton)

        this.selectButton(0)

        //sound
        this.hoverSe = this.sound.add('menu_hover')
        this.errorSe = this.sound.add('menu_error')
        this.forwardSe = this.sound.add('menu_forward')
        this.backSe = this.sound.add('menu_back')

        playButton.on('selected', () => {
            playButton.setFrame('buttonLong_blue.png')
            this.scene.start('gameManager',{isFirst: true})
            this.scene.stop()
        })
        continueButton.on('selected', () => {
            continueButton.setFrame('buttonLong_blue.png')
            //TODO
            if(localStorage.getItem('saveFile')==null){
                console.error("Save data does not exits.")
            }
            else{
                this.scene.start('gameManager',{isFirst: false})
                this.scene.stop()
            }
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
        continueButton.on('pressing', () => {
            continueButton.setFrame('buttonLong_blue_pressed.png')
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
        continueButton.on('pointerover',() =>{
            this.selectButton(1)
        })
        settingButton.on('pointerover',() =>{
            this.selectButton(2)
        })
        creditsButton.on('pointerover',() =>{
            this.selectButton(3)
        })
        playButton.on('pointerup',() =>{
            playButton.emit('selected')
        })
        continueButton.on('pointerup',() =>{
            continueButton.emit('selected')
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
        continueButton.on('pointerdown',() =>{
            continueButton.emit('pressing')
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
            continueButton.off('selected')
            continueButton.off('pointerover')
            continueButton.off('pointerdown')
            continueButton.off('pointerup')
            continueButton.off('pressing')
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
            this.hoverSe.play()
        }
        else if(down){
            this.selectNextButton(1)
            this.hoverSe.play()
        }
        else if(z_up){
            this.confirmSelection()
            this.forwardSe.play()
        }
        else if(z_down){
            this.confirmPressing()
        }
    }
}