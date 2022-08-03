import { Command } from "./Choice"
/**
 * @name the string text of character name.
 * @commands the array of main commands
 * @magics the array of magic commands
 * @healmagics the array of heal magic commands
 */
export type CommandDataType = {
    name: string
    commands: Command[]
    magics: Command[]
    healMagics: Command[]
}
