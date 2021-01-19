// assentials libraries
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Loader } from './Loader'
import { AuthContext } from '../context/auth/AuthContext'
import { LinksContext } from '../context/links/LinksContext'

// iterfaces from backend
import { EPath, IResponse } from '../interfaces/IBackend' 

// castom hooks
import { useHttp } from '../hooks/useHttp'  
import { useMessage, EMessageColor } from '../hooks/useMessage'
import { useLS, ELSKey } from '../hooks/useLS'

// neaded only this component
enum EForm { email = 'email', password = 'password' } 
interface IForm { email: string, password: string }
const initialForm: IForm = { email: '', password: '' }


export const Form: React.FC = () => {
    const { setState } = useContext(LinksContext)
    const { setIsAuthenticated } = useContext(AuthContext)

    const [form, setForm] = useState<IForm>(initialForm)

    const [request, loading, error] = useHttp()
    const [get, set, remove, removeAll] = useLS()
    const message = useMessage()

    const passwordRef = useRef<HTMLInputElement>(null)
    
	const inputHandler: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
		setForm(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    useEffect(() => { 
        error && message(error, EMessageColor.textRed) 
    }, [error, message])

	const submitHandler: (event: React.FormEvent) => any = async (event) => {
        event.preventDefault()

        if(form.password.length < 5) { 
            passwordRef.current?.focus();  
            return message('Length of passwoth must be more then 5 charcets!', EMessageColor.textRed) 
        }

        const data = get(ELSKey.sortId)

		try {
            let response = {} as IResponse
            
            if(!data.uid) {
                response = await request(EPath.baseUrl + EPath.form, 'POST', form, 
                    {
                        'Content-Type': 'application/json'
                    }
                )
            }

            if(data.uid) {         
                response = await request(EPath.baseUrl + EPath.form, 'POST', 
                    {
                        ...form, uid: data.uid
                    }, 
                    {
                        'Content-Type': 'application/json'
                    }
                )
            }
             
            const { message: Mes, payload }: IResponse = response

            Mes && message(Mes, EMessageColor.textGreen) 

            if(payload) {
                removeAll()
                payload.uid && set(ELSKey.sortId, { uid: payload.uid })
                payload.token && set(ELSKey.sortId, { token: payload.token }) 
                payload.links && set(ELSKey.sortId, { links: payload.links })
            }

            setIsAuthenticated(true)

            const links = get(ELSKey.sortId).links
            links && setState(links)

		} catch(err) {
            message(err.message, EMessageColor.textRed)

            if(data.uid) { 
                message('Clear Local Storage! Maybe Wrong Uid token!', EMessageColor.textRed)
                remove(ELSKey.sortId, "uid")
                message('Local Storage has beed cleared Automatically! Try Again!', EMessageColor.textGreen) 
            }
		}
	}

    return (
    <form className="row" onSubmit={submitHandler} >

        {
            loading && <div className="input-field col s12" children={<Loader isCircle={false} />} />  
        }

        <div className="input-field col s12">
            <input type="email" 
                onChange={inputHandler}
                value={form.email}
                placeholder="Email" 
                className="validate white-text"
                name={EForm.email}
            />
        </div>

        <div className="input-field col s12">
            <input type="password"
                ref={passwordRef}
                onChange={inputHandler}
                value={form.password}
                placeholder="Password" 
                className="validate white-text"
                name={EForm.password}
            />
        </div>

        <button className="btn waves-effect waves-light right-align" type="submit">
            Submit
            <i className="material-icons right">send</i>
        </button>
        
    </form>
)}
