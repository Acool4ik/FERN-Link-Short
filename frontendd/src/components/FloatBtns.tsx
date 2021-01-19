import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { AuthContext } from '../context/auth/AuthContext'
import { EPath } from '../interfaces/IBackend'
import { useLS, ELSKey } from '../hooks/useLS'

export const FloatBtns = () => {
    const { setIsAuthenticated } = useContext(AuthContext)
    const [pulse, setPulse] = useState<boolean>(true)
    const [get, set, remove] = useLS()

    useEffect(() => {
        const elems = document.querySelectorAll('.fixed-action-btn')
        M.FloatingActionButton.init(elems, { direction: 'left', hoverEnabled: false})

        const html = '<i class="small material-icons floating-nav-exact">arrow_downward</i>'
        generator.current?.className.split(' ').includes('active') && 
        generator.current.insertAdjacentHTML("beforebegin", html)

        linkContainer.current?.className.split(' ').includes('active') && 
        linkContainer.current.insertAdjacentHTML("beforebegin", html)
    }, [])

    const LogOutHandler = useCallback(() => {
        remove(ELSKey.sortId, "token") 
        setIsAuthenticated(false)
    }, [setIsAuthenticated, remove]) 

    const generator = useRef<HTMLAnchorElement>(null)
    const linkContainer = useRef<HTMLAnchorElement>(null)

    return (
        <div className="fixed-action-btn click-to-toggle direction-top direction-left " >

            <span className={`btn-floating btn-large red btn-large ${pulse ? 'pulse' : null}`} 
                onClick={() => setPulse(false)}
            >
                <i className="material-icons">menu</i>
            </span>

            <ul>
                <li>
                    <Link to={EPath.slash} className="btn-floating blue float-btns-item" 
                        onClick={LogOutHandler}
                    >
                        <i className="material-icons">delete</i>
                    </Link>
                </li>
                
                <li>
                    <NavLink ref={linkContainer} to={EPath.linkcontainer} className="btn-floating green float-btns-item">
                        <i className="material-icons">library_books</i>
                    </NavLink>
                </li>

                <li>
                    <NavLink ref={generator} to={EPath.generator} className="btn-floating yellow float-btns-item" exact >
                        <i className="material-icons">library_add</i>
                    </NavLink>
                </li>
            </ul>

        </div>
    )
}