import { Direction } from "grid-engine";
import * as Phaser from "phaser";
import { GameConfig } from "../config";
import { DungeonMap } from "../class/dungeonMap";
import { TestMap2 } from "./TestMap2";

export class TestMap extends DungeonMap{

    constructor(){
        super(GameConfig)
    }
    
    public override settingNPC(): void {
        let area = super.getAreaID()
        console.log(area)
        super.pushCharacter('npc',7,{x: 12,y: 11})
        super.pushCharacter('npc2',5,{x: 15,y: 9})
    }

    public override settingNPCMovement(): void {
        super.setMovementType('npc','radius',1)
    }

    public override mapTransition(): void {
        super.setTransitionPoint({x: 19,y: 9},Direction.UP,'testMap2',{x: 14,y: 39},Direction.UP,TestMap2)
    } 
    
}