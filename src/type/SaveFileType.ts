import { Direction, Position } from "grid-engine"
import { CharacterDatabaseType } from "./CharacerDatabaseType"

export type SaveFileType = {
    status: CharacterDatabaseType,
    mapID: string,
    startPosition: Position,
    startDirection: Direction,
    flag?: string,
}