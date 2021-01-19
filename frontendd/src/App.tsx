import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'

// contexts
import { AuthContext } from './context/auth/AuthContext' // contexts
import { LinksState } from './context/links/LinksState'

// castom hooks
import { useAuth } from './hooks/useAuth'  
import { useLS, ELSKey } from './hooks/useLS'


export const App: React.FC = () => {
    const [ get ] = useLS()
    const { token, uid } = get(ELSKey.sortId)
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)
    
    useEffect(() => {
        setIsAuthenticated(!!token)
    }, [token])

	const auth = useAuth(isAuthenticated)

    return (
		<Router>
        <LinksState>
        <AuthContext.Provider value={{ token, uid, setIsAuthenticated }} >
        <div className="App">
        <div className="App-header overflow-hidden">
      
            { auth } 
             
        </div>
        </div>
        </AuthContext.Provider>
        </LinksState>
		</Router>
    )
}


