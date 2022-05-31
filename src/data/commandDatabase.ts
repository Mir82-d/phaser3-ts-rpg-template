import { CommandDataBaseType } from "../type/CommandDataBaseType";

//TODO
export const commandDatabase: CommandDataBaseType = {
    ally1:[
        {type:'command',commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'にげる', commandID: 'escape'},
        ]},
        {type:'magic',magics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',soundID: '',animationID: '',
            description: ""},
        ]}
    ],
    ally2:[
        {type:'command',commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'いのる', commandID: 'pray'},
        ]},
        {type:'magic',magics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',soundID: '',animationID: '',
            description: ""},
        ]}
    ],
    ally3:[
        {type:'command',commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'まほう', commandID: 'magic'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'だます', commandID: 'cheat'},
        ]},
        {type:'magic',magics:[
            {text: "まほう1",commandID: 'magic1',soundID: '',animationID: '',
            description: ""},
            {text: "まほう2",commandID: 'magic2',soundID: '',animationID: '',
            description: ""},
            {text: "まほう3",commandID: 'magic3',soundID: '',animationID: '',
            description: ""},
            {text: "まほう4",commandID: 'magic4',soundID: '',animationID: '',
            description: ""},
        ]}
    ],
    ally4:[
        {type:'command',commands:[
            {text: 'たたかう', commandID: 'fight'},
            {text: 'ガード', commandID: 'guard'},
            {text: 'へんしん', commandID: 'transform'},
        ]},
        {type:'magic',magics:[
            
        ]}
    ],
}