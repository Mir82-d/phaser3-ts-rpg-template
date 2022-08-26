import * as Phaser from "phaser";
import { commandDatabase } from "../data/commandDB";
import { InGameMenu, InGameMenuConfig } from "../objects/InGameMenu"
import { Command } from "../type/Choice";
import { CommandDataBaseType } from "../type/CommandDataBaseType";
import eventCenter from "./EventCenter";

export class MapMenu extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key

    private layer_1!: Phaser.GameObjects.Layer;
    private layer_2!: Phaser.GameObjects.Layer;
    private layer_3!: Phaser.GameObjects.Layer;
    private mainMenu: InGameMenu
    private magicMenu: InGameMenu
    private allyMenu: InGameMenu
    private operation: boolean //このシーンで操作権があるかのフラグ

    private charIDs: string[]
    private charIndex: number
    private commandDB: CommandDataBaseType
    private mainCommand: Command[]

    private selectedCommand: string[] //選択されたコマンドidを格納する配列

    init(data: { charIDs: string[];}) {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.z_key = this.input.keyboard.addKey('Z');
        this.x_key = this.input.keyboard.addKey('X');

        this.charIDs = data.charIDs
        this.commandDB = commandDatabase
        this.mainCommand = [
            {text: 'つよさ', commandID: 'status'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'もちもの', commandID: 'inventory'},
            {text: 'おわる', commandID: 'exit'},
        ]
        this.charIndex = 0
        this.operation = false
    }

    preload(){
        
    }

    create(){
        this.scene.bringToTop()
        const{ width, height } = this.scale
        //'X'が押されたときのイベント
        eventCenter.on('return',()=>{
            this.menuTransitionHandler()
        })
        //'Z'が押されたときのイベント
        eventCenter.on('command-selected',(command: Command)=>{
            //TODO
            console.log(command.commandID)
            this.commandHandler(command)
        })
        this.events.on('menu-close',()=>{
            this.scene.resume('map')
            this.scene.stop()
        })

        const config: InGameMenuConfig = {
            x: width*0.2,
            y: height*0.2,
            line: 2,
            column: 2,
        }
        this.mainMenu = new InGameMenu(this, config)

        const config_magic: InGameMenuConfig = {
            x: width*0.7,
            y: height*0.2,
            line: 2,
            column: 3,
        }
        this.magicMenu = new InGameMenu(this, config_magic)

        const config_ally: InGameMenuConfig = {
            x: width*0.6,
            y: height*0.4,
            line: 1,
            column: 4,
        }
        this.allyMenu = new InGameMenu(this, config_ally)

        this.mainMenu.setupMenu(this.mainCommand,true)
        this.add.existing(this.mainMenu)
        const arrowRight = this.add.image(width*0.85,height*0.1,
            'ui-texture',"arrowSilver_right.png")
        const arrowLeft = this.add.image(width*0.80,height*0.1,
            'ui-texture',"arrowSilver_left.png")
        this.layer_1 = this.add.layer()
        this.layer_1.add(arrowLeft)
        this.layer_1.add(arrowRight)
        this.layer_1.setDepth(2)
        this.layer_1.setVisible(false)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            this.events.off('menu-close')
        })
    }

    update(){
        const z = Phaser.Input.Keyboard.JustDown(this.z_key)
        const x = Phaser.Input.Keyboard.JustDown(this.x_key)
        const left = Phaser.Input.Keyboard.JustDown(this.cursors.left)
        const right = Phaser.Input.Keyboard.JustDown(this.cursors.right)
        if(this.layer_1.visible && this.operation){
            //TODO
            //誰の魔法かを選ぶ処理
            if(z){
                this.magicMenu.enableInput()
                this.layer_1.setVisible(false)
                this.operation = false
            }
            else if(x){
                this.menuTransitionHandler()
            }
            else if(left){
                this.changeMenuEntry(this.magicMenu,-1)
            }
            else if(right){
                this.changeMenuEntry(this.magicMenu,1)
            }
        }
    }

    commandHandler(command: Command){
        switch(command.commandID){
            case 'exit':
                eventCenter.emit("back-to-title")
                this.scene.stop()
                break
            case 'magic':
                this.createMagicMenu()
                this.time.delayedCall(300,()=>{
                    this.operation = true
                })
                break
            case 'magic1':
            case 'magic2':
            case 'magic3':
            case 'magic4':
                this.createAllySelectMenu()
                break
            default:
                break
        }
    }

    //メニューを閉じるときの処理
    menuTransitionHandler(){
        if(this.allyMenu.displayList && this.allyMenu.visible){
            this.allyMenu.disableInput()
            this.allyMenu.setVisible(false)
            this.magicMenu.enableInput()
        }
        else if(this.magicMenu.displayList && this.magicMenu.visible && this.layer_1.visible){
            this.magicMenu.disableInput()
            this.magicMenu.setVisible(false)
            this.layer_1.setVisible(false)
            this.mainMenu.enableInput()
            this.operation = false
        }
        else if(this.magicMenu.displayList && this.magicMenu.visible){
            this.magicMenu.disableInput()
            this.layer_1.setVisible(true)
            this.operation = true
        }
        else{
            this.events.emit('menu-close')
        }
    }

    createMagicMenu(){
        this.mainMenu.disableInput()
        this.magicMenu.setupMenu(this.commandDB[this.charIDs[0]].healMagics,false,this.commandDB[this.charIDs[0]].name)
        this.add.existing(this.magicMenu)
        this.magicMenu.setVisible(true)
        this.layer_1.setVisible(true)
    }

    createAllySelectMenu(){
        this.magicMenu.disableInput()
        let allyList: Command[] = []
        this.charIDs.forEach((id)=>{
            allyList.push({text:this.commandDB[id].name,commandID:id})
        })
        if(this.allyMenu.displayList){
            this.allyMenu.resetMenu(allyList,true)
            this.add.existing(this.allyMenu)
        }
        else{
            this.allyMenu.setupMenu(allyList,true)
            this.add.existing(this.allyMenu)
        }
        this.allyMenu.setVisible(true)
    }

    changeMenuEntry(menu: InGameMenu,change: number){
        let index = this.charIndex + change
        if(index >= this.charIDs.length){
            index = 0
        }
        else if(index < 0){
            index = this.charIDs.length-1
        }
        //menu.removeAll()
        menu.resetMenu(this.commandDB[this.charIDs[index]].healMagics,false,this.commandDB[this.charIDs[index]].name)
        this.charIndex = index
    }
}