require("dotenv").config()

const e = require("express");
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static("public"))

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const storeItems = new Map([
    [1, {priceInCents: 10000, name: "Learn React"}],
    [2, {priceInCents: 20000, name: "Learn CSS"}],
    [3, {priceInCents: 30000, name: "Learn Angular"}]
])

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents
                        
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`
        })
        res.send({url: session.url})

    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000")
})