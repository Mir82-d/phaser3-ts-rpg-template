import { ButtonSelector, ButtonSelectorConfig } from "../objects/ButtonSelector";
import { InGameMenu, InGameMenuConfig } from "../objects/InGameMenu";
import { Command } from "../type/Choice";

export class MenuTest extends Phaser.Scene {

    private commands: Command[]
    private ingameMenu: InGameMenu
    private ingameMenu2: InGameMenu
    private placedButtons: Phaser.GameObjects.Text[] = []
    private bs: ButtonSelector

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key
    private v_key!: Phaser.Input.Keyboard.Key

    init(){
        this.cursors = this.input.keyboard.createCursorKeys()
        this.z_key = this.input.keyboard.addKey('Z');
        this.x_key = this.input.keyboard.addKey('X');
        this.v_key = this.input.keyboard.addKey('V')
        this.commands = [
            {text: 'たたかう', commandID: 'fight'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'にげる', commandID: 'escape'},
            {text: 'グッズ', commandID: 'inventory'},
        ]
    }

    preload(){

    }

    create(){
        const { width, height } = this.scale
        const config: InGameMenuConfig = {
            x: width*0.2,
            y: height*0.2,
            line: 2,
            column: 2,
        }
        this.ingameMenu = new InGameMenu(this, config)
        this.ingameMenu.setupMenu(this.commands,true,"てすとマン")
        this.add.existing(this.ingameMenu)

        /* this.placedButtons = this.ingameMenu.getButtons()
        const buttonSelectorConfig: ButtonSelectorConfig = {
            enableArrow: true,
            enableTint: false
        }
        this.bs = new ButtonSelector(this,buttonSelectorConfig)
        this.bs.selectButton(0,this.placedButtons) */
    }

    createNewMenu(){
        const config2: InGameMenuConfig = {
            x: this.scale.width*0.3,
            y: this.scale.height*0.2,
            line: 2,
            column: 3,
        }
        this.ingameMenu2 = new InGameMenu(this, config2)
        this.ingameMenu2.setupMenu(this.commands,true,"てすとマン2")
        this.add.existing(this.ingameMenu2)
    }

    switchMenu(){

    }

    update(time: number, delta: number): void {
        const up = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        const down = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
        const left = Phaser.Input.Keyboard.JustDown(this.cursors.left!)
        const right = Phaser.Input.Keyboard.JustDown(this.cursors.right!)
        const z = Phaser.Input.Keyboard.JustUp(this.z_key!)
        const x = Phaser.Input.Keyboard.JustDown(this.x_key!)
        const v = Phaser.Input.Keyboard.JustDown(this.v_key)

        if(x){
            if(this.ingameMenu.visible){
                this.ingameMenu.destroy()
            }
            else if(this.ingameMenu2.visible){
                this.ingameMenu2.destroy()
            }
        }
        else if(v){
            this.createNewMenu()
        }
    }
}