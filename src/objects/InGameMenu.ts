import * as Phaser from "phaser";
import { Command } from "../type/Choice";
import eventCenter from "../util/EventCenter";
import { ButtonSelector, ButtonSelectorConfig } from "./ButtonSelector";

export type InGameMenuConfig = {
    x: number,
    y: number,
    line: number,
    column: number,
    padding?: number,
    margin?: number,
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
}

export class InGameMenu extends Phaser.GameObjects.Container{

    private panel: Phaser.GameObjects.Image
    private buttons: Phaser.GameObjects.Text[] = []
    private bs: ButtonSelector

    private line: number
    private column: number
    private x_cordinate: number
    private y_cordinate: number
    private padding: number
    private margin: number
    private textStyle: Phaser.Types.GameObjects.Text.TextStyle

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key

    constructor(public scene: Phaser.Scene,{x, y, line, column,padding = 10, margin = 10, textStyle={font:"20px"}}: InGameMenuConfig){
        super(scene,0,0)
        //replace texture on your own
        this.scene.load.atlasXML('ui-texture','assets/img/uipack_rpg_sheet.png','assets/img/uipack_rpg_sheet.xml')
        this.panel = new Phaser.GameObjects.Image(scene, x, y, 'ui-texture','panel_blue.png')

        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this.z_key = this.scene.input.keyboard.addKey('Z');
        this.x_key = this.scene.input.keyboard.addKey('X');

        this.line = line
        this.column = column
        this.padding = padding
        this.textStyle = textStyle
    }

    public setupMenu(commands: Command[],name?: string,enableInput?: boolean){
        if(commands.length === 0){
            return
        }
        
        const buttonHeight = 40,buttonWidth = 110,buttonMargin = 10
        const buttonGroupHeight = buttonHeight * this.line + buttonMargin * (this.line - 1)
        const buttonGroupWidth = buttonWidth * this.column + buttonMargin * this.column
        const panelWidth = buttonGroupWidth + 30
        const panelHeight = buttonGroupHeight + 30
        const buttonGroupOriginY = this.panel.y - 20*(this.line - 1)
        const buttonGroupOriginX = this.panel.x - 45*(this.column - 1)

        this.panel.setDisplaySize(panelWidth,panelHeight)
        this.add(this.panel)
        this.scene.add.existing(this.panel)

        if(name){
            this.setMenuName(name)
        }
        
        let index = 0
        for(let i=0; i<this.column;i++){
            const x = buttonGroupOriginX + (buttonWidth + buttonMargin) * i
            for(let j=0;j<this.line;j++){
                const y = buttonGroupOriginY + buttonHeight * j
                if(index < commands.length){
                    const button = new Phaser.GameObjects.Text(this.scene, x, y, commands[index].text, this.textStyle).setOrigin(0.5)
                    const command = commands[index]
                    button.on('selected',(index: number)=>{
                        //TODO
                        console.log(command.commandID)
                        console.log(index)
                        //path commandID to the scene through this event
                        eventCenter.emit('command-selected',command.commandID)
                    })
                    button.setInteractive({
                        useHandCursor: true
                    })
                    button.on('pointerdown',()=>{
                        console.log(command.commandID)
                    })
                    this.add(button)
                    this.scene.add.existing(button)
                    this.buttons.push(button)
                }
                index++
            }
        }
        if(enableInput){
            this.setupButtonSelector()
        }
    }
    setMenuName(name: string){
        const nameText = new Phaser.GameObjects.Text(this.scene, this.panel.x - this.panel.displayWidth/2 + 20, this.panel.y - this.panel.displayHeight/2 - 10, '', this.textStyle).setOrigin(0.5)
        const nameRect = new Phaser.GameObjects.Image(this.scene,nameText.x ,nameText.y,'ui-texture','buttonLong_blue.png')
        nameText.setText(name)
        const bounds = nameText.getBounds()
        nameRect.displayWidth = bounds.width + this.padding*2

        this.add(nameRect)
        this.add(nameText)
        this.scene.add.existing(nameRect)
        this.scene.add.existing(nameText)
    }
    setupButtonSelector(){
        const buttonSelectorConfig: ButtonSelectorConfig = {
            enableArrow: true,
            enableTint: false
        }
        this.bs = new ButtonSelector(this.scene,buttonSelectorConfig)
        this.bs.selectButton(0,this.buttons)
        this.z_key.on('down',()=>{
            this.bs.confirmSelection(this.buttons)
        })
        this.cursors.up.on('down',()=>{
            this.bs.selectNextButton(-1,this.buttons)
        })
        this.cursors.down.on('down',()=>{
            this.bs.selectNextButton(1,this.buttons)
        })
        this.cursors.left.on('down',()=>{
            this.bs.selectNextButton(-this.line,this.buttons)
        })
        this.cursors.right.on('down',()=>{
            this.bs.selectNextButton(this.line,this.buttons)
        })
        this.x_key.on('down',()=>{
            //TODO
        })
    }
    public getButtons(){
        return this.buttons
    }
}