import React, { createContext } from 'react'

interface IContextAuth {
    token?: string,
    uid?: string,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext({} as IContextAuth)