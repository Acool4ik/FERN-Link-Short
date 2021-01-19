import { createContext } from 'react'
import { IListItem } from '../../interfaces/IListItem'

export interface ILinksContext {

    links: IListItem[],

    removeLinkId: (id: string) => void,

    changeImgId: (id: string, img: string) => void,

    changeDescriptionLinkId: (id: string , description: string) => void,

    changeCountAllID: (id: string, countAll:  number) => void,

    setState: (links: IListItem[]) => void,

    clearState: () => void

}

export const LinksContext = createContext({} as ILinksContext)