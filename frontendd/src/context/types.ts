export enum ETypes {
    removeID = 'removeID',

    changeIMG_ID = 'removeIMG_ID',

    changeDescriptionID = 'changeDescriptionID',

    changeCountAllID = 'changeCountAllID',

    setState = 'setState',

    DELETE = 'DELETE',

    DEFAULT = 'DEFAULT'
}

export type TTypes = ETypes.removeID | ETypes.changeDescriptionID | 
    ETypes.changeCountAllID | ETypes.setState | ETypes.DELETE | ETypes.DEFAULT |
    ETypes.changeIMG_ID