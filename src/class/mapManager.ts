import { Direction, Position } from "grid-engine";
import * as Phaser from "phaser";
import eventCenter from "../util/EventCenter";
import { fileDB } from "../data/fileDB";
import { CharacterDatabaseType, CharInfo } from "../type/CharacerDatabaseType";
import { CharacterDB } from "../data/characterDB";
import { SaveFileType } from "../type/SaveFileType";

export class MapManager extends Phaser.Scene{

    private mapKey: string
    private startPosition: Position
    private startDirection: Direction
    private startScene: Phaser.Scene

    private charDataBase: CharacterDatabaseType
    private saveData: SaveFileType = {
        status: null,
        mapID: null,
        startDirection: null,
        startPosition: null
    }

    init(data: { key: string; pos: Position; dire: Direction; scene: Phaser.Scene}){
        this.mapKey = data.key
        this.startPosition = data.pos
        this.startDirection = data.dire
        this.startScene = data.scene
    }

    create(){
        this.initializeStatus()
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
        this.scene.launch("map",this.getDataInfo(this.mapKey,this.startPosition,this.startDirection))
    }
    /**
     * Get information of file path, position and direction.
     * マップを読み込むときの情報を取り出す
     * @param mapKey 
     * @param startPosition 
     * @param startDirection 
     */
    public getDataInfo(mapKey: string, startPosition: Position, startDirection: Direction){
        let fileInfo = fileDB[mapKey]
        return {
            data:fileInfo,
            pos:{startPos: startPosition, startDire: startDirection}
        }
    }
    /**
     * Initialize Character status and save/load json file.
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
    /**
     * Update Character status and save data to localStorage.
     * @param charData 
     * @param mapID 
     * @param pos 
     * @param dire 
     */
    public saveStatus(charData: CharacterDatabaseType,mapID: string,pos: Position, dire: Direction){
        //TODO
        this.charDataBase = charData
        this.saveData.status = this.charDataBase
        this.saveData.mapID = mapID
        this.saveData.startPosition = pos
        this.saveData.startDirection = dire
        localStorage.setItem('saveFile',JSON.stringify(this.saveData))
    }
    /**
     * Load save data from localStorage.
     */
    public loadStatus(){
        //TODO
        try{
            this.saveData = JSON.parse(localStorage.getItem('saveFile'))
            console.log(this.saveData)
        }
        catch{
            console.error('Could not load save file.')
        }
    }
    /**
     * Get character status from current loaded save data.
     * @returns 
     */
    public getStatus(){
        return this.saveData.status
    }
    /**
     * Just update character status without saving data to localStorage.
     * @param charData 
     * @param mapID 
     * @param pos 
     * @param dire 
     */
    public updateStatus(charData: CharacterDatabaseType,mapID: string,pos: Position, dire: Direction){
        this.charDataBase = charData
        this.saveData.status = this.charDataBase
        this.saveData.mapID = mapID
        this.saveData.startPosition = pos
        this.saveData.startDirection = dire
    }
}