import { CommandDataBaseType } from "../type/CommandDatabaseType";

//TODO
export const commandDatabase: CommandDataBaseType = {
    ally1:{
        name:"テスト1",
        commands:[
            {text: "たたかう", commandID: "fight"},
            {text: "まほう", commandID: "magic"},
            {text: "ガード", commandID: "guard"},
            {text: "にげる", commandID: "escape"},
        ],
        magics:[
            {text: "まほう1",commandID: 'magic1',target: 'enemy',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',target: 'ally',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',target: 'ally',soundID: '',animationID: '',
            description: ""},
        ],
        healMagics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',soundID: '',animationID: '',
            description: ""},
        ]
    },
    ally2:{
        name:'テスト2',
        commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'いのる', commandID: 'pray'},
        ],
        magics:[
            {text: "まほう1",commandID: 'magic1',target: 'ally',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',target: 'enemy',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',target: 'enemy',soundID: '',animationID: '',
            description: ""},
        ],
        healMagics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
        ]
    },
    ally3:{
        name:'テスト3',
        commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'とくぎ', commandID: 'special_skill'},
        ],
        magics:[
            {text: "まほう1",commandID: 'magic1',target: 'ally',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',target: 'ally',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',target: 'ally',soundID: '',animationID: '',
            description: ""},
        ],
        healMagics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',soundID: '',animationID: '',
            description: ""},
        ]
    },
    ally4:{
        name:'テスト4',
        commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'へんしん', commandID: 'transform'},
            {text: 'だます', commandID: 'cheat'},
        ],
        magics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',soundID: '',animationID: '',
            description: ""},
        ],
        healMagics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',soundID: '',animationID: '',
            description: ""},
        ]
    },
}