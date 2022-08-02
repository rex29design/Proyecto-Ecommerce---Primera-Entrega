const express = require("express")
//Models
const Product = require("./model/Product")
const Cart = require("./model/Cart")
//Routes
const products = require("./router/products")
const shoppingCart = require("./router/cart")

const PORT = process.env.PORT || 8080

//Config EJS
const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//Bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

//------------------------------------

const db = new Product("productos.json")
const dcart = new Cart("mycart.json")

const validateADmin = (req, res, next) => {
    if("admin" in req.headers) {
        next()
    }else {
        res.status(400)
        res.send("Debe ser admin")
    }
}

//Get index form

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"))

app.use("/products", products)

app.use("/cart", shoppingCart)


//Get product by Id
app.get("/update/:id", validateADmin, async(req, res) => {
    const data = await db.getOneData(req.params.id)
    res.render("form_update", {data})
})


//Update product
app.post('/update-products', (req, res) => {
    console.log(req)
    db.update(req.body)
        .then(() => res.redirect('/products'))
        .catch(e => {
            console.log(e);
            res.send('Error to save')
        })
})

//Delete product
app.post("/delete-products", validateADmin, (req, res) => {
    db.deleteById(req.body.id)
        .then(() => res.redirect("/products"))
        .catch(e => {
            console.log(e);
            res.send("Error to delete")
        })
})

//Delete product from cart
app.post("/delete-from-cart", (req, res) => {
    dcart.deleteById(req.body.id)
        .then(() => res.redirect("/cart"))
        .catch(e => {
            console.log(e);
            res.send("Error to delete")
        })
})

//------------------------------------------------

const server = app.listen(PORT, () => {
    console.log(`Server listening [${PORT}]...`);
})

server.on("error", e => console.log("Error on server"));