import * as Phaser from "phaser";

export class LoadingScene extends Phaser.Scene{

    private bg_color: string = 'rgba(0, 0, 0, 1)'
    private text: Phaser.GameObjects.Text
    private passToData: any
    private nextScene: Phaser.Scene

    init(object: any){
        this.passToData = object.data
        this.nextScene = object.next
    }

    preload(){
        //TODO
    }

    create(){
        this.scene.bringToTop()
        const{ width, height } = this.scale
        this.cameras.main.setBackgroundColor(this.bg_color)
        this.text = this.add.text(width*0.8,height*0.8,'Loading...')

        this.scene.add('map',this.nextScene,false)
        this.scene.start('map',this.passToData)
    }

}