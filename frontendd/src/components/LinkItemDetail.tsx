// libraries assentials
import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

// context elements
import { LinksContext } from '../context/links/LinksContext'
import { AuthContext } from '../context/auth/AuthContext'

// castom components
import { FloatBtns } from './FloatBtns'
import { Loader } from './Loader'

// castom hooks
import { useMessage, EMessageColor } from '../hooks/useMessage'
import { useHttp } from '../hooks/useHttp'
import { useLS, ELSKey } from '../hooks/useLS'

// interfases for convenients
import { IListItem } from '../interfaces/IListItem'
import { EPath, IResponse } from '../interfaces/IBackend'


export const LinkItemDetail = () => {
    // getting context props
    const { links, removeLinkId, changeDescriptionLinkId, changeCountAllID, changeImgId } = useContext(LinksContext)
    const { token, setIsAuthenticated } = useContext(AuthContext)

    // use castom hooks
    const { id }: { id: string} = useParams()
    const [request, loading] = useHttp()
    const history = useHistory()
    const message = useMessage()
    const [ get, set, remove ] = useLS()

    // find current link in links state (LinksContext)
    const { _id, description: descriptor, _linkShort, _linkLong, _dataCreated, countAll, img}: IListItem = links.find(link => link._id === id) || {} as IListItem

    
    const input = useRef<HTMLInputElement>(null)
    const form = useRef<HTMLFormElement>(null)
    const container = useRef<HTMLImageElement>(null)

    const [editDescription, setEditDescription] = useState<boolean>(false)
    const [mainEditor, setMainEditor] = useState<boolean>(false)
    const [click, setClick] = useState<boolean>(true) 
    const [file, setFile] = useState<File | undefined>(undefined)
    const [loaderSecond, selLoaderSecond] = useState<boolean>(false) 
    const [count, setCount] = useState<number>(countAll ? countAll.length : 0)

    const [textarea, setTextarea] = useState<string>(descriptor || '')
    const [description, setDescription] = useState<string>(textarea)
    const [imgName, setImgName] = useState<string>(img || '')
    
    const copyHandler = () => {
        window.navigator.clipboard.writeText(EPath.baseUrl + EPath.linkitem + EPath.api + EPath.slash + _linkShort)
        message('Link have been Copied', EMessageColor.textGreen)
    }

    const deleteLinkHandler = async () => {
        setClick(false)
        const headers = { 'Content-Type': 'application/json', authorization: `Bearer ${token}`}

        try {
            await request(EPath.baseUrl + EPath.linkitem + EPath.slash + _id, 'DELETE', {}, headers)
            setClick(true)
            removeLinkId(_id)
            history.push(EPath.linkcontainer)
        } catch(err) {
            if(err.message === "Token expired or Wrong token!") {
                setIsAuthenticated(false)
                remove(ELSKey.sortId, "token") 
            }

            setClick(true)
            message(err.message, EMessageColor.textRed)
        }
    }

    const disabledHandler = (e: React.MouseEvent) => {
        if(!click) {
            e.stopPropagation()
            e.preventDefault()
        } 
    }

    const deleteImgHandler = () => {
        setImgName('')
        setFile(undefined)

        if(container.current) {
            container.current.src = ''
            container.current.removeAttribute('alt')
            container.current.removeAttribute('src')
        }
        
        message('Image have been changed Localy', EMessageColor.textYellow)
    } 

    const changeImgHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        const reader = new FileReader()
        file && setImgName(`${file.name}__${Math.floor(file.size / 1024)}kb` || '')
        file && setFile(file)

        if(container.current) {    
            reader.onload = ((div) => (e: any) => { div.src = e.target.result || '' })(container.current)
            try {
                reader.readAsDataURL(file)
            } catch(err) { }
        }
    }, [])


    const changeDescriptionHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setDescription(textarea)
        message('Description have been changed Localy', EMessageColor.textYellow)
    }

    const triggerEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter') {
            setEditDescription(false)
            const event = new Event('submit', {bubbles: true})
            form.current?.dispatchEvent(event)
        }
    }

    useEffect(() => {
        description !== descriptor ? setMainEditor(true) : setMainEditor(false)
    }, [description, descriptor])

    useEffect(() => {
        imgName !== img ? setMainEditor(true) : setMainEditor(false)
    }, [imgName, img])

    const cancelChangeHandler = (text: string) => {
        setMainEditor(false)
        setEditDescription(false)
        setTextarea(text || '')
        setDescription(text || '')
        setImgName(img || '')
        setFile(undefined)
        container.current!.src = ''
        container.current?.removeAttribute('alt')
        container.current?.removeAttribute('src')
        message('Fields have beed cleared!', EMessageColor.textYellow)
    }

    const requestHandler = async () => {

        setClick(false)

        try {
            
            // set description
            if(description !== descriptor) {
                const body = { description, _linkShort }

                const headers = { 
                    'Content-Type': 'application/json', 
                    authorization: `Bearer ${token}`
                }

                const response: IResponse = await request(
                    EPath.baseUrl + EPath.linkitem + EPath.slash + _id, 
                    'PUT', body, headers
                )

                changeDescriptionLinkId(_id, description)

                const { message: report } = response
                report && message(report, EMessageColor.textGreen)
    
                cancelChangeHandler(description || '')
            }

            // set img
            if(!img && file !== undefined) {
                const formDate = new FormData()
                const uuid = uuidv4()
                selLoaderSecond(true)

                formDate.append('img', file)
                formDate.append('uuid', uuid)
                formDate.append('_id', _id)
                formDate.append('_linkShort', _linkShort)

                try {
                    const responseIMG = await fetch(
                        EPath.baseUrl + EPath.generator + EPath.image, {
                        method: 'POST',
                        body: formDate,
                        headers: { 
                            authorization: `Bearer ${token}`,
                            _uuid: uuid
                        }
                    })
    
                    const { _imagePath }: { _imagePath: string } = await responseIMG.json()
                    changeImgId(_id, _imagePath)
                    selLoaderSecond(false)

                    history.go(0)
                } catch(err) {
                    if(err.message === "Token expired or Wrong token!") {
                        setIsAuthenticated(false)
                        remove(ELSKey.sortId, "token") 
                    }

                    selLoaderSecond(false)
                    message(err.message || 'Icon could not load!', EMessageColor.textRed)
                }

            }

            // put img
            if((img && img !== imgName) && file !== undefined) {
                const formDate = new FormData()
                const uuid = uuidv4()
                selLoaderSecond(true)

                formDate.append('img', file)
                formDate.append('_linkShort', _linkShort)

                try {
                    const responseIMG = await fetch(
                        EPath.baseUrl + EPath.linkitem + EPath.image + EPath.slash + _id, {
                        method: 'PUT',
                        body: formDate,
                        headers: { 
                            authorization: `Bearer ${token}`,
                            _uuid: `${uuid} ${img}`,
                        }
                    })
    
                    const { _imagePath }: { _imagePath: string } = await responseIMG.json()
                    changeImgId(_id, _imagePath || '')
                    selLoaderSecond(false)

                    history.go(0)
                } catch(err) {
                    if(err.message === "Token expired or Wrong token!") {
                        setIsAuthenticated(false)
                        remove(ELSKey.sortId, "token") 
                    }

                    selLoaderSecond(false)
                    message(err.message || 'Icon could not update!', EMessageColor.textRed)
                }
            }
            
            // delete img
            if(img && (img !== imgName) && file === undefined) {
                const body = { _linkShort, img }
                selLoaderSecond(true)

                const headers = { 
                    'Content-Type': 'application/json', 
                    authorization: `Bearer ${token}`
                }

                try {
                    await request(
                        EPath.baseUrl + EPath.linkitem + EPath.slash + EPath.image + EPath.slash + _id, 
                        'DELETE', body, headers
                    )
                    selLoaderSecond(false)

                    changeImgId(_id, '')
                    history.go(0)
                } catch(err) {
                    if(err.message === "Token expired or Wrong token!") {
                        setIsAuthenticated(false)
                        remove(ELSKey.sortId, "token") 
                    }

                    selLoaderSecond(false)
                    message(err.message || 'Icon have not been deleted!', EMessageColor.textRed)
                }

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

    const downloadHandler = (event: React.FormEvent<HTMLAnchorElement>) => {
        event.preventDefault()

        fetch(EPath.baseUrl + EPath.api + EPath.image + EPath.slash + img + EPath.download)
            .then(resp => resp.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                img && (a.download = img.split('__')[1] || '')
                a.click();
                window.URL.revokeObjectURL(url);
            })
    }

    const analiticsHandler = (e: React.FormEvent<HTMLAnchorElement>) => {
        fetch(`/api/clicks/${_id}`)
            .then(res => {
                res.json().then(date => {
                    date.data && changeCountAllID(_id, date.data)
                })
            })
        
        setCount(prev => prev + 1)
    }

    useEffect(() => {
        const elems = document.querySelectorAll('.tooltipped')
        M.Tooltip.init(elems)
    }, [])

    return (
        <section className="container detail-scroll margin-container-bottom"
            onClickCapture={disabledHandler}
        >

            <div className="row left-align" style={{wordBreak: 'break-word'}}>

                {
                    loading && 
                    <section className="col s12 detail-margin" 
                        children={ <Loader isCircle={false} />} 
                    />
                }

                {
                    loaderSecond && 
                    <section className="col s12 detail-margin" 
                        children={ <Loader isCircle={false} />} 
                    />
                }

                <section className="col s12 detail-margin p0">№: "{_id || 'N/A'}"</section>

                {/* link follow */}
                <section className="col s12 detail-margin p0">
                <div className="d-flex">

                    <a className="hover-underline" rel="noreferrer" target="_blank" 
                        href={_linkLong} 
                        onClick={analiticsHandler}
                    >
                        <span className="white-text">Follow the link: </span> 
                        <br />
                        {EPath.baseUrl + EPath.api + EPath.linkitem + EPath.slash + _linkShort}
                    </a>
                    
                    <i className="medium material-icons right tooltipped pointer green-text" 
                        data-tooltip="Copy Link!" data-position="top"
                        onClick={copyHandler}
                    >
                        assignment
                    </i>

                </div>
                </section>

                {/* date */}
                <section className="col s12 detail-margin p0">
                    <div className="d-flex">
                        <span>Data Created:</span>
                        <strong>{new Date(_dataCreated).toLocaleDateString()}</strong>
                    </div>
                </section>

                {/* number of clicks */}
                <section className="col s12 detail-margin p0">
                    <div className="d-flex">
                        <span>Number of clicks:</span>
                        <strong className="d-flex">
                            <i className="material-icons right pointer green-text"
                                style={{marginRight: '0.8rem'}}
                            >
                                call
                            </i>
                            {count}
                        </strong>
                    </div>
                </section>

                {/* description */}
                <form ref={form} className="col s12 detail-margin p0" 
                    onSubmit={changeDescriptionHandler}
                >

                    {
                        !editDescription && <> 
                        <span>Description:</span>
                        <strong style={{marginLeft: '1rem'}}>
                            {description || 'N/A'}
                        </strong> 
                        </>
                    }

                    {
                        editDescription &&
                        <textarea className="materialize-textarea white-text" 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextarea(e.target.value)}
                            value={textarea}
                            onKeyDownCapture={triggerEnter}
                            maxLength={450}
                        />
                    }
                    
                    <div className="waves-effect waves-light btn-small tooltipped green right"
                        data-tooltip="Edit description of link" data-position="top"
                        onClick={() => setEditDescription(prev => !prev)}
                        children={<> Edit </>}
                    />
    
                </form>

                {/* image */}
                <section className="col s12 detail-margin p0 row">
                <div className="col s12 detail-margin p0 flex-center">

                    {
                        imgName && 
                        <a className="col s12 hover-underline detail-margin p0" 
                            href={EPath.baseUrl + EPath.api + EPath.image + EPath.slash + img + EPath.download}
                            style={{wordBreak: 'break-word'}} 
                            children={<><span className="white-text">Image:</span> {imgName}</>}
                            onClick={downloadHandler}
                        />
                    }

                    {
                        !imgName && 
                        <div className="col s12 detail-margin p0">Image: 
                            <strong style={{marginLeft: '1rem'}}>N/A</strong>
                        </div> 
                    }

                    {
                        img &&
                        <img className='icon-linkitem' 
                            src={EPath.baseUrl + EPath.api + EPath.image + EPath.slash + img + EPath.download} 
                            alt="test" 
                        />
                    }

                </div>

                <div className="col s12 detail-margin p0 flex-between">

                    <input type="file" id="input"
                        onChange={changeImgHandler}
                        ref={input}
                        accept="image/*" 
                        style={{display: 'none'}} 
                    />

                    {
                        imgName && 
                        <div className="waves-effect waves-light btn-small red"
                            onClick={deleteImgHandler}
                            children={<> Delete </>}
                        />
                    }

                    <label className="waves-effect waves-light btn-small tooltipped green"
                        htmlFor="input"
                        data-tooltip="Change or add photo for link!" data-position="left"
                        children={<> Edit </>}
                    />

                </div>  
                </section>

                {/* request panel */}
                <section className="col s12 detail-margin flex-center p0">

                    {
                        mainEditor && 
                        <button className="btn-floating btn-large waves-effect waves-light green detail-margin"
                            type="button"
                            style={{marginRight: '1rem'}}
                            onClick={cancelChangeHandler.bind(null, descriptor || '')}
                        >
                            <i className="material-icons">backspace</i>
                        </button>
                    }

                    {
                        mainEditor && 
                        <button className="btn-floating btn-large waves-effect waves-light blue detail-margin"
                            type="button"
                            style={{marginLeft: '1rem'}}
                            onClick={requestHandler}
                        >
                            <i className="material-icons">backup</i>
                        </button>
                    }

                </section>
                
            </div>


            <div className="floating-top-right red-text" onClick={deleteLinkHandler} >
                Delete the link:
                <i className="medium material-icons right">delete</i>
                <img ref={container} alt="" className={`${file ? 'show-icon' : 'hidden-icon'}`} />
            </div>
            <FloatBtns />
            
        </section>
    )
}