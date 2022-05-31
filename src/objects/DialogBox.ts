import * as Phaser from "phaser";

export type DialogBoxConfig = {
    x: number,
    y: number,
    width: number,
    height: number,
    padding?: number,
    margin?: number,
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
}

export class DialogBox extends Phaser.GameObjects.Container {
   
    private box: Phaser.GameObjects.Rectangle
    private text: Phaser.GameObjects.Text

    private charNameBox: Phaser.GameObjects.Rectangle
    private charNameTxt: Phaser.GameObjects.Text

    private padding: number
    private isReady: boolean

    constructor(public scene: Phaser.Scene,{x, y, width, height, padding=10, margin = 10, textStyle={} }: DialogBoxConfig){
        super(scene, 0, 0)

        //rectangle
        this.box = new Phaser.GameObjects.Rectangle(this.scene, x, y, width, height, 0x000000).setStrokeStyle(2,0xffffff)
        this.add(this.box) //add to the Container

        //word wrap
        const dialogBoxTextStyle = {
            ...textStyle,
            wordWrap: { width: width - padding*2, useAdvancedWrap: true}
        }
        //dialog text
        this.text = new Phaser.GameObjects.Text(this.scene, x - width/2 + padding, y - height/2 + padding, '', dialogBoxTextStyle)
        this.add(this.text)

        this.charNameBox = new Phaser.GameObjects.Rectangle(this.scene, x - width/2, y - height/2 - margin, 0, 40, 0x000000).setStrokeStyle(2, 0xffffff)
        this.charNameBox.setOrigin(0,1) //left downside
        this.charNameBox.setVisible(false)
        this.add(this.charNameBox) //add to the container

        //name text
        this.charNameTxt = new Phaser.GameObjects.Text(this.scene, x - width/2 + padding, y - height/2 - margin - 20, '', textStyle)
        this.charNameTxt.setOrigin(0,0.5)
        this.charNameTxt.setVisible(false)
        this.add(this.charNameTxt) //add to the container

        this.padding = padding
        this.isReady = false
    }
    //set the dialog text
    public setText(text: string){
        this.text.setText(text)
    }
    //get currently displayed text
    public getText(){
        return this.text.text
    }
    //text typewriter param:txt continuity:boolean (whether to connect letters)
    public typewriteText(txt : string,continuity: boolean){
        if(!continuity){
            this.text.setText("")
        }
        else{
            this.text.text += "\n"
        }
        this.isReady = false
        const length = txt.length
        let i = 0
        this.scene.time.addEvent({
            callback: () => {
                this.text.text += txt[i]
                ++i
                if(i == length){
                    this.isReady = true
                }
            },
            repeat: length - 1,
            delay: 40,
        })
    }

    //set the name text
    public setCharNameText(name: string){
        this.charNameTxt.setText(name)

        const bounds = this.charNameTxt.getBounds()
        this.charNameBox.width = bounds.width + this.padding*2

        this.charNameBox.geom.width = this.charNameBox.width
        this.charNameBox.update()

        this.charNameTxt.setVisible(true)
        this.charNameBox.setVisible(true)
    }

    public clearCharNameText(){
        this.charNameBox.setVisible(false)
        this.charNameTxt.setVisible(false)
    }
    //when callback event finished, it returns true
    public isReadyToNext(){
        return this.isReady
    }
}