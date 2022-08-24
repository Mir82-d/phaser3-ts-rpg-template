export type CharInfo = {
    name: string,
    hp: number,
    ap: number,
    mp: number,
    exp: number,
    commandID: string,
}

export type CharacterDatabaseType = {
    [charID: string]: CharInfo
}