import { Direction, Position } from "grid-engine";
import { fileDB } from "../data/fileDB";
import { CharacterDatabaseType } from "../type/CharacerDatabaseType";
import { SaveFileType } from "../type/SaveFileType";

export class DataManager{

    private charDataBase: CharacterDatabaseType
    private saveData: SaveFileType = {
        status: null,
        mapID: null,
        startDirection: null,
        startPosition: null
    }
    /**
     * Get information of file path, position and direction.
     * マップを読み込むときの情報を取り出す
     * @param mapKey 
     * @param startPosition 
     * @param startDirection 
     */
     public getDataInfo(mapKey: string, startPosition: Position, startDirection: Direction){
        let fileInfo = fileDB[mapKey]
        return {
            data:fileInfo,
            pos:{startPos: startPosition, startDire: startDirection}
        }
    }
    /**
     * Update all status and save data to localStorage.
     * @param charData 
     * @param mapID 
     * @param pos 
     * @param dire 
     */
    public saveStatus(charData: CharacterDatabaseType,mapID: string,pos: Position, dire: Direction){
        //TODO
        this.charDataBase = charData
        this.saveData.status = this.charDataBase
        this.saveData.mapID = mapID
        this.saveData.startPosition = pos
        this.saveData.startDirection = dire
        localStorage.setItem('saveFile',JSON.stringify(this.saveData))
    }
    /**
     * Load save data from localStorage.
     */
    public loadStatus(){
        //TODO
        try{
            this.saveData = JSON.parse(localStorage.getItem('saveFile'))
            console.log(this.saveData)
        }
        catch{
            console.error('Could not load save file.')
        }
    }
    /**
     * Get character status from temporary saved status in localStorage.(key: tmp_status)
     * @returns 
     */
    public getStatus(){
        try{
            let tmp_status:CharacterDatabaseType = JSON.parse(localStorage.getItem('tmp_status'))
            return tmp_status
        }
        catch{
            console.error('Could not load temporary status file.')
        }
    }
    /**
     * Just update character status and temporary save to localStorage.(key: tmp_status)
     * @param charData 
     */
    public updateStatus(charData: CharacterDatabaseType){
        this.charDataBase = charData
        localStorage.setItem('tmp_status',JSON.stringify(this.charDataBase))
    }
}