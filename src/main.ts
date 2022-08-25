import * as Phaser from "phaser";
import { GameConfig } from './config';
import { Start } from "./scenes/Start";
import { GameTest } from "./scenes/GameTest";
import { TalkingWindow } from "./util/TalkingWindow";
import { GameManager } from "./class/GameManager";
import TitleMenu from "./scenes/TitleMenu";
import { MapMenu } from "./util/MapMenu";
import { BattleMenu } from "./util/BattleMenu";
import { MenuTest } from "./util/MenuTest";
import { LoadingScene } from "./scenes/LoadingScene";
import { BattleScene } from "./scenes/BattleScene";

// Phaser3のゲームクラスの記述（Phaser.Gameクラスを継承したGameクラスの記述）
export class Game extends Phaser.Game {

    constructor(config: Phaser.Types.Core.GameConfig) {
        // Phaser.Gameクラスにコンフィグを渡す
        super(config);

        // シーンにキーを割り振って登録
        //this.scene.add("start", Start, false)
        this.scene.add("gameTest", GameTest, false)
        this.scene.add("gameManager",GameManager,false)
        this.scene.add("titleMenu",TitleMenu,false)
        this.scene.add("battleScene",BattleScene,false)

        //util
        this.scene.add("talkingWindow",TalkingWindow,false)
        this.scene.add("mapMenu",MapMenu,false)
        //this.scene.add("battleMenu",BattleMenu,false)
        this.scene.add("menuTest",MenuTest,false)
        this.scene.add("loading",LoadingScene,false)

        // シーンをスタート
        this.scene.start("titleMenu")
    }
}

export const game = new Game(GameConfig)

export const sceneManager = new Phaser.Scenes.SceneManager(game,GameConfig)