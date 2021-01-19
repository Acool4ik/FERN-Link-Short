import { ETypes, TTypes } from '../types'
import { IListItem } from '../../interfaces/IListItem'

interface IAction {
    type: TTypes

    payload: {

        id?: string

        description?: string

        links?: IListItem[] | []

        countAll?: number

        img?: string

    }
}

const handlers = {
    [ETypes.removeID]: 
        (state: IListItem[] | [], action: IAction) => 
        ([...action.payload.links || []]),

    [ETypes.changeIMG_ID]: 
        (state: IListItem[] | [], action: IAction) => 
        ([...action.payload.links || []]),

    [ETypes.changeDescriptionID]: 
        (state: IListItem[] | [], action: IAction) => 
        ([...action.payload.links || []]),

    [ETypes.changeCountAllID]: 
        (state: IListItem[] | [], action: IAction) => 
        ([...action.payload.links || []]),

    [ETypes.setState]: 
        (state: IListItem[] | [], action: IAction) => 
        ([...action.payload.links!]),

    [ETypes.DELETE]: (state: IListItem[] | []) => ([]),

    [ETypes.DEFAULT]: (state: IListItem[] | []) => ([...state])
}

export const linksReduser = (state: IListItem[], action: IAction) => {
    const handle = handlers[action.type] || handlers[ETypes.DEFAULT];

    return handle(state, action)
}

export function changeDescriptionHandler(state: IListItem[] | [], { payload }: IAction): IListItem[] | [] {
    const index = state.findIndex(link => link._id === payload.id)
    
    if(index === -1) {
        return state
    }
    
    let middle = state.find((link, number) => number === index)!
    middle.description = payload.description || ''

    const right: IListItem[] = state.slice(index + 1) 
    const left: IListItem[] = state.slice(0, index)
   
    return [...left, middle, ...right] 
}

export function changeCountAllHandler(state: IListItem[] | [], { payload }: IAction): IListItem[] | [] {
    const index = state.findIndex(link => link._id === payload.id)

    
    if(index === -1) {
        return state
    }
    
    let middle = state.find((link, number) => number === index)!

    if(middle.countAll) {
        middle.countAll = [...middle.countAll, (payload.countAll || Date.now())]  || []
    } else {
        middle.countAll = [(payload.countAll || Date.now())]
    }
    

    const right: IListItem[] = state.slice(index + 1) 
    const left: IListItem[] = state.slice(0, index)
   
    return [...left, middle, ...right] 
}

export function changeImgIdHandler(state: IListItem[] | [], { payload }: IAction): IListItem[] | [] {
    const index = state.findIndex(link => link._id === payload.id)
    
    if(index === -1) {
        return state
    }
    
    let middle = state.find((link, number) => number === index)!

    middle.img = payload.img || '' 

    const right: IListItem[] = state.slice(index + 1) 
    const left: IListItem[] = state.slice(0, index)
   
    return [...left, middle, ...right] 
}

