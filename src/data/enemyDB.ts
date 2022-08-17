import { EnemyDatabaseType } from "../type/EnemyDatabaseType";

export const enemyDB: EnemyDatabaseType = {
    enemy_test1: {
        name: "テストエネミー1",
        hp: 100,
        mp: 20,
        ap: 15,
        commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'にげる', commandID: 'escape'},
        ],
        glslLocation: 'assets/shaders/background-purple.glsl.js',
        shaderName: 'Background_Purple',
    },
    enemy_test2: {
        name: "テストエネミー2",
        hp: 150,
        mp: 20,
        ap: 20,
        commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'にげる', commandID: 'escape'},
        ],
        magics:[
            {text: "まほう1",commandID: 'magic1',target: 'enemy',soundID: '',animationID: ''},
            {text: "まほう2",commandID: 'magic2',target: 'ally',soundID: '',animationID: ''},
            {text: "まほう3",commandID: 'magic3',target: 'ally',soundID: '',animationID: ''},
        ],
        glslLocation: 'assets/shaders/background-purple.glsl.js',
        shaderName: 'Background_Purple',
    },
}