import { useCallback } from 'react'

export enum EMessageColor {
    textRed = 'red-text text-accent-2',
    textGreen = 'teal-text text-accent-3',
    textYellow = 'lime-text text-accent-3'
}

type TClassColor = EMessageColor.textGreen | EMessageColor.textRed | EMessageColor.textYellow

export const useMessage: () => (text: string, className?: TClassColor) => void  = () => {
    
    return useCallback((text = '', className = EMessageColor.textGreen) => window.M.toast({
        html: `<strong class=${className}>${text}</strong>`
    }), [])
}