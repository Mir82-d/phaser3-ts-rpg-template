import { GridEngine, Position } from "grid-engine";
import { Direction } from "grid-engine";
import eventCenter from "../util/eventCenter";
import * as Phaser from "phaser";

export class DungeonMap extends Phaser.Scene {

    private gridEngine: GridEngine
    private gridEngineConfig: any

    private tilesetLocation: string
    private jsonKey: string
    private jsonLocation: string
    private mapName: string
    private startPos: Position
    private settingID: string

    private registeredNPC : string[]

    init(data: { tilesetLocation: string; jsonKey: string; jsonLocation: string; mapName: string; startPos: Position; settingID: string}){
        this.tilesetLocation = data.tilesetLocation
        this.jsonKey = data.jsonKey
        this.jsonLocation = data.jsonLocation
        this.mapName = data.mapName
        this.startPos = data.startPos
        this.settingID = data.settingID
    }

    preload() {
        this.load.image("tile1", this.tilesetLocation);
        this.load.tilemapTiledJSON(this.jsonKey, this.jsonLocation);
        this.load.spritesheet("player", "assets/img/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
    }
    create() {
        const tilemap = this.make.tilemap({ key: this.jsonKey });
        tilemap.addTilesetImage(this.mapName, "tile1");
        for (let i = 0; i < tilemap.layers.length; i++) {
            const layer = tilemap.createLayer(i, this.mapName, 0, 0);
            layer.scale = 3;
        }
        const playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.scale = 1.5;
        
        this.cameras.main.startFollow(playerSprite, true);
        this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);

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
                    startPosition: {x: 0,y:0},
                    charLayer: "playerField",
                },
                {
                    id: "ally",
                    sprite: alySpr,
                    walkingAnimationMapping: 1,
                    startPosition: {x: 0,y:0},
                    charLayer: "playerField",
                    collides: false,
                },
                {
                    id: "ally2",
                    sprite: alySpr2,
                    walkingAnimationMapping: 2,
                    startPosition: {x: 0,y:0},
                    charLayer: "playerField",
                    collides: false,
                },
                {
                    id: "ally3",
                    sprite: alySpr3,
                    walkingAnimationMapping: 3,
                    startPosition: {x: 0,y:0},
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
        this.gridEngine.setPosition("player",this.startPos,"playerField");
        this.gridEngine.setPosition("ally",this.startPos,"playerField");
        this.gridEngine.setPosition("ally2",this.startPos,"playerField");
        this.gridEngine.setPosition("ally3",this.startPos,"playerField");
        
        this.registeredNPC = this.gridEngine.getAllCharacters().slice(4,)
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
        //仮
        if(this.gridEngine.getPosition("npc").x==this.gridEngine.getFacingPosition("player").x
        && this.gridEngine.getPosition("npc").y==this.gridEngine.getFacingPosition("player").y){
            if(Phaser.Input.Keyboard.JustDown(z)){
                console.log("talking");
                this.gridEngine.turnTowards("npc",this.reverseDirection(this.gridEngine.getFacingDirection("player")));
                this.scene.launch('talkingWindow',{ name: this.getName("npc"), txt: this.getDialogue("npc")})
                this.scene.pause();
            }
        }
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
    //npc settings
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
                    startPosition: {x: 7,y: 7},
                    charLayer: "playerField",
                });
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
            default:
                break
        }
    }
}