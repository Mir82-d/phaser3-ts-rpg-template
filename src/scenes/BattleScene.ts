import * as Phaser from "phaser";
import { GameConfig } from "../config";
import { commandDatabase } from "../data/commandDB";
import { InGameMenu } from "../objects/InGameMenu";
import { Command } from "../type/Choice";
import { CommandDataBaseType } from "../type/CommandDataBaseType";
import eventCenter from "../util/EventCenter";

export class BattleScene extends Phaser.Scene {

    private allyTurn = 0
    private commands: CommandDataBaseType
    private menu: InGameMenu
    private menu2: InGameMenu
    private menu3: InGameMenu
    private menu4: InGameMenu

    constructor(){
        super(GameConfig)
        this.commands = commandDatabase
        
    }

    init(){

    }

    preload(){

    }

    create(){
        eventCenter.on('return',()=>{
            
        })
        eventCenter.on('command-selected',(command: Command)=>{
            this.commandHandler(command)
        })
    }

    update(){

    }

    commandHandler(command: Command){
        switch(command.commandID){
            case 'fight':
                //TODO
                break
            case 'magic':
                //TODO
                break
            case 'guard':
                //TODO
                break
            case 'escape':
                //TODO
                break

            default:
                break
        }
    }

    createMenu(){

    }

    increaseTurn(){

    }
}