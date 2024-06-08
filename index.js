require('dotenv').config()

const express = require('express');
const app = express();

const db = require("./db")

app.use(express.json()) //Middleware on every request to automatically parse JSON

app.listen(
    process.env.PORT, () => console.log("live on localhost:" + process.env.PORT)
)

//Create HTTP GET endpoint
app.get('/event', (req, res) => {
    res.status(200).send({
        name: "Example",
        location: "Mannheim"
    })
})

//Dynamic POST endpoint
app.post('/event/:id', (req, res) => {
    const { id } = req.params 
    const { title } = req.body
    
    if (!title) {
        res.status(422).send({message: "No title provided!"})
    }

    res.send({
        event: `Event ${id} called ${title}`
    })
})
