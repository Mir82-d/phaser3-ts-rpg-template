import { Command } from "./Choice"

type CommandData = {
    name: string
    commands: Command[]
    magics: Command[]
    healMagics: Command[]
}

export type CommandDataType = (CommandData)