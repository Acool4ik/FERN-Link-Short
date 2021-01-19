import React, { useState, useContext } from 'react'

import { LinksContext } from '../context/links/LinksContext'

import { FloatBtns } from './FloatBtns'
import { LinkItem } from './LinkItem'
 

export const LinksContainer: React.FC = () => {
    const { links } = useContext(LinksContext)
    const [isCard, setIsCard] = useState<boolean>(false)
    const color = colorWrapper() // see below

    return (
        <section className="container" style={{ fontSize: 'calc(10px + 1.4vmin)'}} >

            <div className={`${isCard && 'row'} margin-container-bottom`}>
                
                {          
                    links.length !== 0 &&
                    links.map(item => <LinkItem key={item._id} {...item} color={color()} />)
                }

                {
                    links.length !== 0 && <div className="divider" 
                        style={{ width: '100%', position: 'relative', top: '8px' }} 
                    />
                }

                {
                    !links.length && <h5 className="col s12" style={{marginTop: '4rem'}}>Here are't links yet</h5> 
                }

            </div>

            {
                links &&
                <button type="button" className="btn-floating btn-large waves-effect waves-light blue left floating-bottom-left"
                    onClick={() => setIsCard(prev => !prev)}
                    children={<i className="material-icons">dashboard</i>}
                />
            }

            <FloatBtns />
            
        </section>
    )
}


function colorWrapper(): () => string {
    const palette: string[] = [
        'teal darken-3', 
        'lime accent-3', 
        'orange accent-4', 
        'teal accent-3',
        'pink'
    ]

    let index: number = 0

    return () => {
        const color: string = palette[index]

        index++
        index === palette.length && (index = 0)

        return color
    }
}