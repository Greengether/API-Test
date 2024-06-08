const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json()) //Middleware on every request to automatically parse JSON

app.listen(
    PORT, () => console.log("live on localhost:" + PORT)
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