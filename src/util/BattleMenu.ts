import * as Phaser from "phaser";
import { InGameMenu } from "../objects/InGameMenu";
import eventCenter from "./EventCenter";

export class BattleMenu extends Phaser.Scene {

    private ingameMenu: InGameMenu
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private z_key!: Phaser.Input.Keyboard.Key
    private x_key!: Phaser.Input.Keyboard.Key


}