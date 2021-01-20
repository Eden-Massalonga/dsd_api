const express = require('express');
const router = express.Router();
router.use(express.json());

const Vinculo = require('../models/vinculo');

router.get('/vinculos', async function (req, res) {
    try {
        const vinculos = await Vinculo.findAll();

        if (!vinculos)
            throw Error('Unable to find Vinculos');
        
        res.send(vinculos);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

module.exports = router;