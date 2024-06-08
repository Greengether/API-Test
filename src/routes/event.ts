import express from 'express'
const router = express.Router()

/* HTTP endpoints relative to /event path */
// Get all
router.get('/', (req, res) => {
    res.send("Requested all events.")
})

// Get one
router.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(`Event ${id} requested.`)
})


// Create one
router.post('/', (req, res) => {
    const { title } = req.body

    if (!title) {
        res.status(422).send({ message: "No title provided!" })
    }

    res.send(`Create event called ${title}.`)
})


// Update one
router.patch('/:id', (req, res) => {

})

// Delete one
router.delete('/:id', (req, res) => {

})


export default router