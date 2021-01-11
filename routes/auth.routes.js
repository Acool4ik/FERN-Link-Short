const { Router } = require('express')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const generageUid = require('uid/secure')

const router = Router()


router.post('/form', async (req, res) => {
    const { body: { email, password, uid  } } = req
    const solt = await config.get('solt')

    const database = await require('firebase').database()

    // user send only email, password and uid but not send jwt
    if(email && password && uid) {
        try {
            const snapshot = await database.ref(`users/${uid}`).once('value')
            const { links } = await snapshot.val() || []

            const keys = Object.keys(links || [])
            const linksArray = keys.map(key => links[key])
        
            const isEmail = email === await snapshot.val().email
            const isPassword = await bcrypt.compare(password, await snapshot.val().password)
            const isUid = uid === await snapshot.val().uid
            
            if(isEmail && isPassword && isUid)  {
                const token = jwt.sign( 
                    { password, email, uid }, 

                    config.get('secretKey'), 

                    { expiresIn: '12h' }
                )

                return res.status(200).json({ 
                    error: false, message: 'User Log In System!', 
                    payload: { 
                        token, uid, links: linksArray || []
                    }
                }) 
            }
    
            if(!isEmail && !isPassword) {
                return res.status(401).json({ 
                    error: true, message: 'Wrong Login and Password!' 
                })
            }

            if(!isEmail) {
                return res.status(401).json({ 
                    error: true, message: 'Wrong Login!' 
                })
            }

            if(!isPassword) {
                return res.status(401).json({ 
                    error: true, message: 'Wrong Password!' 
                })
            }
        } catch(e) {
            return res.status(401).json({ 
                error: true, message: 'Wrong Login and Password!' 
            })
        }
    } 

    // user send only email and password but not send jwt
    if(email && password) {
        try {
            database.ref('users/').once('value', async (snapshot) => {

                const data = await snapshot.val() || {}
                const keys = Object.keys(data) || []
    
                if(!keys.length) { return isNew() }

                for(let i = 0; i < keys.length; i++) {
                    const current = data[keys[i]]

                    const isEmail = email === current.email
                    const isPassword = await bcrypt.compare(password, current.password)
    
                    if(isEmail && isPassword) { 
                        return isLogged(current.uid)
                    }
        
                    if(isEmail && !isPassword) {
                        return isWrong()
                    }
        
                    if(!isEmail && (i === keys.length - 1)) {
                        return isNew()
                    }
                }
            })
    
            async function isLogged(searchUid) {
                const snapshot = await database.ref(`users/${searchUid}`).once('value')
                const { links } = await snapshot.val() || []

                const keys = Object.keys(links || [])
                const linksArray = keys.map(key => links[key])

                const token = jwt.sign( 
                    { password, email, uid: searchUid },

                    await config.get('secretKey'), 

                    { expiresIn: '12h' }
                )

                return res.status(200).json({ 
                    error: false, message: 'User Log In System!', 
                    payload: { 
                        token, uid: searchUid, links: linksArray || []
                    }
                }) 
            }
            
            function isWrong() {
                return res.status(401).json({ 
                    error: true, message: 'Wrong Password or this Email is Exist!' 
                }) 
            }
    
            async function isNew() {
                const { uid } = generageUid
                const newUid = uid(25)
    
                await database.ref(`users/${newUid}`).set({ 
                    uid: newUid, email, password: await bcrypt.hash(password, +solt)
                })
    
                const token = jwt.sign( 
                    { password, email, uid: newUid }, 

                    await config.get('secretKey'), 

                    { expiresIn: '12h' }
                )

                return res.status(201).json({ 
                    error: false, message: 'User have beed created!', 
                    payload: {
                        token, uid: newUid
                    }
                })  
            }
        } catch(e) {
            return res.status(401).json({ 
                error: true, message: 'Something going wrong... Try Again!' 
            }) 
        }
    }
})


module.exports = router