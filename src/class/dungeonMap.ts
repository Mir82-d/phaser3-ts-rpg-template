import { GridEngine, MovementInfo, Position } from "grid-engine";
import { Direction } from "grid-engine";
import eventCenter from "../util/EventCenter";
import * as Phaser from "phaser";
import { MapManager } from "./mapManager";
import { GameConfig } from "../config";
import { FileDBType, FileInfo } from "../type/fileDBType";
import { MovementType, MTInfo} from "../type/MovementType";

export class DungeonMap extends Phaser.Scene {

    private gridEngine: GridEngine
    private gridEngineConfig: any

    private tilesetLocation: string
    private tileKey: string
    private jsonKey: string
    private jsonLocation: string
    private enemySpriteLocation: string
    private enemySpriteKey: string
    private enemyAtrasLocation: string
    private mapName: string
    private startPos: Position
    private startDire: Direction
    private settingID: string

    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key
    private c_key!: Phaser.Input.Keyboard.Key
    private cacheObj: any[] = []

    private charIDs: string[] = []
    private enemyIDs: string[] = []
    private charMovement: MTInfo = {}
    private mapManager: MapManager

    public init(obj: {data: FileInfo, pos:{startPos: Position; startDire: Direction;} }){

        this.tilesetLocation = obj.data.tilesetLocation
        this.tileKey = obj.data.tileKey
        this.jsonKey = obj.data.jsonKey
        this.jsonLocation = obj.data.jsonLocation
        this.mapName = obj.data.mapName
        this.startPos = obj.pos.startPos
        this.startDire = obj.pos.startDire
        this.settingID = obj.data.settingID

        if(obj.data.enemySpriteKey != undefined){
            this.enemySpriteKey = obj.data.enemySpriteKey
            this.enemyAtrasLocation = obj.data.enemyAtlasLocation
            this.enemySpriteLocation = obj.data.enemySpriteLocation
        }

        this.z_key = this.input.keyboard.addKey('Z')
        this.x_key = this.input.keyboard.addKey('X')
        this.c_key = this.input.keyboard.addKey('C')
        this.mapManager = new MapManager(GameConfig)
        this.charIDs = ["ally1","ally2","ally3","ally4"]
    }

    public preload() {
        this.load.image(this.tileKey, this.tilesetLocation);
        this.load.tilemapTiledJSON(this.jsonKey, this.jsonLocation);
        this.load.spritesheet("player", "assets/img/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
        if(this.enemySpriteKey != undefined){
            //this.load.image(this.enemySpriteKey, this.enemySpriteLocation)
            this.load.atlas(this.enemySpriteKey, this.enemySpriteLocation,this.enemyAtrasLocation)
        }
    }
    public create() {
        const FADE_TIME = 600;

        const tilemap = this.make.tilemap({ key: this.jsonKey });
        tilemap.addTilesetImage(this.mapName, this.tileKey);
        for (let i = 0; i < tilemap.layers.length; i++) {
            const layer = tilemap.createLayer(i, this.mapName, 0, 0);
            layer.scale = 3;
        }
        const playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.scale = 1.5;
        
        const camera = this.cameras.main
        camera.startFollow(playerSprite, true);
        camera.setFollowOffset(-playerSprite.width, -playerSprite.height);
        camera.setBounds(0, 0,
            tilemap.widthInPixels*3,
            tilemap.heightInPixels*3)
        
        //Ally
        const alySpr = this.add.sprite(0, 0, "player").setScale(1.5);
        const alySpr2 = this.add.sprite(0, 0, "player").setScale(1.5);
        const alySpr3 = this.add.sprite(0, 0, "player").setScale(1.5);

        this.gridEngineConfig = {
            characters: [
                {
                    id: "player",
                    sprite: playerSprite,
                    walkingAnimationMapping: 6,
                    startPosition:this.startPos,
                    charLayer: "playerField",
                },
                {
                    id: "ally",
                    sprite: alySpr,
                    walkingAnimationMapping: 1,
                    startPosition:this.startPos,
                    charLayer: "playerField",
                    collides: false,
                },
                {
                    id: "ally2",
                    sprite: alySpr2,
                    walkingAnimationMapping: 2,
                    startPosition:this.startPos,
                    charLayer: "playerField",
                    collides: false,
                },
                {
                    id: "ally3",
                    sprite: alySpr3,
                    walkingAnimationMapping: 3,
                    startPosition:this.startPos,
                    charLayer: "playerField",
                    collides: false,
                },
            ],
            numberOfDirections: 8,
        };
        //setup npc for this map
        this.settingNPC()
        //setup enemy for this map
        this.spawnEnemy()
        this.gridEngine.create(tilemap, this.gridEngineConfig);
        this.settingNPCMovement()
        this.settingEnemyMovement()
        //set start direction for this map
        this.gridEngine.turnTowards("player",this.startDire)
        this.gridEngine.turnTowards("ally",this.startDire)
        this.gridEngine.turnTowards("ally2",this.startDire)
        this.gridEngine.turnTowards("ally3",this.startDire)
        //start scene fade in
        camera.fadeIn(FADE_TIME)
        //enemy follow player when approaching
        this.gridEngine.positionChangeFinished()
        .subscribe(({ charId, exitTile, enterTile }) =>{
            //TODO
            if(charId.includes("enemy")){
                if(this.charMovement[charId] != MovementType.FOLLOW &&
                    this.charMovement[charId] != MovementType.MOVETO)
                    {
                        let pos = this.gridEngine.getPosition('player')
                        let distance = this.manhattanDist(pos.x,pos.y,exitTile.x,exitTile.y)
                        //console.log(distance,this.charMovement[charId])
                        if(distance < 9){
                            this.charMovement[charId] = MovementType.FOLLOW
                            this.gridEngine.follow(charId,'player',-1)
                        }
                    }
                else if(this.charMovement[charId] == MovementType.FOLLOW ||
                    this.charMovement[charId] == MovementType.MOVETO)
                    {
                        let pos = this.gridEngine.getPosition('player')
                        let distance = this.manhattanDist(pos.x,pos.y,enterTile.x,enterTile.y)
                        if(distance > 8){
                            this.charMovement[charId] = MovementType.RANDOM
                            this.gridEngine.moveRandomly(charId,this.getRandomInt(1000,2000))
                        }
                        else if(distance == 0){
                            console.log("encounted!!!")
                            this.symbolEncounter()
                            //this.scene.pause()
                        }
                        //console.log(distance,this.charMovement[charId])
                    }
            }
        })
        //remember enemy ID
        this.gridEngine.getAllCharacters().forEach(charID=>{
            if(charID.includes("enemy")){
                this.enemyIDs.push(charID)
            }
        })
        //events
        this.events.on("reset-facing-direction",(npcKey : string)=>{
            this.time.delayedCall(1200,()=>{
                //if(this.gridEngine.isMoving(npcKey)==false)
                this.gridEngine.turnTowards(npcKey,Direction.DOWN)
            })
        },this)
        this.events.once("fade-out",()=>{
            camera.fadeOut(FADE_TIME)
        })
        this.events.once('load-map',(dist: string, distPos: Position, distDire: Direction, scene: typeof Phaser.Scene = null)=>{
            this.loadMap(dist,distPos,distDire,scene)
            
            if(this.enemyIDs.length != 0){
                this.enemyIDs.forEach(charId=>{
                    this.gridEngine.stopMovement(charId)
                })
            }
            this.enemyIDs.length = 0
            this.charMovement = {}
        })
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            this.events.off('restet-facing-direction')
            this.events.off('fade-out')
            this.events.off('load-map')
            this.cacheObj.forEach(obj =>{
                obj.destroy()
            })
            this.cacheObj.length = 0
        })
    }
    //custom animation
    public createPlayerAnimation(name:string, startFrame:number, endFrame:number) {
        this.anims.create({
          key: name,
          frames: this.anims.generateFrameNumbers("player", {
            start: startFrame,
            end: endFrame,
          }),
          frameRate: 10,
          repeat: -1,
          yoyo: true,
        });
      }
    public update() {
        const cursors = this.input.keyboard.createCursorKeys()
        const z = Phaser.Input.Keyboard.JustDown(this.z_key)
        const x = Phaser.Input.Keyboard.JustDown(this.x_key)
        const c = Phaser.Input.Keyboard.JustDown(this.c_key)

        if (cursors.left.isDown && cursors.up.isDown) {
            this.gridEngine.move("player", Direction.UP_LEFT)
        } else if (cursors.left.isDown && cursors.down.isDown) {
            this.gridEngine.move("player", Direction.DOWN_LEFT)
        } else if (cursors.right.isDown && cursors.up.isDown) {
            this.gridEngine.move("player", Direction.UP_RIGHT)
        } else if (cursors.right.isDown && cursors.down.isDown) {
            this.gridEngine.move("player", Direction.DOWN_RIGHT)
        } else if (cursors.left.isDown) {
            this.gridEngine.move("player", Direction.LEFT)
        } else if (cursors.right.isDown) {
            this.gridEngine.move("player", Direction.RIGHT)
        } else if (cursors.up.isDown) {
            this.gridEngine.move("player", Direction.UP)
        } else if (cursors.down.isDown) {
            this.gridEngine.move("player", Direction.DOWN)
        }
        //following to player
        if(this.gridEngine.isMoving("player")){
            this.gridEngine.moveTo("ally",this.gridEngine.getPosition("player"))
            this.gridEngine.moveTo("ally2",this.gridEngine.getPosition("ally"))
            this.gridEngine.moveTo("ally3",this.gridEngine.getPosition("ally2"))
        }
        //talk to npc
        if(z){
            this.gridEngine.getCharactersAt(this.gridEngine.getFacingPosition("player"),"playerField").forEach( charID =>{
                if(charID.includes("npc")){
                    this.gridEngine.turnTowards(charID,this.oppositeDirection(this.gridEngine.getFacingDirection("player")))
                    this.events.emit("reset-facing-direction",charID)
                    //this.scene.launch('talkingWindow',{ name: this.getName(charID), txt: this.getDialogue(charID)})
                    this.scene.launch('talkingWindow',{ timelineID: this.settingID+"_"+charID })
                    this.scene.pause()
                }
            })
        }
        //open map menu
        else if(x){
            this.scene.launch('mapMenu',{charIDs:this.charIDs})
            this.scene.pause()
        }
        //test
        else if(c){
            this.scene.start("gameTest")
        }
        this.mapTransition()
        //this.symbolEncounter()
    }
    private getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private oppositeDirection(dire:Direction){
        if(dire == Direction.DOWN){
            return Direction.UP;
        }
        else if(dire == Direction.UP){
            return Direction.DOWN;
        }
        else if(dire == Direction.LEFT){
            return Direction.RIGHT;
        }
        else if(dire == Direction.RIGHT){
            return Direction.LEFT;
        }
    }
    private isFacing(pos: Position,dire: Direction){
        if(this.gridEngine.isMoving("player")==false){
            if(pos.x == this.gridEngine.getPosition("player").x
            && pos.y == this.gridEngine.getPosition("player").y
            && dire == this.gridEngine.getFacingDirection("player"))
            return true
        }
        else return false
    }
    //enemy settings(enemy id must be included "enemy" letter)
    public spawnEnemy(){
        //Override and implement it
    }
    //npc settings(npc id must be included "npc" letter)
    public settingNPC(){
        //Override and implement it
        switch(this.settingID){
            case "testMap":{
                //NPC
                const npcSpr = this.add.sprite(0,0,"player");
                npcSpr.scale = 1.5;
                this.gridEngineConfig.characters.push({
                    id: "npc",
                    sprite: npcSpr,
                    walkingAnimationMapping: this.getRandomInt(0,7),
                    startPosition: {x: 12,y: 11},
                    charLayer: "playerField",
                });
                //
                const npcSpr2 = this.add.sprite(0,0,"player");
                npcSpr2.scale = 1.5;
                this.gridEngineConfig.characters.push({
                    id: "npc2",
                    sprite: npcSpr2,
                    walkingAnimationMapping: 7,
                    startPosition: {x: 15,y: 9},
                    charLayer: "playerField",
                });
            }
            case "testMap2":{

            }
            default:
                break
        }
    }
    public pushCharacter(id: string,mapping: number,startPos: Position, scale = 1.5){
        const npcSpr = this.add.sprite(0,0,"player");
        npcSpr.scale = scale
        this.gridEngineConfig.characters.push({
            id: id,
            sprite: npcSpr,
            walkingAnimationMapping: mapping,
            startPosition: startPos,
            charLayer: "playerField",
        });
    }
    public pushEnemy(id: string, frame: string, startPos: Position, scale = 3){
        const sprite = this.textures.addSpriteSheetFromAtlas(id,{
            atlas: this.enemySpriteKey,
            frame: frame,
            frameWidth: 32,
            frameHeight: 32
        })
        const enemySpr = this.add.sprite(0,0,sprite)
        enemySpr.scale = scale
        this.gridEngineConfig.characters.push({
            id: id,
            sprite: enemySpr,
            startPosition: startPos,
            charLayer: "playerField",
            collides:{
                collisionGroups:['enemy']
            }
        })
        this.cacheObj.push(enemySpr)
        this.cacheObj.push(sprite)
    }
    public settingNPCMovement(){
        //Override and implement it
        switch(this.settingID){
            case "testMap":{
                this.gridEngine.moveRandomly("npc",this.getRandomInt(1000,2000));
            }
            default:
                break
        }
    }
    public settingEnemyMovement(){
        //Override and implement it
    }
    public setMovementType(id: string, type?: string, radius: number = 2, speed: number = 4, span?: number){
        if (type == null){}
        else {
            if(span == null){
                span = this.getRandomInt(1000,2000)
            }
            switch(type){
                case 'random':
                    this.gridEngine.setSpeed(id,speed)
                    this.gridEngine.moveRandomly(id,span)
                    this.charMovement[id] = MovementType.RANDOM
                    break
                case 'radius':
                    this.gridEngine.setSpeed(id,speed)
                    this.gridEngine.moveRandomly(id,span,radius)
                    this.charMovement[id] = MovementType.RADIUS
                    break
                case 'follow':
                    this.gridEngine.setSpeed(id,speed)
                    this.gridEngine.follow(id,'player',-1)
                    this.charMovement[id] = MovementType.FOLLOW
                    break
                default:
                    break
            }
        }
    }
    //setting area transition point
    public mapTransition(){
        //Override and implement it
        switch(this.settingID){
            case "testMap":{
                if(this.isFacing({x: 19,y: 9},Direction.UP))
                {
                    this.events.emit('load-map',"testMap2",{x: 14,y: 39},Direction.UP)
                }
            }
            case "testMap2":{
                if(this.isFacing({x: 14,y: 0},Direction.UP))
                {
                    this.events.emit('load-map',"testMap",{x: 15,y: 21},Direction.UP)
                }
                if(this.isFacing({x: 14,y: 39},Direction.DOWN))
                {
                    this.events.emit('load-map',"testMap",{x: 19,y: 9},Direction.DOWN)
                }
            }
            default:
                break
        }
    }
    public setTransitionPoint(fromPos: Position, fromDire: Direction, dist: string, distPos: Position, distDire: Direction, scene: typeof Phaser.Scene = null){
        if(this.isFacing(fromPos,fromDire))
        {
            this.events.emit('load-map',dist,distPos,distDire,scene)
            //this.loadMap(dist,distPos,distDire,scene)
        }
    }
    public getAreaID(){
        return this.settingID
    }
    private loadMap(mapKey:string,pos:Position,dire:Direction,nextScene?:typeof Phaser.Scene){
        const FADE_TIME = 600;
        this.events.emit('fade-out')
        let info = this.mapManager.getDataInfo(mapKey,pos,dire)
        if(nextScene == null){
            this.time.delayedCall(FADE_TIME, ()=>{
                this.scene.restart(info)
            })
        }
        else{
            let object = {
                next: nextScene,
                data: info
            }
            this.time.delayedCall(FADE_TIME, ()=>{
                this.scene.stop('map')
                this.scene.remove('map')
                this.scene.start('loading',object)
            })
        }
    }
    private symbolEncounter(){
        this.enemyIDs.forEach(charId=>{
            this.gridEngine.stopMovement(charId)
        })
        //TODO
        //BattleSceneに情報を渡す
        this.scene.pause()
        //this.scene.launch('battleScene')
    }
    private manhattanDist(x1: number, y1:number, x2: number, y2: number) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}