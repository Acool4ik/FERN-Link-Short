import React from 'react'

export enum ELoaderSize {
    big = 'big',
    standert = '',
    small = 'small'
}

export enum ELoaderColor {
    yellow = 'spinner-yellow-only',
    green = 'spinner-green-only',
    blue = 'spinner-blue-only'
}

interface ILoader {
    children?: React.ReactNode,
    isCircle?: boolean,
    size?: ELoaderSize.big | ELoaderSize.standert | ELoaderSize.small,
    color?: ELoaderColor.blue | ELoaderColor.green | ELoaderColor.yellow
}

export const Loader: React.FC<ILoader> = ({isCircle = true, size = ELoaderSize.standert, color = ELoaderColor.yellow}) => (
    isCircle ? 
    
    <div className={`preloader-wrapper ${size} active`}>
        <div className={`spinner-layer ${color}`}>
            <div className="circle-clipper left">
                <div className="circle"></div>
            </div><div className="gap-patch">
                <div className="circle"></div>
            </div><div className="circle-clipper right">
                <div className="circle"></div>
            </div>
        </div>
    </div> 
     
    :

    <div className="progress">
       <div className="indeterminate"></div>
    </div>

)