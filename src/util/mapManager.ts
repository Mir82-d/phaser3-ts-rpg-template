import * as Phaser from "phaser";
import { DungeonMap } from "../scenes/dungeonMap";
import eventCenter from "../util/eventCenter";

export class MapManager extends Phaser.Scene{

    private mapKey : string

    init(data: { key: string; }){
        this.mapKey = data.key
    }

    create(){
        eventCenter.on("loadMap",(key: string)=>{
            this.mapKey = key
        })
        this.loadMap()
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
                    startPos:{x: 10,y:16},
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
                    startPos:{x: 0,y:0},
                    settingID:"",
                }
            }
            default:
                break
        }
    }
}