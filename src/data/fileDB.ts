import { FileDBType } from "../type/FileDBType";

export const fileDB: FileDBType = {
    "testMap": {
        tilesetLocation:"assets/img/test-dungeon-tileset.png",
        tileKey:"tile1",
        jsonKey:"test-dungeon-map",
        jsonLocation:"assets/json/test_map.json",
        mapName:"Test Dungeon",
        settingID:"testMap",
    },
    "testMap2": {
        tilesetLocation:"assets/img/test-dungeon-tileset.png",
        tileKey:"tile1",
        jsonKey:"test-dungeon-map2",
        jsonLocation:"assets/json/test_map2.json",
        mapName:"Test Dungeon 2",
        settingID:"testMap2",
        enemyAtlasLocation:"assets/img/enemy_atlas.json",
        enemySpriteKey:"enemies1",
        enemySpriteLocation:"assets/img/enemy.png"
    },
}