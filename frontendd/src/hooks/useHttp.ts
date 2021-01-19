import { useState, useCallback } from 'react'
import { IResponse } from '../interfaces/IBackend'

type TRequest = (url: string, method?: string, body?: object | null, headers?: { [key: string]: string }) => Promise<any> 
type TError = null | string 

export const useHttp: () => [TRequest, boolean, TError, () => void] = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<(null | string)>(null)

    const clearError = useCallback(() => (null), [])

    const request: (TRequest) = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)

        let JSONBody: string | null = JSON.stringify(body)  
        body === null && (JSONBody = null) 

        try {
            const responce = await fetch(url, { method, body: JSONBody, headers })

            const data: IResponse = await responce.json()

            console.log('Responce__:', data)

            if(!responce.ok) { throw new Error(data.message || 'Something going wrong...') }
            setLoading(false)

            return data
        } catch(err) {
            setLoading(false)
            setError(err.message)

            throw err
        }

    }, [])


    return [request, loading, error, clearError]
}

 

