import { Command } from "./Choice"

type MagicData = {
    type: 'magic',
    magics: Command[]
}

type MainCommandData = {
    type: 'command',
    commands: Command[]
}

export type CommandDataType = (MagicData|MainCommandData)[]