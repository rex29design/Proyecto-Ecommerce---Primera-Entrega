const express = require("express")
const { Router } = express
const Cart = require("../model/Cart")
const Product = require("../model/Product")

const shoppingCart = Router()

const db = new Product("productos.json")
const dcart = new Cart("mycart.json")
//---------------

shoppingCart.post('/', (req, res) => {
    console.log(req)
    dcart.save(req.body)
        .then(() => res.redirect("/products"))
        .catch(e => {
            console.log(e);
            res.send('Error to save')
        })
})

shoppingCart.get("/:id", async(req, res) => {
    const db = await db.getOneData(req.params.id)
    res.render("cart", {data})
})

shoppingCart.get('/', (req, res) => {
    dcart.getData(req.body)
        .then( data => res.render('cart', { data } ))
        .catch(e => {
            console.log(e);
            res.send('Error to load data')
        })
})

//---------------

module.exports = shoppingCart