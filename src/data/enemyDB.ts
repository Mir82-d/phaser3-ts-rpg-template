import { EnemyDatabaseType } from "../type/EnemyDatabaseType";

export const enemyDB: EnemyDatabaseType = {
    enemy_test1: {
        name: "テストエネミー1",
        hp: 100,
        mp: 20,
        ap: 15,
        commands:[
            {text: "たたかう", commandID: "fight"},
            {text: "ガード", commandID: "guard"},
            {text: "にげる", commandID: "escape"},
        ],
        co_spawn:["enemy_test1","enemy_test2"],
        max_co_spawn: 3,
        enemyAtlasFrame: "enemy_42",
        glslLocation: "assets/shaders/background-purple.glsl.js",
        shaderName: "Background_Purple",
    },
    enemy_test2: {
        name: "テストエネミー2",
        hp: 150,
        mp: 20,
        ap: 20,
        commands:[
            {text: "たたかう", commandID: "fight"},
            {text: "まほう", commandID: "magic"},
            {text: "ガード", commandID: "guard"},
            {text: "にげる", commandID: "escape"},
        ],
        magics:[
            {text: "まほう1",commandID: 'magic1',target: 'enemy',soundID: '',animationID: ''},
            {text: "まほう2",commandID: 'magic2',target: 'ally',soundID: '',animationID: ''},
            {text: "まほう3",commandID: 'magic3',target: 'ally',soundID: '',animationID: ''},
        ],
        enemyAtlasFrame: "enemy_43",
        glslLocation: "assets/shaders/background-purple.glsl.js",
        shaderName: "Background_Purple",
    },
}