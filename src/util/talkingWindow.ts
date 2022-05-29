import { Timeline } from "../type/Timeline";
import { timelineData } from "../data/timeline";
import { DialogBox, DialogBoxConfig } from "../objects/DialogBox";
import { DialogPlayer } from "../objects/DialogPlayer";
import eventCenter from "./EventCenter";

export class TalkingWindow extends Phaser.Scene {

    private timeline?: Timeline

    private z_key!: Phaser.Input.Keyboard.Key

    init(data: any){
        this.z_key = this.input.keyboard.addKey('Z');

        const timelineID = data.timelineID

        if(!(timelineID in timelineData)) {
            console.error(`[ERROR] タイムラインID[${timelineID}]は登録されていません`)
            return
        }

        this.timeline = timelineData[timelineID]
    }

    create() {
        this.scene.bringToTop()
        if(!this.timeline){
            return
        }

        eventCenter.on("end",()=>{
            this.scene.resume('map')
            this.scene.stop()
        }, this)

        const { width, height } = this.scale

        const dialogBoxHeight = 100
        const dialogBoxMargin = 20
        const dialogBoxConfig: DialogBoxConfig = {
            x: width*0.5,
            y: height - dialogBoxMargin - dialogBoxHeight*0.5,
            width: width - dialogBoxMargin*2,
            height: dialogBoxHeight,
            padding: 25,
            margin: dialogBoxMargin,
            textStyle: {fontSize:"20px"}
        }
        const dialogBox = new DialogBox(this, dialogBoxConfig)

        //dialog player
        const dialogPlayer = new DialogPlayer(this, dialogBox, {fontSize:"20px"})

        dialogPlayer.start(this.timeline)
        this.add.existing(dialogBox)
    }

    update(){
        const z = Phaser.Input.Keyboard.JustDown(this.z_key)
        if(z){
            eventCenter.emit("next")
        }
    }

}