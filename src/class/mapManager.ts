import { Direction, Position } from "grid-engine";
import * as Phaser from "phaser";
import { DungeonMap } from "./dungeonMap";
import { TestMap } from "../scenes/TestMap";
import eventCenter from "../util/EventCenter";

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
    }

    loadMap(){
        this.scene.add("map", this.startScene, false);
        this.scene.launch("map",this.getDataInfo(this.mapKey,this.startPosition,this.startDirection))
    }

    getDataInfo(mapKey: string,startPosition: Position,startDirection: Direction){
        switch(mapKey){
            case "testMap":{
                return {
                    tilesetLocation:"assets/img/test-dungeon-tileset.png",
                    tileKey:"tile1",
                    jsonKey:"test-dungeon-map",
                    jsonLocation:"assets/json/test_map.json",
                    mapName:"Test Dungeon",
                    startPos:startPosition,
                    startDire:startDirection,
                    settingID:"testMap",
                }
            }
            case "testMap2":{
                return {
                    tilesetLocation:"assets/img/test-dungeon-tileset.png",
                    tileKey:"tile1",
                    jsonKey:"test-dungeon-map2",
                    jsonLocation:"assets/json/test_map2.json",
                    mapName:"Test Dungeon 2",
                    startPos:startPosition,
                    startDire:startDirection,
                    settingID:"testMap2",
                }
            }
            //追加していく
            case "":{
                return {
                    tilesetLocation:"",
                    tileKey:"",
                    jsonKey:"",
                    jsonLocation:"",
                    mapName:"",
                    startPos:{x: 0,y: 0},
                    startDire:Direction.DOWN,
                    settingID:"",
                }
            }
            default:
                break
        }
    }
}