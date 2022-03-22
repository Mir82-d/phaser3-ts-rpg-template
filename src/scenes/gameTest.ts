import * as Phaser from "phaser";

export class GameTest extends Phaser.Scene {

    private description:  Phaser.GameObjects.Text

    preload() {
        //this.load.image('logo', '../assets/img/phaser3-logo.png');
        this.load.image('logo', 'assets/img/phaser3-logo.png');

        this.load.glsl('boss', 'assets/shaders/boss.glsl.js');
    }

    create() {
        this.add.shader('Boss_background', 0, 0, 800, 600).setOrigin(0);

        const logo = this.add.image(400, 200, 'logo');

        logo.setInteractive()
        logo.on('pointerdown', () => {
        this.scene.start('mapTest')
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
}