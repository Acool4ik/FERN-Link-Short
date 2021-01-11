const { Router } = require('express')
const auth = require('../middleware/auth.middleware')

const router = Router()


router.put('/linkitem/:id', auth, async (req, res) => {
    const {body: { description, img, _linkShort }, uid, token, params: { id }} = req

    const database = await require('firebase').database()

    if(!id) {
        return res.status(400).json({error: true, message: 'Id number of link is absent!'})
    }

    if(!description && !img) {
        return res.status(400).json({error: true, message: 'No field for changing!'})
    }

    try {
        const updates = { 
            [`users/${uid}/links/${id}/description`]: description,
            [`links/${_linkShort}/description`]: description
        }

        await database.ref().update(updates)

        return res.status(200).json({
            error: false, message: 'Description updated successfully!', 
            payload: { 
                uid, token 
            }
        })
    } catch(err) {
        return res.status(400).json({
            error: true, message: err.message || 'Something going Wrong! Try Again!'
        })
    }
})

router.delete('/linkitem/:id', auth, async (req, res) => {
    const {uid, token, params: { id }} = req

    const database = await require('firebase').database()

    if(!id) {
        return res.status(400).json({error: true, message: 'Id number of link is absent!'})
    }

    try {
        await database.ref(`users/${uid}/links/${id}`).remove()

        return res.json({error: false, message: 'Link deleted successfully!', payload: {
            uid, token 
        }})
    } catch(err) {
        return res.status(400).json({
            error: true, message: 'Something going Wrong! Try Again!'
        })
    }
})


module.exports = router