import { Position } from "grid-engine";
import * as Phaser from "phaser";
import { DungeonMap } from "../scenes/dungeonMap";
import eventCenter from "../util/eventCenter";

export class MapManager extends Phaser.Scene{

    private mapKey: string
    private startPosition: Position

    init(data: { key: string; pos: Position}){
        this.mapKey = data.key
        this.startPosition = data.pos
    }

    create(){
        this.loadMap()
        eventCenter.on("load-map",(mapKey:string,pos:Position)=>{
            this.mapKey = mapKey
            this.startPosition = pos
            this.scene.launch("map",this.getDataInfo())
        })
    }

    loadMap(){
        this.scene.remove("map")
        this.scene.add("map", DungeonMap, false);
        this.scene.launch("map",this.getDataInfo())
    }

    getDataInfo(){
        switch(this.mapKey){
            case "testMap":{
                return {
                    tilesetLocation:"assets/img/test-dungeon-tileset.png",
                    jsonKey:"test-dungeon-map",
                    jsonLocation:"assets/json/test_map.json",
                    mapName:"Test Dungeon",
                    startPos:this.startPosition,
                    settingID:"testMap",
                }
            }
            //追加していく
            case "":{
                return {
                    tilesetLocation:"",
                    jsonKey:"",
                    jsonLocation:"",
                    mapName:"",
                    startPos:{x: 0,y: 0},
                    settingID:"",
                }
            }
            default:
                break
        }
    }
}