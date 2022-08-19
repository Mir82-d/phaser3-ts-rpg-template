/**
 * The type of file path information.
 * @tilesetLocation the file path of tileset image
 * @tileKey the key(id) of tileset Same tileset must be same id.
 * @jsonKey the key(id) of tilemap json
 * @jsonLocation the file path of tilemap json
 * @enemySpriteLocation (OPTIONAL) the file path of enemy sprite image
 * @enemySpriteKey (OPTIONAL) the key(id) of enemy sprite image
 * @enemyAtlasLocation (OPTIONAL) the file path of enemy sprite's atlas
 * @mapName the dungeon map name. NOT id.
 * @settingID the setting id of the dungeon map
 */
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
    bgmLocation?: string,
    bgmID?: string,
}

export type FileDBType = {
    [settingID: string]: FileInfo
}