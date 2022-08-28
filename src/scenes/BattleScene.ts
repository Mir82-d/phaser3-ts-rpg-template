import * as Phaser from "phaser";
import { DataManager } from "../class/DataManager";
import { GameConfig } from "../config";
import { commandDatabase } from "../data/commandDB";
import { enemyDB } from "../data/enemyDB";
import { InGameMenu } from "../objects/InGameMenu";
import { CharacterDatabaseType } from "../type/CharacerDatabaseType";
import { Command } from "../type/Choice";
import { CommandDataBaseType } from "../type/CommandDatabaseType";
import { EnemyDatabaseType, EnemyInfo } from "../type/EnemyDatabaseType";
import eventCenter from "../util/EventCenter";

export class BattleScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key

    private dataManager: DataManager

    private allyTurn = 0
    private commands: CommandDataBaseType
    private characterData: CharacterDatabaseType
    private enemyData: EnemyInfo
    private allEnemyData: EnemyInfo[] = []
    private enemyQuantity: number
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
        this.dataManager = new DataManager()
        this.commands = commandDatabase
    }

    init(info: {id: string; frame: string; id_map: string; spriteKey: string}){
        //character data
        this.characterData = this.dataManager.getStatus()
        console.log(this.characterData)

        this.enemyData = enemyDB[info.id]
        this.spriteKey = info.spriteKey
        this.enemyFrame = info.frame
        this.enemyID = info.id_map
        this.allEnemyData.push(this.enemyData)
        //ランダムで敵を追加する処理
        if(this.enemyData.co_spawn != undefined){
            if(this.enemyData.max_co_spawn == undefined){
                this.enemyData.max_co_spawn = 3
            }
            this.enemyQuantity = this.getRandomInt(0,this.enemyData.max_co_spawn)
            for(let i=0;i<this.enemyQuantity;i++){
                let index = this.getRandomInt(0,this.enemyData.co_spawn.length-1)
                let tmp_enemyData = enemyDB[this.enemyData.co_spawn[index]]
                this.allEnemyData.push(tmp_enemyData)
            }
        }
    }

    preload(){
        if(this.enemyData.glslLocation != undefined){
            this.load.glsl('background',this.enemyData.glslLocation)
        }
        else if(this.enemyData.backImgLocation != undefined){
            this.load.image('background',this.enemyData.backImgLocation)
        }
        //追加した敵素材をpreloadする
        this.allEnemyData.forEach((data,index)=>{
            if(data.enemyImgLocation != undefined){
                this.load.image('enemy'+index.toString(),this.enemyData.enemyImgLocation)
            }
        })
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
        this.setUpEnemy()

        console.log(this.enemies.length,this.enemies,this.allEnemyData)
        this.cameras.main.fadeIn(400)

        eventCenter.on('return',()=>{
            //TODO
        })
        eventCenter.on('command-selected',(command: Command)=>{
            this.commandHandler(command)
        })
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            this.allEnemyData.length = 0
            this.enemies.length = 0
        })
    }
    /**
     * Place images of all the enemy.
     * @param scale sprite scale number
     */
    private setUpEnemy(scale = 4.0){
        const{ width, height } = this.scale
        let margin = 0
        if(this.allEnemyData.length > 2){
            margin = 40
            let num = (this.enemyQuantity-1)/2
            this.allEnemyData.slice(1).forEach((data,index)=>{
                if(data.enemyImgLocation != undefined){
                    const enemySprite = this.add.image(width*0.5-num*margin*4+((this.enemyQuantity-1)-index)*(margin*4),height*0.5-margin,'enemy'+index.toString())
                    enemySprite.scale = scale
                    this.enemies.push(enemySprite)
                }
                else if(this.enemyData.enemyImgLocation == undefined){
                    const enemySprite = this.add.image(width*0.5-num*margin*4+((this.enemyQuantity-1)-index)*(margin*4),height*0.5-margin,this.spriteKey,data.enemyAtlasFrame)
                    enemySprite.scale = scale
                    this.enemies.push(enemySprite)
                }
            })
            this.enemies = this.enemies.reverse()
        }
        if(this.allEnemyData.length == 2){
            margin = 40
            let num = this.enemyQuantity/2
            this.allEnemyData.forEach((data,index)=>{
                if(data.enemyImgLocation != undefined){
                    const enemySprite = this.add.image(width*0.5-num*margin*4+(this.enemyQuantity-index)*(margin*4),height*0.5,'enemy'+index.toString())
                    enemySprite.scale = scale
                    this.enemies.push(enemySprite)
                }
                else if(data.enemyImgLocation == undefined){
                    const enemySprite = this.add.image(width*0.5-num*margin*4+(this.enemyQuantity-index)*(margin*4),height*0.5,this.spriteKey,data.enemyAtlasFrame)
                    enemySprite.scale = scale
                    this.enemies.push(enemySprite)
                }
            })
        }
        else{
            if(this.enemyData.enemyImgLocation != undefined){
                const enemySprite = this.add.image(width*0.5,height*0.5+margin,'enemy0')
                enemySprite.scale = 4.0
                this.enemies.push(enemySprite)
            }
            else if(this.enemyData.enemyImgLocation == undefined){
                const enemySprite = this.add.image(width*0.5,height*0.5+margin,this.spriteKey,this.enemyFrame)
                enemySprite.scale = 4.0
                this.enemies.push(enemySprite)
            }
            this.enemies = this.enemies.reverse()
        }
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
    private getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}