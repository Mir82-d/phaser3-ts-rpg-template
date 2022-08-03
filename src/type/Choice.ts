/**
 * The type of choice.
 * @text the string text of choice
 * @timelineID the id of timeline(dialog)
 */
export type Choice = {
    text: string,
    timelineID: string
}
/**
 * The type of command.
 * @text the string text of command
 * @commandID the id of command
 * @target (OPTIONAL)the target id of selected(try to select) command
 * @description (OPTIONAL)the description of command
 * @soundID (OPTIONAL)the sound effect id associated with command
 * @animationID (OPTIONAL)the animation id associated with command
 */
export type Command = {
    text: string,
    commandID: string,
    target?: string,
    description?: string,
    soundID?: string,
    animationID?: string
}