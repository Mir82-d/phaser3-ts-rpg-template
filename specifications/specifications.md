# Phaser 3 RPG template(仮) 仕様書
<details open>
<summary>参考リンク</summary>
  
  - [タイルマップの作り方](#タイルマップの作り方)
  - [Grid-engine リファレンス](https://annoraaq.github.io/grid-engine/typedoc/index.html)
  - [Phaser3 リファレンス](https://photonstorm.github.io/phaser3-docs/)
</details>

- [Phaser 3 RPG template(仮) 仕様書](#phaser-3-rpg-template仮-仕様書)
  - [タイルマップの作り方](#タイルマップの作り方)
    - [制約条件](#制約条件)
  - [基本構造](#基本構造)
    - [マップ画面](#マップ画面)
    - [戦闘画面](#戦闘画面)
    - [データベース](#データベース)
  - [使い方](#使い方)
  
## タイルマップの作り方

[大まかな流れ](https://medium.com/swlh/grid-based-movement-in-a-top-down-2d-rpg-with-phaser-3-e3a3486eb2fd)
### 制約条件
![レイヤー条件](img/layerConstraints.png)
- "playerField"という名前のレイヤーをキャラクターレイヤーとする。

## 基本構造

### マップ画面
![マップ画面](img/mapStructure.png)
- MapManager.ts
  - マップを切り替えるときの情報を取得するクラス。将来的にBGMの制御をこのクラスで行う。裏で動いていて直接オブジェクトの描画などはしない。
- DungeonMap.ts
  - 情報を受け取ってゲームオブジェクトの描画、キャラクターの操作とかを行うクラス。各マップのNPC配置、敵の湧きポイントなどはこのクラスを継承した子クラスで行う。詳細:[マップの作り方](#マップの作り方)
- TalkingWindow.ts
  - NPCに話しかけたときに表示するポップアップウィンドウのクラス
- MapMenu.ts
  - マップで開くメニュー画面のクラス

### 戦闘画面
Work in progress.

### データベース

すべてのデータベースはTypeScriptのオブジェクトリテラルと辞書型オブジェクトで定義している。
- fileDB.ts
  - jsonとかタイル画像とかの場所を記載するデータベース
- dialogDB.ts
  - NPCのセリフを格納するデータベース
- commandDB.ts
  - キャラクターのコマンド情報を格納するデータベース
  
## 使い方
