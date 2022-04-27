import * as Phaser from "phaser";
import { GameConfig } from "../config";
import eventCenter from "./eventCenter";

export class TalkingWindow extends Phaser.Scene{
    
    private lowerRect : Phaser.GameObjects.Rectangle
    private nameRect : Phaser.GameObjects.Rectangle
    private dialogue : Phaser.GameObjects.Text
    private dialogueString : string
    private dialogueArr : string[]
    private name : Phaser.GameObjects.Text
    private nameString : string
    private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'white', fontSize: '20px' }
    private count : number
    private timerEvent : Phaser.Time.TimerEvent

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
        this.dialogueArr = this.dialogueString.split("\n")
        this.count = 0
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

        eventCenter.on("count-up", () => this.count++, this)
        //eventCenter.on("skip", this.displayText, this)
        eventCenter.on("next", this.typewriteText, this)
        eventCenter.on("end",()=>{
            this.time.removeAllEvents()
            this.scene.resume('map')
            this.scene.setVisible(false, 'talkingWindow')
            this.scene.setActive(false, 'talkingWindow')
        }, this)

        this.events.on(Phaser.Scenes.Events.SHUTDOWN,()=>{
            eventCenter.off("count-up")
            //eventCenter.off("skip")
            eventCenter.off("next")
            eventCenter.off("end")
        })

        this.typewriteText(this.dialogueArr[0])
    }

    update(){
        this.talkHandler()
    }

    typewriteText(txt : string){
        const length = txt.length
        let i = 0
        this.timerEvent = this.time.addEvent({
            callback: () => {
                this.dialogue.text += txt[i]
                ++i
                if(i == length){
                    eventCenter.emit("count-up")
                }
            },
            repeat: length - 1,
            delay: 40,
        })
    }
    displayText(txt : string){
        this.time.removeAllEvents()
        //this.timerEvent.remove()
        this.dialogue.text = txt
        eventCenter.emit("count-up")
    }
    talkHandler(){
        const z = this.input.keyboard.addKey('Z');
        if(this.timerEvent.getRemaining()==0){
            //this.timerEvent.remove()
            this.time.removeAllEvents()
            if(this.count < this.dialogueArr.length){
                if(this.count > 1){
                    if(this.count % 2 == 0){
                        if(Phaser.Input.Keyboard.JustDown(z)){
                            this.dialogue.text = this.dialogueArr[this.count-1]
                            eventCenter.emit("next","\n"+this.dialogueArr[this.count])
                        }
                    }
                    else{
                        this.dialogue.text = this.dialogueArr[this.count-1]
                        eventCenter.emit("next","\n"+this.dialogueArr[this.count])
                    }
                }
                else {
                    eventCenter.emit("next","\n"+this.dialogueArr[this.count])
                }
            }
            else {
                if(Phaser.Input.Keyboard.JustDown(z))
                eventCenter.emit("end")
            }
        }
    }

}

export class MapMenu extends Phaser.Scene{
    
}

export class BattleMenu extends Phaser.Scene{

}