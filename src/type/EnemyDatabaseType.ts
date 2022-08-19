import { Command } from "./Choice"
/**
 * Enemy database type.
 * @name the string name of enemy
 * @hp enemy hp
 * @ap enemy attack point
 * @mp enemy magic point
 * @commands the base command of enemy
 * @magics the magic(consume mp) command of enemy
 * @co_spawn the id(s) array of enemy that spawns with this enemy
 * @max_co_spawn maximum number of enemies spawning together 
 * @bgmLocation bgm file path location
 * @glslLocation glsl file path location
 * @shaderName the shader name of glsl file
 * @backImgLocation background image file location (Use when not using glsl)
 * @enemyImgLocation enemy image file location (Use when not using atlas frame)
 * @enemyImgScale enemy image scale (Use when not using atlas frame)
 */
export type EnemyInfo = {
    name: string,
    hp: number,
    ap: number,
    mp: number,
    commands: Command[],
    magics?: Command[],
    co_spawn?: string[],
    max_co_spawn?: number,
    bgmLocation?: string,
    glslLocation?: string,
    shaderName?: string,
    backImgLocation?: string,
    enemyAtlasFrame?: string,
    enemyImgLocation?: string,
    enemyImgScale?: number,
}

export type EnemyDatabaseType = {
    [enemyID: string]: EnemyInfo
}