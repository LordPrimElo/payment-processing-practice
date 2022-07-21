require("dotenv").config()

const express = require("express")
const app = express()

app.use(express.json())

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.get("/", (req, res) => {
    res.render("index")
})

const storeItems = new Map([
    [1, {priceInCents: 10000, name: "Learn React"}],
    [2, {priceInCents: 20000, name: "Learn CSS"}],
    [3, {priceInCents: 30000, name: "Learn Angular"}]
])

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000")
})