import * as Phaser from "phaser";
import eventCenter from "./EventCenter";

export class BattleMenu extends Phaser.Scene{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key

    private buttons: Phaser.GameObjects.Text[] = []
    private m_buttons: Phaser.GameObjects.Text[] = []
    private a_buttons: Phaser.GameObjects.Text[] = []
    private tmp_buttons: Phaser.GameObjects.Text[] = []
    private selectedButtonIndex = 0
    private buttonSelector!: Phaser.GameObjects.Image
    private layer_1!: Phaser.GameObjects.Layer
    private layer_2!: Phaser.GameObjects.Layer
    private layer_3!: Phaser.GameObjects.Layer
    private charName: Phaser.GameObjects.Text
    private enemyName: Phaser.GameObjects.Text

    private charNameStr: string[] = []
    private enemyNameStr: string[] = []
    private char1Magic: string[] = []
    private char2Magic: string[] = []
    private char3Magic: string[] = []
    private char4Magic: string[] = []
    private char1MagicCategory: number[] = []
    private char2MagicCategory: number[] = []
    private char3MagicCategory: number[] = []
    private char4MagicCategory: number[] = []
    private charMagics: {[key: string]: string[]}
    private charMagicsCategory: {[key: number]: number[]}
    private NUMBER_OF_LINES = 2
    private MENU_PHASE = 1
    private pageIndex = 0
    private allyIndex = 0

    init(data: { charNames: string[];}) {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.z_key = this.input.keyboard.addKey('Z');
        this.x_key = this.input.keyboard.addKey('X');

        this.charNameStr = data.charNames
        this.enemyNameStr = ["てき1","てき2","てき3"]
        this.char1Magic = ["みかたまほう1","てきまほう2","ぜんたい3"]
        //ally:1,enemy:2,all:2
        this.char1MagicCategory = [1,0,2]
        this.char2Magic = ["ああ1","ああ2"]
        this.char2MagicCategory = [0,0]
        this.char3Magic = ["ヒーリングγ"]
        this.char3MagicCategory = [1]
        this.char4Magic = []
        this.char4MagicCategory = []
        this.charMagics = {
            0:this.char1Magic,
            1:this.char2Magic,
            2:this.char3Magic,
            3:this.char4Magic
        }
        this.charMagicsCategory = {
            0:this.char1MagicCategory,
            1:this.char2MagicCategory,
            2:this.char3MagicCategory,
            3:this.char4MagicCategory
        }
    }

    preload() {
        this.load.atlasXML('ui-texture','assets/img/uipack_rpg_sheet.png','assets/img/uipack_rpg_sheet.xml')
    }

    create() {
        //clear buttons array when restart this scene
        this.buttons.length = 0
        this.m_buttons.length = 0
        this.tmp_buttons.length = 0
        this.a_buttons.length = 0

        this.scene.bringToTop()
        const{ width, height } = this.scale

        //main menu panel
        const mainPanel = this.add.image(width*0.3,height*0.2,'ui-texture','panel_blue.png').setOrigin(0.5)
        mainPanel.scaleX = 3.1
        mainPanel.scaleY = 1.3

        //fight (button of left upside)
        const fight = this.add.text(mainPanel.x-60, mainPanel.y-25,'fight-button',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        fight.text = "たたかう"

        //magic (button of left downside)
        const magic = this.add.text(fight.x, fight.y+fight.displayHeight+30,'magic-button',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        magic.text = "まほう"

        //guard (button of right upside)
        const guard = this.add.text(fight.x+120, fight.y,'guard-button',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        guard.text = "ガード"

        //escape (button of right downside)
        const escape = this.add.text(guard.x, guard.y+guard.displayHeight+30,'guard-button',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        escape.text = "にげる"

        //push to buttons array
        this.buttons.push(fight)
        this.buttons.push(magic)
        this.buttons.push(guard)
        this.buttons.push(escape)

        //button selector
        this.buttonSelector = this.add.image(0,0,'ui-texture',"arrowSilver_right.png")
        this.buttonSelector.depth = 3

        //fight panel(page menu)
        this.layer_1 = this.add.layer();
        const fightPanel = this.add.image(width*0.55,height*0.4,'ui-texture','buttonLong_blue_pressed.png').setOrigin(0.5)
        fightPanel.scaleX = 3.4
        fightPanel.scaleY = 1.2
        
        const enemySelectGuide = this.add.text(fightPanel.x-fightPanel.displayWidth/2+90,fightPanel.y,'',{ "fontSize": "20px"}).setOrigin(0.5)
        enemySelectGuide.text = "どのてき?: "

        this.enemyName = this.add.text(enemySelectGuide.x+enemySelectGuide.displayWidth+40,fightPanel.y,'enemy-name',{ "fontSize": "20px"}).setOrigin(0.5)
        
        this.layer_1.add(fightPanel)
        this.layer_1.add(enemySelectGuide)
        this.layer_1.add(this.enemyName)

        //magic panel(page menu)
        this.layer_2 = this.add.layer();
        const magicPanel = this.add.image(width*0.7,height*0.2,'ui-texture','panel_blue.png').setOrigin(0.5)
        magicPanel.scaleX = 3.1
        magicPanel.scaleY = 1.7

        const charNameRect = this.add.image(magicPanel.x-magicPanel.displayWidth/2+70,magicPanel.y-magicPanel.displayHeight/2+10,
            'ui-texture','buttonLong_blue.png').setOrigin(0.5)
        charNameRect.scaleX = 0.8
        charNameRect.scaleY = 1.0

        this.charName = this.add.text(charNameRect.x,charNameRect.y,'char-name',{ "fontSize": "15px"}).setOrigin(0.5)

        const magic1 = this.add.text(magicPanel.x-30, magicPanel.y-25,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        const magic2 = this.add.text(magic1.x, magic1.y+25,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        const magic3 = this.add.text(magic2.x, magic2.y+25,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        const magic4 = this.add.text(magic3.x, magic3.y+25,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)

        this.layer_2.add(magicPanel)
        this.layer_2.add(charNameRect)
        this.layer_2.add(this.charName)
        this.layer_2.add(magic1)
        this.layer_2.add(magic2)
        this.layer_2.add(magic3)
        this.layer_2.add(magic4)
        //push to m_buttons array
        this.m_buttons.push(magic1)
        this.m_buttons.push(magic2)
        this.m_buttons.push(magic3)
        this.m_buttons.push(magic4)

        //ally select panel
        this.layer_3 = this.add.layer()
        const allySelectPanel = this.add.image(width*0.55,height*0.4,'ui-texture','buttonLong_blue_pressed.png').setOrigin(0.5)
        allySelectPanel.scaleX = 3.4
        allySelectPanel.scaleY = 1.2

        const ally1 = this.add.text(allySelectPanel.x-allySelectPanel.displayWidth/2+100,allySelectPanel.y,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        ally1.text = this.charNameStr[0]
        const ally2 = this.add.text(ally1.x+ally1.displayWidth+50,allySelectPanel.y,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        ally2.text = this.charNameStr[1]
        const ally3 = this.add.text(ally2.x+ally2.displayWidth+50,allySelectPanel.y,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        ally3.text = this.charNameStr[2]
        const ally4 = this.add.text(ally3.x+ally3.displayWidth+50,allySelectPanel.y,'',{ "fontSize": "20px", "align":"left"}).setOrigin(0.5)
        ally4.text = this.charNameStr[3]
        //remove '' object
        this.charNameStr = this.charNameStr.filter(object => !(object == ''))

        this.layer_3.add(allySelectPanel)
        this.layer_3.add(ally1)
        this.layer_3.add(ally2)
        this.layer_3.add(ally3)
        this.layer_3.add(ally4)

        //push to a_buttons array
        this.a_buttons.push(ally1)
        this.a_buttons.push(ally2)
        this.a_buttons.push(ally3)
        this.a_buttons.push(ally4)
        //remove '' object
        this.a_buttons = this.a_buttons.filter(object => !(object.text == ''))
        this.layer_1.setVisible(false)
        this.layer_2.setVisible(false)
        this.layer_3.setVisible(false)
        this.selectButton(0,this.buttons)
        this.selectPage(0)

        this.events.on("menu-close",()=>{
            this.scene.stop()
        })
        this.events.on("reset-menu",()=>{
            this.selectNextPage(1)
            this.selectButton(0,this.buttons)
            this.layer_2.setVisible(false)
            this.layer_3.setVisible(false)
            this.layer_1.setVisible(false)
            if(this.allyIndex == this.charNameStr.length){
                this.events.emit("menu-close")
            }
        })
        fight.on('selected',()=>{
            //TODO
            this.layer_1.setVisible(true)
            this.selectPage(0)
        })
        magic.on('selected',()=>{
            //TODO
            this.layer_2.setVisible(true)
            this.selectPage(this.allyIndex)
            if(this.tmp_buttons.length != 0){
                this.selectButton(0,this.tmp_buttons)
            }
        })
        guard.on('selected',()=>{
            //TODO
        })
        escape.on('selected',()=>{
            //TODO
            this.scene.stop()
            eventCenter.emit("back-to-title")
        })
        magic1.on('selected',()=>{
            //TODO
            console.log(this.charNameStr[this.pageIndex],this.charMagics[this.pageIndex][this.selectedButtonIndex])
            console.log(this.pageIndex,this.selectedButtonIndex) //charId,magicId
        })
        magic2.on('selected',()=>{
            //TODO
            console.log(this.charNameStr[this.pageIndex],this.charMagics[this.pageIndex][this.selectedButtonIndex])
            console.log(this.pageIndex,this.selectedButtonIndex) //charId,magicId
        })
        magic3.on('selected',()=>{
            //TODO
            console.log(this.charNameStr[this.pageIndex],this.charMagics[this.pageIndex][this.selectedButtonIndex])
            console.log(this.pageIndex,this.selectedButtonIndex) //charId,magicId
        })
        magic4.on('selected',()=>{
            //TODO
            console.log(this.charNameStr[this.pageIndex],this.charMagics[this.pageIndex][this.selectedButtonIndex])
            console.log(this.pageIndex,this.selectedButtonIndex) //charId,magicId
        })
        ally1.on('selected',()=>{
            //TODO
            console.log(this.a_buttons[this.selectedButtonIndex].text)
        })
        ally2.on('selected',()=>{
            //TODO
        })
        ally3.on('selected',()=>{
            //TODO
        })
        ally4.on('selected',()=>{
            //TODO
        })
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            fight.off('selected')
            magic.off('selected')
            guard.off('selected')
            escape.off('selected')
            magic1.off('selected')
            magic2.off('selected')
            magic3.off('selected')
            magic4.off('selected')
            this.events.off('menu-close')
            this.events.off('reset-menu')
        })
    }

    selectButton(index: number,buttonsArray: Phaser.GameObjects.Text[]) {
        const currentButton = buttonsArray[this.selectedButtonIndex]

	    // set the current selected button to a white tint
	    //currentButton.setTint(0xffffff)

	    const button = buttonsArray[index]

	    // set the newly selected button to a green tint
	    //button.setTint(0x66ff7f)

	    // move the cursor to the left edge
	    this.buttonSelector.x = button.x - button.displayWidth / 2 - 20
	    this.buttonSelector.y = button.y - 2

	    // store the new selected index
	    this.selectedButtonIndex = index
    }

    selectNextButton(change = 1,buttonsArray: Phaser.GameObjects.Text[]) {
        let index = this.selectedButtonIndex + change

        if(index >= buttonsArray.length){
            index = 0
        }
        else if(index < 0){
            index = buttonsArray.length-1
        }
        this.selectButton(index,buttonsArray)
    }

    confirmSelection(buttonsArray: Phaser.GameObjects.Text[]) {
        // get the currently selected button
	    const button = buttonsArray[this.selectedButtonIndex]

        // emit the 'selected' event
	    button.emit('selected')
    }

    selectNextPage(change = 1){
        if(this.layer_1.visible){
            let index = this.pageIndex + change
            if(index >= this.enemyNameStr.length){
                index = 0
            }
            else if(index < 0){
                index = this.enemyNameStr.length-1
            }
            this.selectPage(index)
        }
        else {
            let index = this.allyIndex + change
            if(index >= this.charNameStr.length){
                index = 0
            }
            else if(index < 0){
                index = this.charNameStr.length-1
            }
            this.selectPage(index)
        }
        
    }

    selectPage(index: number){
        //TODO
        if(this.layer_2.visible){
            this.charName.text = this.charNameStr[index]
            let i = 0
            this.tmp_buttons.length = 0
            this.m_buttons.forEach((object)=>{
                object.setVisible(false)
            })
            this.charMagics[index].forEach((txt)=>{
                this.tmp_buttons.push(this.m_buttons[i])
                this.tmp_buttons[i].text = txt
                this.tmp_buttons[i].setVisible(true)
                i++
            })
            this.allyIndex = index
        }
        else if(this.layer_1.visible){
            //TODO
            this.enemyName.text = this.enemyNameStr[index]
            this.pageIndex = index
        }
    }

    update() {
        const up = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        const down = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
        const left = Phaser.Input.Keyboard.JustDown(this.cursors.left!)
        const right = Phaser.Input.Keyboard.JustDown(this.cursors.right!)
        const z = Phaser.Input.Keyboard.JustUp(this.z_key!)
        const x = Phaser.Input.Keyboard.JustDown(this.x_key!)

        if(this.layer_1.visible){
            if(x){
                this.layer_1.setVisible(false)
            }
            else if(right){
                this.selectNextPage(1)
            }
            else if(left){
                this.selectNextPage(-1)
            }
            if(z){
                //TODO
                this.events.emit("reset-menu")
            }
        }
        //for magic selection menu
        else if(this.layer_2.visible){
            //TODO
            if(this.MENU_PHASE == 1){
                if(x){
                    this.layer_2.setVisible(false)
                    this.selectButton(1,this.buttons)
                }
                else if(z){
                    //TODO
                    this.confirmSelection(this.tmp_buttons)
                    this.layer_3.setVisible(true)
                    this.selectButton(0,this.a_buttons)
                    this.MENU_PHASE = 2
                }
                else if(up){
                    this.selectNextButton(-1,this.tmp_buttons)
                }
                else if(down){
                    this.selectNextButton(1,this.tmp_buttons)
                }
            }
            else if(this.MENU_PHASE == 2){
                if(x){
                    this.layer_3.setVisible(false)
                    this.MENU_PHASE = 1
                    this.selectButton(0,this.tmp_buttons)
                }
                else if(z){
                    this.confirmSelection(this.a_buttons)
                    this.MENU_PHASE = 1
                    this.events.emit("reset-menu")
                }
                else if(left){
                    this.selectNextButton(-1,this.a_buttons)
                }
                else if(right){
                    this.selectNextButton(1,this.a_buttons)
                }
            }
            else if(this.MENU_PHASE == 3){
                //TODO
                
            }
        }
        else{
            if(up){
                this.selectNextButton(-1,this.buttons)
            }
            else if(down){
                this.selectNextButton(1,this.buttons)
            }
            else if(left){
                this.selectNextButton(-this.NUMBER_OF_LINES,this.buttons)
            }
            else if(right){
                this.selectNextButton(this.NUMBER_OF_LINES,this.buttons)
            }
            else if(z){
                this.confirmSelection(this.buttons)
            }
            else if(x){
                //TODO
                this.selectNextPage(-1)
            }
        }
    }
}