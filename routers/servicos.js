const express = require('express');
const router = express.Router();
router.use(express.json());

const Servico = require('../models/servico');

router.get('/servicos', async function (req, res) {
    try {
        const servicos = await Servico.findAll();

        if (!servicos)
            throw Error('Unable to find Servicos');
        
        res.send(servicos);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

module.exports = router;
