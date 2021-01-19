import React from 'react'
import ReactDOM from 'react-dom'

// styles and js
import './index.css'
import 'materialize-css'

// main component
import { App } from './App'

ReactDOM.render(
  
    <React.StrictMode>
        <App />
    </React.StrictMode>,

    document.getElementById('root')
)

