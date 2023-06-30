const express = require("express");
const router = express.Router();
const {
    getProducts,
    getHATEOAS,
    getProduct,
    getProductsBy
} = require("../consultas/consultas");
const mostrarConsulta = require("../middleware/middleware");

router.get("/", mostrarConsulta, (req, res) => {
    res.send("Hello World");
});

router.get("/joyas", mostrarConsulta, async (req, res) => {
    try {
        const queryStrings = req.query;
        page = +req.query.page || 1;
        const products = await getProducts(queryStrings);
        const HATEOAS = await getHATEOAS(products, page);
        res.json(HATEOAS);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/joyas/product/:id", mostrarConsulta, async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await getProduct(id);
        res.json(producto);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/joyas/filtros", mostrarConsulta, async (req, res) => {
    try {
        const consultas = req.query;
        const products = await getProductsBy(consultas);
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
