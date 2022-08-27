
export type SoundInfo = {
    key: string,
    path: string,
}

export type SoundID2Path = {
    [soundID: string]: SoundInfo
}

export type SoundDatabaseType = {
    se: SoundID2Path,
    bgm: SoundID2Path
}