import { Choice } from "../type/Choice";
import { Timeline } from "../type/Timeline";
import eventCenter from "../util/EventCenter";
import { ButtonSelector, ButtonSelectorConfig } from "./ButtonSelector";
import { DialogBox } from "./DialogBox";

export class DialogPlayer {

    private uiLayer: Phaser.GameObjects.Container

    private z_key!: Phaser.Input.Keyboard.Key
    private up_key!: Phaser.Input.Keyboard.Key
    private down_key!: Phaser.Input.Keyboard.Key

    private buttonSelector: ButtonSelector
    private buttons: Phaser.GameObjects.Text[] = []

    private timeline?: Timeline
    private timelineIndex = 0

    constructor(private scene: Phaser.Scene, private dialogBox: DialogBox, private textStyle: Phaser.Types.GameObjects.Text.TextStyle={}){

        this.uiLayer = this.scene.add.container(0, 0)
        this.buttons.length = 0

        eventCenter.on('next',(tmp_text:string)=>{
            if(dialogBox.isReadyToNext())
                this.next()
        })

        this.z_key = scene.input.keyboard.addKey('Z')
        this.up_key = scene.input.keyboard.addKey('up')
        this.down_key = scene.input.keyboard.addKey('down')
    }

    public start(timeline: Timeline){
        this.timeline = timeline
        this.next()
    }

    //execute next timeline
    private next(){
        if(!this.timeline){
            return
        }
        if(this.timelineIndex >= this.timeline.length) {
            return
        }
        const timelineEvent = this.timeline[this.timelineIndex++]

        switch(timelineEvent.type) {
            case 'dialog':
                if(timelineEvent.charName) {
                    //display char name
                    this.dialogBox.setCharNameText(timelineEvent.charName)
                }
                else {
                    //hide char name
                    this.dialogBox.clearCharNameText()
                }
                //this.dialogBox.setText(timelineEvent.text)
                this.dialogBox.typewriteText(timelineEvent.text,false)
                break
            case "timelineTransition":
                //init() <= timelineEvent.timelineID
                this.scene.scene.restart({timelineID: timelineEvent.timelineID})
                break
            case 'choice':
                this.setChoiceButtons(timelineEvent.choices)
                break
            case 'end':
                eventCenter.emit("end")
            default:
                break
        }
    }

    private setChoiceButtons(choices: Choice[]){
        if(choices.length === 0){
            return
        }
        const { width, height } = this.scene.game.canvas
        const buttonHeight = 30,buttonMargin = 20
        const panelwidth = 150
        const buttonGroupHeight = buttonHeight * choices.length + buttonMargin * (choices.length - 1)
        const buttonGroupOriginY = height*0.72 - buttonGroupHeight*0.5;

        const buttonPanel = new Phaser.GameObjects.Rectangle(this.scene,width*0.5,buttonGroupOriginY+buttonHeight,panelwidth,buttonGroupHeight,0x000000).setStrokeStyle(1, 0xffffff)
        this.uiLayer.add(buttonPanel)

        this.z_key.on('down',()=>{
            this.buttonSelector.confirmSelection(this.buttons)
        })
        this.down_key.on('down',()=>{
            this.buttonSelector.selectNextButton(1,this.buttons)
        })
        this.up_key.on('down',()=>{
            this.buttonSelector.selectNextButton(-1,this.buttons)
        })

        choices.forEach((choice, index)=>{
            const y = buttonGroupOriginY + buttonHeight * (index + 0.5)

            const button = new Phaser.GameObjects.Text(this.scene, width/2, y, choice.text, this.textStyle).setOrigin(0.5);
            button.setInteractive({
                useHandCursor: true
            })
            //仮
            button.on('pointerdown',()=>{
                this.scene.scene.restart({ timelineID: choice.timelineID })
            })
            button.on('selected',()=>{
                this.scene.scene.restart({ timelineID: choice.timelineID })
            })

            this.uiLayer.add(button)
            this.buttons.push(button)
        })
        const buttonSelectorConfig: ButtonSelectorConfig = {
            enableArrow: true,
            enableTint: false
        }
        this.buttonSelector = new ButtonSelector(this.scene,buttonSelectorConfig)
        this.buttonSelector.selectButton(0,this.buttons)
        //this.scene.add.existing(this.buttonSelector)
    }
}