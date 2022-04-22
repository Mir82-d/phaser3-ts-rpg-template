import * as Phaser from "phaser";
import { GameConfig } from './config';
import { Start } from "./scenes/start";
import { GameTest } from "./scenes/gameTest";
import { DungeonMap } from "./scenes/dungeonMap";
import { TalkingWindow } from "./util/menu";
import { MapManager } from "./util/mapManager";

// Phaser3のゲームクラスの記述（Phaser.Gameクラスを継承したGameクラスの記述）
export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        // Phaser.Gameクラスにコンフィグを渡す
        super(config);

        // シーンにキーを割り振って登録
        this.scene.add("start", Start, false);
        this.scene.add("gameTest", GameTest, false);
        this.scene.add("mapManager",MapManager,false)
        //this.scene.add("map", MapTest, false);

        //util
        this.scene.add("talkingWindow",TalkingWindow,false);

        // シーンをスタート
        this.scene.start("start");
    }
}

// ブラウザでDOM描写終了直後に呼び出される
window.onload = () => {
    // Mainクラスのインスタンスを生成（ここで初めてゲームが生成）
    const game = new Game(GameConfig);
};