const { Router } = require('express')
const router = Router()


router.get('/api/image/:id/download', async (req, res) => {
    const { params: { id: img }} = req

    try {
        const name = img.split('__')[1]
        res.download(`${__dirname}/../icons/${img}`, name)

    } catch(err) { return res.status(400) }
})

router.get('/api/clicks/:id', async (req, res) => {
    const { params: { id}} = req

    try {
        res.json({ data: Date.now() })
    } catch(err) { return res.status(400) }
})

router.get('/api/linkitem/:id', async (req, res) => {
    

    res.json({error: false})
})

module.exports = router