//choice
export type Choice = {
    text: string,
    timelineID: string
}

export type Command = {
    text: string,
    commandID: string,
    description?: string,
    soundID?: string,
    animationID?: string
}
//TODO
export type Magic = {
    text: string,
    magicID: string,
    description?: string,
    soundID?: string,
    animationID?: string
}