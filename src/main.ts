import * as Phaser from "phaser";
import { GameConfig } from './config';
import { Start } from "./scenes/Start";
import { GameTest } from "./scenes/GameTest";
import { TalkingWindow } from "./util/TalkingWindow";
import { MapManager } from "./util/MapManager";
import TitleMenu from "./scenes/TitleMenu";

// Phaser3のゲームクラスの記述（Phaser.Gameクラスを継承したGameクラスの記述）
export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        // Phaser.Gameクラスにコンフィグを渡す
        super(config);

        // シーンにキーを割り振って登録
        this.scene.add("start", Start, false);
        this.scene.add("gameTest", GameTest, false);
        this.scene.add("mapManager",MapManager,false)
        this.scene.add("titleMenu",TitleMenu,false)
        //this.scene.add("map", MapTest, false);

        //util
        this.scene.add("talkingWindow",TalkingWindow,false);

        // シーンをスタート
        this.scene.start("titleMenu");
    }
}

// ブラウザでDOM描写終了直後に呼び出される
window.onload = () => {
    // Mainクラスのインスタンスを生成（ここで初めてゲームが生成）
    const game = new Game(GameConfig);
};