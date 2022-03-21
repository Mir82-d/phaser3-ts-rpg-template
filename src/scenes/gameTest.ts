import * as Phaser from "phaser";

export class GameTest extends Phaser.Scene
{

    preload ()
    {
        //this.load.image('logo', '../assets/img/phaser3-logo.png');
        this.load.image('logo', 'assets/img/phaser3-logo.png');
        
        this.load.glsl('boss', 'assets/shaders/boss.glsl.js');
    }

    create ()
    {
        this.add.shader('Boss_background', 0, 0, 800, 600).setOrigin(0);

        const logo = this.add.image(400, 200, 'logo');

        this.tweens.add({
            targets: logo,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })
    }
}