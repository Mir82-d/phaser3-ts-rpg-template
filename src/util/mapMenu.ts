import * as Phaser from "phaser";
import { InGameMenu } from "../objects/InGameMenu"
import eventCenter from "./EventCenter";

export class MapMenu extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key

    private layer_1!: Phaser.GameObjects.Layer;
    private layer_2!: Phaser.GameObjects.Layer;
    private layer_3!: Phaser.GameObjects.Layer;
    private mainMenu: InGameMenu

    private charIDs: string[]

    init(data: { charIDs: string[];}) {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.z_key = this.input.keyboard.addKey('Z');
        this.x_key = this.input.keyboard.addKey('X');

        this.charIDs = data.charIDs
    }

    preload(){

    }

    create(){
        this.scene.bringToTop()
        const{ width, height } = this.scale

        eventCenter.on('return',()=>{
            //TODO
        })
    }

    update(){

    }
}