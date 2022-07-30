export enum MovementType {
    NONE = "none",
    RANDOM = "random",
    RADIUS = "radius",
    FOLLOW = "follow",
    MOVETO = "moveto",
}

export type MTInfo = {
    [charID: string] : MovementType
}