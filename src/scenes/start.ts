import * as Phaser from "phaser";

export class Start extends Phaser.Scene {
  private startText?: Phaser.GameObjects.Text
  private description: Phaser.GameObjects.Text

  private bg_color: string = 'rgba(25, 25, 112, 1)'
  private fontStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: 'yellow', fontSize: '70px' }
  private fontStyle2: Phaser.Types.GameObjects.Text.TextStyle = { color: 'purple', fontSize: '30px' }

  init() {
    console.log("init")
  }

  preload () {
    console.log("Load what you need for the game scene")
  }

  create() {
    //set background color for all scenes
    this.cameras.main.setBackgroundColor(this.bg_color)

    this.startText = this.add.text(400, 300, 'START', this.fontStyle)

    this.startText.setOrigin(0.5)

    this.startText.setInteractive()
    this.startText.on('pointerdown', () => {
      this.scene.start('gameTest')
    })

    this.description = this.add.text(400,350,'Click start to load game scene',this.fontStyle2)
    this.description.setOrigin(0.5)
  }
}
