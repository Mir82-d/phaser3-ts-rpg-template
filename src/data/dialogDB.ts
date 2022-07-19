import { Timelines } from "../type/Timelines";

export const dialogDB: Timelines = {
    testMap_npc: [
        {type: 'dialog',text: "This is a test dialogue.\nこれはにほんごです。",charName: "テスト1"},
        {type: 'dialog',text: "This is line 3.\n4ぎょうめです。",charName: "テスト1"},
        {type: 'dialog',text: "5ぎょうめですよ。",charName: "テスト1"},
        {type: 'end'}
    ],
    testMap_npc2: [
        {type: 'dialog',text: "うごかないやつです。"},
        {type: 'timelineTransition', timelineID:'choice00'}
    ],
    choice00: [
        {type: 'dialog',text: "選択肢を表示します。"},
        {type: 'choice',choices: [
            {text: 'はい', timelineID: 'choice00_a01'},
            {text: 'いいえ', timelineID: 'choice00_a02'},
        ]}
    ],
    choice00_a01: [
        {type: 'dialog',text: "はい を選びました。"},
        {type: 'end'}
    ],
    choice00_a02: [
        {type: 'dialog',text: "いいえ を選びました。"},
        {type: 'end'}
    ],
    //add timeline(dialog)
}