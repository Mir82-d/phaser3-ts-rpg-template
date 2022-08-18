import * as Phaser from "phaser";
import { GameConfig } from "../config";
import { commandDatabase } from "../data/commandDB";
import { enemyDB } from "../data/enemyDB";
import { InGameMenu } from "../objects/InGameMenu";
import { Command } from "../type/Choice";
import { CommandDataBaseType } from "../type/CommandDataBaseType";
import { EnemyDatabaseType, EnemyInfo } from "../type/EnemyDatabaseType";
import eventCenter from "../util/EventCenter";

export class BattleScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key

    private allyTurn = 0
    private commands: CommandDataBaseType
    private enemyData: EnemyInfo
    private additionalEnemyData: EnemyInfo[] = []
    private spriteKey: string
    private enemyFrame: string
    private enemyID: string
    private enemies: Phaser.GameObjects.Image[] = []
    private menu: InGameMenu
    private menu2: InGameMenu
    private menu3: InGameMenu
    private menu4: InGameMenu

    constructor(){
        super(GameConfig)
        this.commands = commandDatabase
        
    }

    init(info: {id: string; frame: string; id_map: string; spriteKey: string}){
        this.enemyData = enemyDB[info.id]
        this.spriteKey = info.spriteKey
        this.enemyFrame = info.frame
        this.enemyID = info.id_map
        console.log(this.enemyData)
        //ランダムで敵を追加する処理を書く
    }

    preload(){
        if(this.enemyData.glslLocation != undefined){
            this.load.glsl('background',this.enemyData.glslLocation)
        }
        else if(this.enemyData.backImgLocation != undefined){
            this.load.image('background',this.enemyData.backImgLocation)
        }
        if(this.enemyData.enemyImgLocation != undefined){
            this.load.image('enemy',this.enemyData.enemyImgLocation)
        }
        //ランダムで追加した敵をpreloadする処理を書く
    }

    create(){
        this.cursors = this.input.keyboard.createCursorKeys()
        this.z_key = this.input.keyboard.addKey('Z')
        this.x_key = this.input.keyboard.addKey('X')
        this.scene.moveAbove('map','battleScene')

        const{ width, height } = this.scale
        if(this.enemyData.shaderName != undefined){
            this.add.shader(this.enemyData.shaderName, 0, 0, 800, 600).setOrigin(0)
        }
        else if(this.enemyData.backImgLocation != undefined){
            this.add.image(width*0.5,height*0.5,'background').setScale(800,600)
        }
        //TEST
        const fontStype = { color: 'white', fontSize: '30px' }
        const text1 = this.add.text(width*0.7,height*0.7,'Z: Win',fontStype)
        const text2 = this.add.text(width*0.7,height*0.8,'X: Escape',fontStype)

        //TODO 要変更
        if(this.enemyData.enemyImgLocation != undefined){
            const enemySprite = this.add.image(width*0.5,height*0.5,'enemy')
            enemySprite.scale = 4.0
        }
        else if(this.enemyData.enemyImgLocation == undefined){
            const enemySprite = this.add.image(width*0.5,height*0.5,this.spriteKey,this.enemyFrame)
            enemySprite.scale = 4.0
        }
        this.cameras.main.fadeIn(400)

        eventCenter.on('return',()=>{
            //TODO
        })
        eventCenter.on('command-selected',(command: Command)=>{
            this.commandHandler(command)
        })
    }

    update(){
        const z = Phaser.Input.Keyboard.JustDown(this.z_key)
        const x = Phaser.Input.Keyboard.JustDown(this.x_key)
        const left = Phaser.Input.Keyboard.JustDown(this.cursors.left)
        const right = Phaser.Input.Keyboard.JustDown(this.cursors.right)
        const up = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        const down = Phaser.Input.Keyboard.JustDown(this.cursors.down)
        if(z){
            eventCenter.emit('battle-win',this.enemyID)
        }
        else if(x){
            eventCenter.emit('battle-escape',this.enemyID)
        }
    }

    commandHandler(command: Command){
        switch(command.commandID){
            case 'fight':
                //TODO
                break
            case 'magic':
                //TODO
                break
            case 'guard':
                //TODO
                break
            case 'escape':
                //TODO
                break

            default:
                break
        }
    }

    createMenu(){

    }

    increaseTurn(){

    }
}