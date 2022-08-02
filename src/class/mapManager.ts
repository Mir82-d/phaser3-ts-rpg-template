import { Direction, Position } from "grid-engine";
import * as Phaser from "phaser";
import { DungeonMap } from "./dungeonMap";
import { TestMap } from "../scenes/TestMap";
import eventCenter from "../util/EventCenter";
import { fileDB } from "../data/fileDB";

export class MapManager extends Phaser.Scene{

    private mapKey: string
    private startPosition: Position
    private startDirection: Direction
    private startScene: Phaser.Scene

    init(data: { key: string; pos: Position; dire: Direction; scene: Phaser.Scene}){
        this.mapKey = data.key
        this.startPosition = data.pos
        this.startDirection = data.dire
        this.startScene = data.scene
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
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            eventCenter.off("back-to-title")
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
     * Get information of filepass, position and direction.
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
}