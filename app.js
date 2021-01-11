const express = require('express')
const config = require('config')
const firebase = require('firebase/app')
const path = require('path')

const firebaseConfig = {
    apiKey: "AIzaSyBzcqvmJTLp4UXMrCsT2tVfrW6W9DznB1w",
    authDomain: "fern-stack-d7400.firebaseapp.com",
    databaseURL: "https://fern-stack-d7400-default-rtdb.firebaseio.com",
    projectId: "fern-stack-d7400",
    storageBucket: "fern-stack-d7400.appspot.com",
    messagingSenderId: "80905860054",
    appId: "1:80905860054:web:35216593836fbdbef72a77"
}

firebase.initializeApp(firebaseConfig)

const app = express()
const PORT = config.get('port') || 5000

if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'frontend', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}


app.use(express.urlencoded({ extended: false })) // for parse body and json
app.use(express.json())


app.use('/', require('./routes/api.routes'))

app.use('/', require('./routes/auth.routes'))  // dinamic import require
app.use('/', require('./routes/generator.routes'))
app.use('/', require('./routes/linkitem.routes'))
app.use('/', require('./routes/linkitem.image.routes'))


app.listen(PORT, start)

function start() {  // initial func at time starting server
    console.log(`Example app listening at http://localhost:${PORT}`)
}