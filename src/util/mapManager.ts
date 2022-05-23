import { Position } from "grid-engine";
import * as Phaser from "phaser";
import { DungeonMap } from "../scenes/DungeonMap";
import eventCenter from "./EventCenter";

export class MapManager extends Phaser.Scene{

    private mapKey: string
    private startPosition: Position

    init(data: { key: string; pos: Position}){
        this.mapKey = data.key
        this.startPosition = data.pos
    }

    create(){
        //for the first time
        this.loadMap()
        /* eventCenter.on("load-map",(mapKey:string,pos:Position)=>{
            this.mapKey = mapKey
            this.startPosition = pos
            //this.scene.pause("map")
            //If u don't do delayedCall, this would never work.
            this.time.delayedCall(300,()=>{
                this.scene.launch("map",this.getDataInfo(mapKey,pos))
            })
        }) */
    }

    loadMap(){
        this.scene.remove("map")
        this.scene.add("map", DungeonMap, false);
        this.scene.launch("map",this.getDataInfo(this.mapKey,this.startPosition))
    }

    getDataInfo(mapKey: string,startPosition: Position){
        switch(mapKey){
            case "testMap":{
                return {
                    tilesetLocation:"assets/img/test-dungeon-tileset.png",
                    tileKey:"tile1",
                    jsonKey:"test-dungeon-map",
                    jsonLocation:"assets/json/test_map.json",
                    mapName:"Test Dungeon",
                    startPos:startPosition,
                    settingID:"testMap",
                }
            }
            case "testMap2":{
                return {
                    tilesetLocation:"assets/img/test-dungeon-tileset.png",
                    tileKey:"tile2",
                    jsonKey:"test-dungeon-map2",
                    jsonLocation:"assets/json/test_map2.json",
                    mapName:"Test Dungeon 2",
                    startPos:startPosition,
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
                    settingID:"",
                }
            }
            default:
                break
        }
    }
}