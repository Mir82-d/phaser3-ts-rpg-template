import { Direction, Position } from "grid-engine";
import * as Phaser from "phaser";
import eventCenter from "../util/EventCenter";
import { CharacterDatabaseType } from "../type/CharacerDatabaseType";
import { CharacterDB } from "../data/characterDB";
import { SaveFileType } from "../type/SaveFileType";
import { DataManager } from "./DataManager";
import { sceneDB } from "../data/sceneDB";

export class GameManager extends Phaser.Scene{

    private mapKey: string
    private startPosition: Position
    private startDirection: Direction
    private startScene: typeof Phaser.Scene

    private charDataBase: CharacterDatabaseType
    private saveData: SaveFileType = {
        status: null,
        mapID: null,
        startDirection: null,
        startPosition: null
    }
    private dataManager: DataManager = new DataManager()

    init(){
        this.initializeStatus()
    }

    create(){
        //for the first time
        this.loadMap()
        
        eventCenter.on("back-to-title",()=>{
            this.scene.bringToTop()
            this.cameras.main.fadeOut(400)
            this.time.delayedCall(500,()=>{
                this.scene.remove("map")
                this.scene.start("titleMenu")
            })
        })
        //戦闘開始イベント
        eventCenter.on("start-battle",(info:{id: string; frame:string; spriteKey: string } )=>{
            this.scene.bringToTop()
            this.cameras.main.fadeOut(400)
            this.time.delayedCall(600,()=>{
                this.scene.launch('battleScene',info)
            })
        })
        //戦闘勝利イベント
        eventCenter.on("battle-win",(id_map: string)=>{
            this.scene.bringToTop()
            this.cameras.main.fadeOut(400)
            this.time.delayedCall(600,()=>{
                this.scene.stop('battleScene')
                this.scene.resume('map',{flag: 'win',enemyID: id_map})
                this.cameras.main.fadeIn(400)
            })
        })
        //戦闘回避イベント
        eventCenter.on("battle-escape",(id_map: string)=>{
            this.scene.bringToTop()
            this.cameras.main.fadeOut(400)
            this.time.delayedCall(600,()=>{
                this.scene.stop('battleScene')
                this.scene.resume('map',{flag: 'escape',enemyID: id_map})
                this.cameras.main.fadeIn(400)
            })
        })
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            eventCenter.off("back-to-title")
            eventCenter.off("battle-win")
            eventCenter.off("battle-escape")
        })
    }
    /**
     * 初回のみマップを読み込む関数
     */
    private loadMap(){
        this.scene.add("map", this.startScene, false);
        this.scene.launch("map",this.dataManager.getDataInfo(this.mapKey,this.startPosition,this.startDirection))
    }
    /**
     * Initialize all status and save/load json file.
     * @param first is firstly launch game or not
     */
    private initializeStatus(first = true){
        if(first){
            this.charDataBase = CharacterDB
            this.saveData.status = this.charDataBase
            this.saveData.mapID = "testMap"
            this.saveData.startPosition = {x: 15,y: 21}
            this.saveData.startDirection = Direction.UP
            localStorage.setItem('saveFile',JSON.stringify(this.saveData))
            localStorage.setItem('tmp_status',JSON.stringify(this.charDataBase))

            this.mapKey = this.saveData.mapID
            this.startPosition = this.saveData.startPosition
            this.startDirection = this.saveData.startDirection
            this.startScene = sceneDB.testMap
        }
        else{
            try{
                this.saveData = JSON.parse(localStorage.getItem('saveFile'))
            }
            catch{
                console.error('Could not load save file.')
            }
            //
        }
    }
}