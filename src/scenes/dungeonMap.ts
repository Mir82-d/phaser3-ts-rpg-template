import { GridEngine, Position } from "grid-engine";
import { Direction } from "grid-engine";
import eventCenter from "../util/EventCenter";
import * as Phaser from "phaser";
import { MapManager } from "../util/MapManager";
import { GameConfig } from "../config";

export class DungeonMap extends Phaser.Scene {

    private gridEngine: GridEngine
    private gridEngineConfig: any

    private tilesetLocation: string
    private tileKey: string
    private jsonKey: string
    private jsonLocation: string
    private mapName: string
    private startPos: Position
    private startDire: Direction
    private settingID: string

    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key
    private c_key!: Phaser.Input.Keyboard.Key

    private dialogueDatabase: Phaser.Cache.BaseCache
    private allyNames: string[] = []
    private mapManager: MapManager

    init(data: { tilesetLocation: string; tileKey: string; jsonKey: string; jsonLocation: string; mapName: string; startPos: Position; startDire: Direction; settingID: string}){
        this.tilesetLocation = data.tilesetLocation
        this.tileKey = data.tileKey
        this.jsonKey = data.jsonKey
        this.jsonLocation = data.jsonLocation
        this.mapName = data.mapName
        this.startPos = data.startPos
        this.startDire = data.startDire
        this.settingID = data.settingID

        this.z_key = this.input.keyboard.addKey('Z')
        this.x_key = this.input.keyboard.addKey('X')
        this.c_key = this.input.keyboard.addKey('C')
        this.mapManager = new MapManager(GameConfig)
        this.allyNames = ["テスト1","テスト2","テスト3","テスト4"]
    }

    preload() {
        this.load.image(this.tileKey, this.tilesetLocation);
        this.load.tilemapTiledJSON(this.jsonKey, this.jsonLocation);
        this.load.spritesheet("player", "assets/img/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
        this.load.xml("dialogue","assets/xml/dialogue.xml")
    }
    create() {
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
        this.gridEngine.create(tilemap, this.gridEngineConfig);
        this.settingNPCMovement()
        //set start direction for this map
        this.gridEngine.turnTowards("player",this.startDire)
        this.gridEngine.turnTowards("ally",this.startDire)
        this.gridEngine.turnTowards("ally2",this.startDire)
        this.gridEngine.turnTowards("ally3",this.startDire)
        //start scene fade in
        camera.fadeIn(FADE_TIME)
        //events
        eventCenter.on("reset-facing-direction",(npcKey : string)=>{
            this.time.delayedCall(1200,()=>{
                if(this.gridEngine.isMoving(npcKey)==false)
                this.gridEngine.turnTowards(npcKey,Direction.DOWN)
            })
        },this)
        this.events.once("load-map",(mapKey:string,pos:Position,dire:Direction)=>{
            camera.fadeOut(FADE_TIME)
            //If u don't do delayedCall, this would never work.
            this.time.delayedCall(FADE_TIME,()=>{
                this.scene.restart(this.mapManager.getDataInfo(mapKey,pos,dire))
            })
        })
        //load dialogue
        this.dialogueDatabase = this.cache.xml.get("dialogue")
    }
    //custom animation
    createPlayerAnimation(name:string, startFrame:number, endFrame:number) {
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
    update() {
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
                    this.gridEngine.turnTowards(charID,this.reverseDirection(this.gridEngine.getFacingDirection("player")))
                    eventCenter.emit("reset-facing-direction",charID)
                    //this.scene.launch('talkingWindow',{ name: this.getName(charID), txt: this.getDialogue(charID)})
                    this.scene.launch('talkingWindow',{ timelineID: this.settingID+"_"+charID })
                    this.scene.pause()
                }
            })
        }
        //open map menu
        else if(x){
            this.scene.launch('mapMenu',{charNames:this.allyNames})
            this.scene.pause()
        }
        //test
        else if(c){
            this.scene.start("gameTest")
        }
        this.mapTransition()
    }
    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    reverseDirection(dire:Direction){
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
    isFacing(pos: Position,dire: Direction){
        if(this.gridEngine.isMoving("player")==false){
            if(pos.x == this.gridEngine.getPosition("player").x
            && pos.y == this.gridEngine.getPosition("player").y
            && dire == this.gridEngine.getFacingDirection("player"))
            return true
        }
        else return false
    }
    spawnEnemy(){

    }
    //npc settings(npc id must be included "npc" letter)
    settingNPC(){
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
                    //collisionTilePropertyName: "npc_cg",
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
    settingNPCMovement(){
        switch(this.settingID){
            case "testMap":{
                this.gridEngine.moveRandomly("npc",this.getRandomInt(1000,2000));
            }
            default:
                break
        }
    }
    //setting area transition point
    mapTransition(){
        switch(this.settingID){
            case "testMap":{
                if(this.isFacing({x: 19,y: 9},Direction.UP))
                {
                    this.events.emit("load-map","testMap2",{x: 14,y: 39},Direction.UP)
                    //eventCenter.emit("load-map","testMap",{x: 15,y: 21})
                }
            }
            case "testMap2":{
                if(this.isFacing({x: 14,y: 0},Direction.UP))
                {
                    this.events.emit("load-map","testMap",{x: 15,y: 21},Direction.UP)
                }
                if(this.isFacing({x: 14,y: 39},Direction.DOWN))
                {
                    this.events.emit("load-map","testMap",{x: 19,y: 9},Direction.DOWN)
                }
            }
            default:
                break
        }
    }
    //TODO: NPCのセリフと名前をxmlで管理する
    getName(key:string){
        switch(key){
            case "npc": return "テスト"
            case "npc2": return "テスト2"
        }
    }
    getDialogue(key:string){
        switch(key){
            case "npc": return "This is a test dialogue.\nこれはにほんごです。\nThis is line 3.\n4ぎょうめです。\n5ぎょうめですよ。"
            case "npc2": return "うごかないやつです。"
            default:
                break
        }
    }
}