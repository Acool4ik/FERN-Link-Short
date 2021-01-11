const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const fs = require('fs')
const path = require('path')
const multer =  require('multer')

const router = Router()

router.delete('/linkitem/image/:id', auth, async (req, res) => {
    const {body: { _linkShort, img }, uid, token, params: { id: _id }} = req

    const database = await require('firebase').database()


    try {
        const pathName = path.join(`${__dirname}/../icons/${img}`)
        fs.statSync(pathName)
        fs.unlink(pathName, (err) => {
            if(err) { throw new Error(err.message)}
        })

        await database.ref(`users/${uid}/links/${_id}/img`).remove()
        await database.ref(`links/${_linkShort}/path`).remove()
       
        return res.json({ error: false, message: 'Img deleted successfully!' })
    } catch(err) {
        return res.status(400).json({
            error: true, message: err.message || 'Something going Wrong! Try Again!'
        })
    }

})


const storage = multer.diskStorage({

    destination: async (req, file, cb) => {
        const {  headers: { _uuid } } = req

        const { originalname } = file

        const _newPath = `${_uuid.split(' ')[0]}__${originalname}`
        req.path_ = _newPath || ''

        try {
            const pathName = path.join(`${__dirname}/../icons/${_uuid.split(' ')[1]}`)

            fs.statSync(pathName)

            fs.unlink(pathName, (err) => {
                if(err) { throw new Error(err.message)}
            })
            
        } catch(err) { }

        cb(null, 'icons/')
    },

    filename: (req, file, cb) => {
        const { path_ } = req
        cb(null, path_)
    }

})

const uploads = multer({ storage: storage })

router.put('/linkitem/image/:id', auth, uploads.single('img'), async (req, res) => {
    const { uid, body: { _linkShort }, params: { id: _id } } = req
    const path = req.path_ 

    const database = await require('firebase').database()

    try {
        const updates = { 
            [`users/${uid}/links/${_id}/img`]: path,
            [`links/${_linkShort}/path`]: path
        }

        await database.ref().update(updates)
        
        return res.status(200).json({ error: false, message: 'ok', _imagePath: path })
    } catch(err) {
        return res.status(400).json({
            error: true, message: err.message || 'Something going Wrong! Try Again!'
        })
    }
    
})





module.exports = router