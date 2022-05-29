import { Direction } from "grid-engine";
import * as Phaser from "phaser";

export class GameTest extends Phaser.Scene {

    private description:  Phaser.GameObjects.Text
    private c_key!: Phaser.Input.Keyboard.Key
    private allyNames: string[] = []

    init(){
        this.c_key = this.input.keyboard.addKey('C')
        this.allyNames = ["テスト1","テスト2","テスト3","テスト4"]
    }

    preload() {
        this.load.image('logo', 'assets/img/phaser3-logo.png');

        this.load.glsl('boss', 'assets/shaders/boss.glsl.js');
    }

    create() {
        this.add.shader('Boss_background', 0, 0, 800, 600).setOrigin(0);

        const logo = this.add.image(400, 200, 'logo');

        logo.setInteractive()
        logo.on('pointerdown', () => {
            this.scene.remove("map")
            this.scene.start('mapManager',{key:"testMap",pos:{x: 15,y: 21},dire:Direction.UP})
        })

        this.tweens.add({
            targets: logo,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })
        this.description = this.add.text(400,500,'Click logo to load map scene');
        this.description.setOrigin(0.5);
    }
    update() {
        const c = Phaser.Input.Keyboard.JustDown(this.c_key)
        if(c){
            this.scene.launch("battleMenu",{charNames: this.allyNames})
        }
    }
}