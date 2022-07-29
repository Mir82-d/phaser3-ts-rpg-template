export type FileInfo = {
    tilesetLocation: string,
    tileKey: string,
    jsonKey: string,
    jsonLocation: string,
    enemySpriteLocation?: string,
    enemySpriteKey?: string,
    enemyAtlasLocation?: string,
    mapName: string,
    settingID: string,
}

export type FileDBType = {
    [settingID: string]: FileInfo
}