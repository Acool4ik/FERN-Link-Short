const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')


module.exports = async (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return res.status(200)
    }

    const { headers: { authorization } } = req

    if(authorization) {

        const database = await require('firebase').database()

        const sekretKey = await config.get('secretKey')
        const token = authorization.split(' ')[1]

        try {
            const decoded = jwt.verify(token, sekretKey)

            const snapshot = await database.ref(`users/${decoded.uid}`).once('value')
            const { password, email, uid } = await snapshot.val()

            const isEmail = decoded.email === email
            const isPassword = await bcrypt.compare(decoded.password, password)

            if(isEmail && isPassword) {
                req.uid = uid
                req.token = token
                isEmail && isPassword && next()
            } else {
                return res.status(401).json({ 
                    error: true, message: 'Token expired or Wrong token!' 
                })
            }
            
        } catch {
            return res.status(401).json({ 
                error: true, message: 'Token expired or Wrong token!' 
            })
        }
    } else {
        return res.status(401).json({ 
            error: true, message: 'User no have Token!' 
        })
    }

}

