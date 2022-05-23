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
    private settingID: string

    private dialogueDatabase: Phaser.Cache.BaseCache
    private mapManager: MapManager

    init(data: { tilesetLocation: string; tileKey: string; jsonKey: string; jsonLocation: string; mapName: string; startPos: Position; settingID: string}){
        this.tilesetLocation = data.tilesetLocation
        this.tileKey = data.tileKey
        this.jsonKey = data.jsonKey
        this.jsonLocation = data.jsonLocation
        this.mapName = data.mapName
        this.startPos = data.startPos
        this.settingID = data.settingID

        this.mapManager = new MapManager(GameConfig)
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
        };
        //setup npc for this map
        this.settingNPC()
        this.gridEngine.create(tilemap, this.gridEngineConfig);
        this.settingNPCMovement()
        //Set start position for this map
        /* this.gridEngine.setPosition("player",this.startPos,"playerField");
        this.gridEngine.setPosition("ally",this.startPos,"playerField");
        this.gridEngine.setPosition("ally2",this.startPos,"playerField");
        this.gridEngine.setPosition("ally3",this.startPos,"playerField"); */
        //events
        eventCenter.on("reset-facing-direction",(npcKey : string)=>{
            this.time.delayedCall(1200,()=>{
                if(this.gridEngine.isMoving(npcKey)==false)
                this.gridEngine.turnTowards(npcKey,Direction.DOWN)
            })
        },this)
        this.events.once("load-map",(mapKey:string,pos:Position)=>{
            //If u don't do delayedCall, this would never work.
            this.time.delayedCall(300,()=>{
                this.scene.restart(this.mapManager.getDataInfo(mapKey,pos))
            })
        })
        //load dialogue
        this.dialogueDatabase = this.cache.xml.get("dialogue")
    }
    update() {
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.gridEngine.move("player", Direction.LEFT);
        } else if (cursors.right.isDown) {
            this.gridEngine.move("player", Direction.RIGHT);
        } else if (cursors.up.isDown) {
            this.gridEngine.move("player", Direction.UP);
        } else if (cursors.down.isDown) {
            this.gridEngine.move("player", Direction.DOWN);
        }
        const z = this.input.keyboard.addKey('Z');
        const x = this.input.keyboard.addKey('X');
        //following to player
        if(this.gridEngine.isMoving("player")){
            this.gridEngine.moveTo("ally",this.gridEngine.getPosition("player"));
            this.gridEngine.moveTo("ally2",this.gridEngine.getPosition("ally"));
            this.gridEngine.moveTo("ally3",this.gridEngine.getPosition("ally2"));
        }
        //talk to npc
        if(Phaser.Input.Keyboard.JustDown(z)){
            this.gridEngine.getCharactersAt(this.gridEngine.getFacingPosition("player"),"playerField").forEach( charID =>{
                if(charID.includes("npc")){
                    this.gridEngine.turnTowards(charID,this.reverseDirection(this.gridEngine.getFacingDirection("player")));
                    eventCenter.emit("reset-facing-direction",charID)
                    this.scene.launch('talkingWindow',{ name: this.getName(charID), txt: this.getDialogue(charID)})
                    this.scene.pause();
                }
            })
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
    isFacing(pos: Position){
        if(this.gridEngine.isMoving("player")==false){
            if(pos.x == this.gridEngine.getPosition("player").x
            && pos.y == this.gridEngine.getPosition("player").y)
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
                if(this.isFacing({x: 19,y: 9}))
                {
                    this.events.emit("load-map","testMap2",{x: 14,y: 39})
                    //eventCenter.emit("load-map","testMap",{x: 15,y: 21})
                }
            }
            case "testMap2":{
                if(this.isFacing({x: 14,y: 0}))
                {
                    this.events.emit("load-map","testMap",{x: 15,y: 21})
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