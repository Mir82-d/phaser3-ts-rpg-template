import { Direction } from "grid-engine";
import * as Phaser from "phaser";
import { GameConfig } from "../config";
import { DungeonMap } from "../class/dungeonMap";
import { MovementType } from "../type/MovementType";
import { sceneDB } from "../data/sceneDB";

export class TestMap2 extends DungeonMap{

    constructor(){
        super(GameConfig)
    }
    
    public override settingNPC(): void {
        let area = super.getAreaID()
        console.log(area)
    }

    public override settingNPCMovement(): void {
        
    }

    public override mapTransition(): void {
        super.setTransitionPoint({x: 14,y: 0},Direction.UP,'testMap',{x: 15,y: 21},Direction.UP,sceneDB.testMap)
        super.setTransitionPoint({x: 14,y: 39},Direction.DOWN,'testMap',{x: 19,y: 9},Direction.DOWN,sceneDB.testMap)
    }

    public override spawnEnemy(): void {
        super.pushEnemy({map:'enemy1',db:'enemy_test1'},'enemy_42',{x: 15,y: 15})
        super.pushEnemy({map:'enemy2',db:'enemy_test2'},'enemy_43',{x: 13,y: 15})
    }

    public override settingEnemyMovement(): void {
        super.setMovementType('enemy1',MovementType.RANDOM)
        super.setMovementType('enemy2',MovementType.RANDOM)
    }
}