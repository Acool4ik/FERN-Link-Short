const { Router } = require('express')

const auth = require('../middleware/auth.middleware')
const generageUid = require('uid/secure') 
const multer = require('multer')

const router = Router()


router.post('/generator', auth, async (req, res) => {
    const { body: {_linkLong, description, img}, uid, token } = req
    
    const database = await require('firebase').database()
    const regular = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/

    if(!regular.test(_linkLong)) {
        return res.status(400).json({ error: true, message: 'Incorrect link!' })
    }
    
    const newPostKey = await database.ref().child('posts').push().key

    const description_ = description || ''
    const img_ = img || ''

    if(_linkLong) {
        try {
            const _linkShortValue = generageUid.uid(25)

            const link = {
                _id: newPostKey,
                _linkShort: _linkShortValue,
                _linkLong,
                _dataCreated: Date.now(),
                description: description_,
                img: img_
            }

            await database.ref(`users/${uid}/links/${newPostKey}`).set(link)
            await database.ref(`links/${_linkShortValue}`).set({ _linkLong, description })

            return res.status(201).json({ 
                error: false, message: 'Link have been created!', 
                payload: {
                    uid, link, token
                }
            })
        } catch(err) {
            return res.status(400).json({ 
                error: true, message: 'Something going Wrong! Try again!' 
            })
        } 
    } else {
        return res.status(400).json({ error: true, message: 'User not send Link!' })
    }
    
})


const storage = multer.diskStorage({

    destination: async (req, file, cb) => {
        const {  headers: { _uuid } } = req

        const { originalname } = file
        const path = `${_uuid}__${originalname}`
        req.path_ = path

        cb(null, 'icons/')
    },

    filename: (req, file, cb) => {
        const { path_ } = req
        cb(null, path_)
    }

})

const uploads = multer({ storage: storage })


router.post('/generator/image', auth, uploads.single('img'), async (req, res) => {
    const { uid, body: { _id, _linkShort } } = req
    const path = req.path_

    const database = await require('firebase').database()

    try {
        await database.ref(`users/${uid}/links/${_id}/img`).set(path)
        await database.ref(`links/${_linkShort}/path`).set(path)

        return res.status(200).json({ error: false, message: 'ok', _imagePath: path })
    } catch(err) {
        return res.status(400).json({
            error: true, message: err.message || 'Something going wrong! Try Again!'
        })
    }

})


module.exports = router