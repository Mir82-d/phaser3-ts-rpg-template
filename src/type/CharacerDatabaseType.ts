export type CharInfo = {
    name: string,
    hp: number,
    maxHp: number,
    ap: number,
    mp: number,
    maxMp: number,
    exp: number,
    commandID: string,
}

export type CharacterDatabaseType = {
    [charID: string]: CharInfo
}