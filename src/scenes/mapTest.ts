import { GridEngine } from "grid-engine";
import { Direction } from "grid-engine";
import * as Phaser from "phaser";

export class MapTest extends Phaser.Scene {

    private gridEngine: GridEngine
    /* private playerSprite: Phaser.GameObjects.Sprite
    private tilemap: Phaser.Tilemaps.Tilemap */

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
        //playerSprite.setDepth(3);
        playerSprite.scale = 1.5;
        this.cameras.main.startFollow(playerSprite, true);
        this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);

        const gridEngineConfig = {
            characters: [
                {
                id: "player",
                sprite: playerSprite,
                walkingAnimationMapping: 6,
                startPosition: {x: 10,y:16},
                charLayer: "playerField",
                },
            ],
        };
        this.gridEngine.create(tilemap, gridEngineConfig);
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
    }
}