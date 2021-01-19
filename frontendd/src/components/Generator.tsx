// essentials libraries
import React, { useRef, useState, useCallback, useEffect, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'

// castom components
import { FloatBtns } from './FloatBtns'
import { Loader } from './Loader'

// castom hooks
import { useHttp } from '../hooks/useHttp'
import { useLS, ELSKey } from '../hooks/useLS'
import { useMessage, EMessageColor } from '../hooks/useMessage'

// contexts
import { EPath, IResponse } from '../interfaces/IBackend' 
import { AuthContext } from '../context/auth/AuthContext'
import { LinksContext } from '../context/links/LinksContext'


export const Generator: React.FC = () => {
    const {token, setIsAuthenticated} = useContext(AuthContext)
    const { setState } = useContext(LinksContext)

    const [get, set, remove] = useLS()
    const [request, loading] = useHttp()
    const message = useMessage()

    const container = useRef<HTMLImageElement>(null)
    const label = useRef<HTMLLabelElement>(null)

    const [description, setDescription] = useState<boolean>(false)
    const [icon, setIcon] = useState<boolean>(false)
    const [editor, setEditor] = useState<boolean>(false)
    const [click, setClick] = useState<boolean>(true) 

    const [text, setText] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [file, setFile] = useState<File | undefined>(undefined)

    const trollHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        const reader = new FileReader()
        setFile(file)
 
        if(container.current) {    
            reader.onload = ((div) => (e: any) => { div.src = e.target.result || '' })(container.current)
            try {
                reader.readAsDataURL(file)
            } catch(err) {
                container.current.removeAttribute('alt')
                container.current.removeAttribute('src')
            }
        }
    }, [])

    const disantHandler = () => {
        if(container.current!.className === 'troll-icon') {
            container.current!.className = 'troll-icon disant-effect'
            setTimeout(() => {
                container.current!.className = 'troll-icon'
            }, 5000)
        }     
    }

    const disabledHandler = (e: React.MouseEvent) => {
        if(!click) {
            e.stopPropagation()
            e.preventDefault()
        } 
    }

    const clearHandler = () => {
        setEditor(false)
        setText('')
        setLink('')
        setFile(undefined)
        setDescription(false)
        setIcon(false)
        message('Fields cleared!', EMessageColor.textYellow)
        container.current!.src = ''
        container.current?.removeAttribute('alt')
        container.current?.removeAttribute('src')
    }

    const requestHandler = async () => {
        if(link) {
            const body = {_linkLong: link, description: text, img: '' }
            setClick(false)

            try {
                const { payload, message: report }: IResponse = await request(EPath.baseUrl + EPath.generator, 
                    'POST', body, 
                    {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                )

                const { links } = get(ELSKey.sortId)

                if(payload && payload.link) {
                    if(file) {
                        const { _id, _linkShort } = payload.link
                        const formDate = new FormData()
                        const uuid = uuidv4()

                        formDate.append('img', file)
                        formDate.append('uuid', uuid)
                        formDate.append('_id', _id)
                        formDate.append('_linkShort', _linkShort)

                        try {
                            const responseIMG = await fetch(EPath.baseUrl + EPath.generator + EPath.image, {
                                method: 'POST',
                                body: formDate,
                                headers: { 
                                    authorization: `Bearer ${token}`,
                                    _uuid: uuid
                                }
                            })
    
                            const { _imagePath }: { _imagePath: string } = await responseIMG.json()
                            _imagePath && (payload.link.img = _imagePath)

                        } catch(err) {
                            message(err.message || 'Icon could not load!', EMessageColor.textRed)
                        }
                    }

                    set(ELSKey.sortId, { links: [...links || [], payload.link || []] })
                    setState([...links || [], payload.link || []])

                    message(report || 'Created!', EMessageColor.textGreen)
                    clearHandler()
                }
                
            } catch(err) {
                if(err.message === "Token expired or Wrong token!") {
                    setIsAuthenticated(false)
                    remove(ELSKey.sortId, "token") 
                }
                
                message(err.message, EMessageColor.textRed)
            }

            setClick(true)
        }
    }

    useEffect(() => {
        description && text && (label.current!.className = 'active')
        description && !text && (label.current!.className = '')
    }, [description, text])

    useEffect(() => {
        const regular = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/
        link && regular.test(link) && setEditor(true)
        !link && setEditor(false)
        link && !regular.test(link) && setEditor(false)
    }, [link])
    
    return (
        <div className="container row" style={{paddingTop: '120px', paddingBottom: '15px'}}
            onClickCapture={disabledHandler}
        >
            {
                loading &&
                <div className="section col s12 detail-margin p0" 
                    children={ <Loader isCircle={false} /> } 
                />
            }

            <div className="section col s12 detail-margin p0">
                <h5>Generator Acool4ik</h5>
            </div>

            <section className="input-field col s12 detail-margin p0">
                <input type="text" className="validate white-text col s12"
                    placeholder="Enter Link" 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)} 
                    maxLength={500}
                    value={link}
                /> 
            </section>


            <section className="col s12 row p0">
            <div className="col s12 m6 row p0">

                <div className="col s12 m12 l6 fs-castom-generator detail-margin p0">
                    Do you want add description for your link?
                </div>
                
                <div className="switch col col s12 m12 l6 detail-margin p0">
                    <label  >
                        No 
                        <input type="checkbox" 
                            checked={description} 
                            onChange={() => setDescription(prev => !prev)}
                        />
                        <span className="lever"/> 
                        Yes
                    </label>
                </div>

                {
                    description &&
                    <div className="input-field col s12 detail-margin" style={{padding: '0 1.5rem 0 0'}}>
                        <i className="material-icons prefix">mode_edit</i>
                        <textarea className="materialize-textarea white-text" id="icon"
                            maxLength={450}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                            value={text}
                        />
                        <label ref={label} htmlFor="icon">Enter description</label>
                    </div>
                }

            </div>

            <div className="col s12 m6 row p0">

                <div className="col s12 m12 l6 fs-castom-generator detail-margin p0">
                    Do you wand add icon for link? 
                </div>

                <div className="switch col s12 m12 l6 detail-margin p0">
                    <label  >
                        No 
                        <input type="checkbox" 
                            checked={icon}
                            onChange={() => setIcon(prev => !prev)}
                        />
                        <span className="lever"/> 
                        Yes
                    </label>
                </div>

                {
                    icon && 
                    <form className="col s12 detail-margin" style={{padding: '0 1.5rem 0 0'}}>
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input type="file" accept="image/*" onChange={trollHandler} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate white-text" type="text" />
                            </div>
                        </div>
                    </form>
                }

            </div>
            </section>


            <section className="col s12 flex-center p0">

                    {
                        editor && 
                        <button className="btn-floating btn-large waves-effect waves-light green detail-margin"
                            type="button"
                            style={{marginRight: '1rem'}}
                            onClick={clearHandler}
                        >
                            <i className="material-icons">backspace</i>
                        </button>
                    }

                    {
                        editor && 
                        <button className="btn-floating btn-large waves-effect waves-light blue detail-margin"
                            type="button"
                            style={{marginLeft: '1rem'}}
                            onClick={requestHandler}
                        >
                            <i className="material-icons">backup</i>
                        </button>
                    }

            </section>

            <FloatBtns />

            <section className="floating-top-right white-text" 
                onClick={disantHandler}
            >
                <i className="medium material-icons">cloud_upload</i>
                <img ref={container} alt="" className="troll-icon" />
            </section>

        </div>
    )
}



