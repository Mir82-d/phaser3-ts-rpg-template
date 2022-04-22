import * as Phaser from "phaser";
import { GameConfig } from "../config";
import eventCenter from "./eventCenter";

enum T_STATE {
    Talking,
    End,
    Next
}

export class TalkingWindow extends Phaser.Scene{
    
    private lowerRect : Phaser.GameObjects.Rectangle
    private nameRect : Phaser.GameObjects.Rectangle
    private dialogue : Phaser.GameObjects.Text
    private dialogueString : string
    private name : Phaser.GameObjects.Text
    private nameString : string
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'white', fontSize: '20px' }
    private t_state : T_STATE

    constructor(){
        super(GameConfig);
        this.dialogueString = "null"
        this.nameString = "null"
    }

    talkingWindow(){
        Phaser.Scene.call(TalkingWindow,{ key: 'talkingWindow' })
    }

    //get name,dialogue from map class
    init(data: { name: string; txt: string; }){
        this.nameString = data.name
        this.dialogueString = data.txt
    }

    preload(){

    }

    create(){
        this.scene.bringToTop()
        this.lowerRect = this.add.rectangle(400, 550, 750, 100,0x000000)
        this.lowerRect.setStrokeStyle(2, 0xffffff)
        this.nameRect = this.add.rectangle(100,480,200,40,0x000000).setOrigin(0.5)
        this.nameRect.setStrokeStyle(2, 0xffffff)

        this.name = this.add.text(100,480,this.nameString,this.fontStyle).setOrigin(0.5)
        this.dialogue = this.add.text(60, 525, '',this.fontStyle).setMaxLines(2)
        this.typewriteText(this.dialogueString)
        
    }

    update(){
        //これは仮
        const z = this.input.keyboard.addKey('Z');
        if(Phaser.Input.Keyboard.JustDown(z)){
            if(this.t_state == T_STATE.End){
                this.scene.resume('map')
                this.scene.setVisible(false, 'talkingWindow')
                this.scene.setActive(false, 'talkingWindow')
            }
            if(this.t_state == T_STATE.Talking){
                this.displayText(this.dialogueString)
            }
        }
    }

    typewriteText(txt : string){
        this.t_state = T_STATE.Talking
        const length = txt.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.dialogue.text += txt[i]
                ++i
                if(i == length){
                    this.t_state = T_STATE.End
                }
            },
            repeat: length - 1,
            delay: 50
        })
    }
    displayText(txt : string){
        this.t_state = T_STATE.End
        this.dialogue.text = txt
    }
    setNameAndDialogue(name:string,txt:string){
        this.nameString = name
        this.dialogueString = txt
    }
}

export class MapMenu extends Phaser.Scene{
    
}

export class BattleMenu extends Phaser.Scene{

}