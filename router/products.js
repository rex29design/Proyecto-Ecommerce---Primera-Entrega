const express = require("express")
const { Router } = express
const Product = require("../model/Product")

const products = Router()

const db = new Product("productos.json")

const validateADmin = (req, res, next) => {
    if("admin" in req.headers) {
        next()
    }else {
        res.status(400)
        res.send("Debe ser admin")
    }
}

//Get data products
products.get('/', (req, res) => {
    db.getData()
        .then( data => res.render('products', { data } ))
        .catch(e => {
            console.log(e);
            res.send('Error to load data')
        })
})
    
//Save products
products.post('/',validateADmin, (req, res) => {
    db.save(req.body)
        .then(() => res.redirect("/?"))
        .catch(e => {
            console.log(e);
            res.send('Error to save')
        })
})





module.exports = products