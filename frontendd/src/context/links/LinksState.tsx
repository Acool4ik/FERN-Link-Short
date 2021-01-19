import React, { useReducer, useCallback } from 'react'
import { LinksContext } from './LinksContext'
import { changeDescriptionHandler, linksReduser, changeImgIdHandler, changeCountAllHandler } from './LinksReduser'
import { ETypes } from '../types'

import { IListItem } from '../../interfaces/IListItem'
import { useLS, ELSKey } from '../../hooks/useLS'
import { useMessage, EMessageColor } from '../../hooks/useMessage'


export const LinksState: React.FC = ({ children }) => {
    const message = useMessage()
    const [ get, set, remove ] = useLS() 
    const linksInitial: IListItem[] = get(ELSKey.sortId).links || []

    const [state, dispatch] = useReducer(linksReduser, linksInitial)


    const removeLinkId = useCallback((id: string) => {
        const links: IListItem[] = state.filter((link: IListItem) => link._id !== id) || []
        dispatch({type: ETypes.removeID, payload: { links }})

        const stateLS = get(ELSKey.sortId)
        set(ELSKey.sortId, { ...stateLS, links })

        message('Link Have been Deleted!', EMessageColor.textYellow)
    }, [message, set, state, get])

    
    const changeImgId = useCallback((id: string, img: string) => {
        const links = changeImgIdHandler(state, {type: ETypes.removeID, payload: { id, img }})
        dispatch({ type: ETypes.changeIMG_ID, payload: { links }})
        
        const stateLS = get(ELSKey.sortId)
        set(ELSKey.sortId, { ...stateLS, links })

        message('Image Have been Deleted!', EMessageColor.textYellow)
    }, [state, message, get, set])


    const changeDescriptionLinkId = useCallback((id: string , description: string) => {
        const links = changeDescriptionHandler(state, {type: ETypes.changeDescriptionID, payload: { description, id }})
        dispatch({type: ETypes.changeDescriptionID, payload: { links }})

        const stateLS = get(ELSKey.sortId)
        set(ELSKey.sortId, { ...stateLS, links })

        message('Link Description Have been Changed!', EMessageColor.textGreen)
    }, [message, set, state, get])


    const changeCountAllID = useCallback((id: string, countAll:  number) => {
        const links = changeCountAllHandler(state, {type: ETypes.changeDescriptionID, payload: { countAll, id }})
        console.log(links);
        dispatch({type: ETypes.changeCountAllID, payload: { links }})

        const stateLS = get(ELSKey.sortId)
        set(ELSKey.sortId, { ...stateLS, links })
    }, [get, state, set])


    const setState = useCallback((links: IListItem[]) => {
        dispatch({type: ETypes.setState, payload: { links }})

        set(ELSKey.sortId, { links })

        message('Your Links Have been Set Up in Local Storage!', EMessageColor.textGreen)
    }, [message, set])


    const clearState = useCallback(() => {
        dispatch({type: ETypes.DELETE, payload: {}})

        remove(ELSKey.sortId, "links")

        message('Your Local Storage is clear!', EMessageColor.textYellow)
    }, [message, remove])


    return <LinksContext.Provider value={{

        links: state, 

        removeLinkId, 

        changeImgId,

        changeDescriptionLinkId,

        changeCountAllID,

        setState,

        clearState
        
    }} >

        { children }

    </LinksContext.Provider>
}