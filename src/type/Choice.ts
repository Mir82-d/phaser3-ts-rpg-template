//choice
export type Choice = {
    text: string,
    timelineID: string
}

export type Command = {
    text: string,
    commandID: string,
    target?: string,
    description?: string,
    soundID?: string,
    animationID?: string
}