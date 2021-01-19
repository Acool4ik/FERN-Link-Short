export interface IListItem {
    
    readonly _id: string 

    readonly _linkShort: string 

    readonly _linkLong: string
    
    description?: string

    readonly _dataCreated: number | string

    countAll: number[] | []

    img?: string

}

