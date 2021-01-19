import { IListItem } from './IListItem'

// all neaded path for routes
export enum EPath { 
    // baseUrl = 'https://boiling-castle-07983.herokuapp.com/',
    baseUrl = 'http://localhost:80/',

    form = '/form',

    download = '/download',

    api = '/api',

    slash = '/',

    generator = '/generator',

    linkcontainer = '/linkcontainer',

    linkitem = '/linkitem',

    image = '/image'
}

// interfase of response from server
export interface IResponse {  
    error: boolean | null,

    payload?: {

        readonly uid?: string,

        readonly token?: string,

        links?: IListItem[],

        link?: IListItem

    },

    message: string | null
}