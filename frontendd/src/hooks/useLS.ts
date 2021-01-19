import { useCallback } from 'react'
import { IListItem } from '../interfaces/IListItem'

export enum ELSKey {
    sortId = 'shortIdApp'
}

type TKeysLS = ELSKey.sortId

interface IData {
    readonly token?: string,
    readonly uid?: string,
    links?: IListItem[] 
}

type TSet = (key: TKeysLS, data: IData) => void
type TGet = (key: TKeysLS) => IData
type TRemove = (key: TKeysLS, keyObject: keyof IData) => void
type TRemoveAll = () => void


export const useLS: () => [TGet, TSet, TRemove, TRemoveAll] = () => {

    const get: TGet = useCallback((key) => {
        const value = JSON.parse(window.localStorage.getItem(key) || '{}')
        return value ? value : {}
    }, [])

    const set: TSet = useCallback((key, data) => {
        const previos = get(key)
        const value = JSON.stringify({...previos, ...data})
        window.localStorage.setItem(key, value)
    }, [get])

    const remove: TRemove = useCallback((key, keyObject) => {
        const previos = get(key)
        window.localStorage.removeItem(key)
        delete previos[keyObject]
        set(key, previos)
    }, [get, set])

    const removeAll: TRemoveAll = useCallback(() => {
        window.localStorage.removeItem(ELSKey.sortId)
    }, [])


    return [get, set, remove, removeAll]
}