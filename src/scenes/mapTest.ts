import { GridEngine } from "grid-engine";
import { Direction } from "grid-engine";
import * as Phaser from "phaser";

export class MapTest extends Phaser.Scene {

    private gridEngine: GridEngine

    //stored position
    private player_p = new Map<string,number>();
    private ally_p = new Map<string,number>();
    private ally2_p = new Map<string,number>();
    private ally3_p = new Map<string,number>();

    preload() {
        this.load.image("tiles", "assets/img/test-dungeon-tileset.png");
        this.load.tilemapTiledJSON("test-dungeon-map", "assets/json/test_map.json");
        this.load.spritesheet("player", "assets/img/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
    }
    create() {
        const tilemap = this.make.tilemap({ key: "test-dungeon-map" });
        tilemap.addTilesetImage("Test Dungeon", "tiles");
        for (let i = 0; i < tilemap.layers.length; i++) {
            const layer = tilemap.createLayer(i, "Test Dungeon", 0, 0);
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

        const gridEngineConfig = {
            characters: [
                {
                    id: "player",
                    sprite: playerSprite,
                    walkingAnimationMapping: 6,
                    startPosition: {x: 10,y:16},
                    charLayer: "playerField",
                },
                {
                    id: "ally",
                    sprite: alySpr,
                    walkingAnimationMapping: 1,
                    startPosition: {x: 10,y:17},
                    charLayer: "playerField",
                    collides: false,
                },
                {
                    id: "ally2",
                    sprite: alySpr2,
                    walkingAnimationMapping: 2,
                    startPosition: {x: 10,y:18},
                    charLayer: "playerField",
                    collides: false,
                },
                {
                    id: "ally3",
                    sprite: alySpr3,
                    walkingAnimationMapping: 3,
                    startPosition: {x: 10,y:17},
                    charLayer: "playerField",
                    collides: false,
                },
            ],
        };
        //NPC
        const npcSpr = this.add.sprite(0,0,"player");
        npcSpr.scale = 1.5;
        gridEngineConfig.characters.push({
            id: "npc",
            sprite: npcSpr,
            walkingAnimationMapping: this.getRandomInt(0,6),
            startPosition: {x: 7,y: 7},
            charLayer: "playerField",
        });
        this.gridEngine.create(tilemap, gridEngineConfig);
        this.gridEngine.moveRandomly("npc",1500);

        //PositionObserver
        this.gridEngine.positionChangeFinished()
            .subscribe(({charId,enterTile})=>{
                if(charId == "player"){
                    this.player_p.set("x",enterTile.x);
                    this.player_p.set("y",enterTile.y);
                }
                if(charId == "ally"){
                    this.ally_p.set("x",enterTile.x);
                    this.ally_p.set("y",enterTile.y);
                }
                if(charId == "ally2"){
                    this.ally2_p.set("x",enterTile.x);
                    this.ally2_p.set("y",enterTile.y);
                }
        });
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
        //following to player
        if(this.gridEngine.isMoving("player")){
            this.gridEngine.moveTo("ally",{x: this.player_p.get("x"),y: this.player_p.get("y")});
            this.gridEngine.moveTo("ally2",{x: this.ally_p.get("x"),y: this.ally_p.get("y")});
            this.gridEngine.moveTo("ally3",{x: this.ally2_p.get("x"),y: this.ally2_p.get("y")});
        }
    }
    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}