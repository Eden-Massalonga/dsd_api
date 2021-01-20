const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
router.use(express.json());

const Pedido = require('../models/pedido');
const Servico = require('../models/servico');
const Utente = require('../models/utente');
const Vinculo = require('../models/vinculo');
const emailSend = require('../config/email');

const uploadsFolderPath = path.join(__dirname, '../uploads');
router.use('/uploads', express.static(uploadsFolderPath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolderPath);
    },
    filename: function (req, file, cb) {
        // if(file.mimetype === 'image/png')
        //     cb(null, file.originalname + '.png');
        // else
        //     if(file.mimetype === 'image/jpeg')
        //         cb(null, file.originalname + '.jpg');      
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    }
});

router.get('/pedidos', async function (req, res) {
    try {
        const email = req.query.email;
        var pedidos;

        if(email != null && email != '')
            pedidos = await Pedido.findAll({
                attributes:{
                    exclude: ['utenteId', 'servicoId']
                },
                include: [
                    {
                        model: Servico
                    },
                    {
                        model: Utente,
                        attributes: {
                            exclude: ['vinculoId']
                        },
                        where: {
                            email: email
                        },
                        include: [
                            {
                                model: Vinculo
                            }
                        ]
                    }
                ]
            });
        else
            pedidos = [];
            // pedidos = await Pedido.findAll({
            //     attributes:{
            //         exclude: ['utenteId', 'servicoId']
            //     },
            //     include: [
            //         {
            //             model: Servico
            //         },
            //         {
            //             model: Utente,
            //             attributes: {
            //                 exclude: ['vinculoId']
            //             },
            //             include: [
            //                 {
            //                     model: Vinculo
            //                 }
            //             ]
            //         }
            //     ]
            // });

        if (!pedidos)
            throw Error('Unable to find Pedidos');
        
        res.send(pedidos);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

router.post('/pedidos', upload.single('comprovativo'), async function(req, res){
    try {
        const {nome, email, vinculoId} = req.body;

        // const utente = await Utente.findOrCreate({
        //     where: {
        //         nome,
        //         email,
        //     }
        // }); 

        var utente = await Utente.findOne({
            where: {
                email: email
            }
        });

        var comprovativo;

        if (req.file != null) {
            comprovativo = `http://localhost:4000/uploads/${req.file.originalname}`;
        }

        console.log(comprovativo);
        
        if(!utente){
            utente = await Utente.create({
               nome: nome,
               email: email,
               vinculoId: vinculoId,
               comprovativo: comprovativo 
            });
        }            
        else{
            utente.nome = nome;
            utente.vinculoId = vinculoId;
            utente.comprovativo = comprovativo;

            utente = await utente.save();
        }

        const {detalhes, servicoId} = req.body;

        const pedido = await Pedido.create({
            utenteId: utente.id,
            servicoId: servicoId,
            detalhes: detalhes
        });

        if(!pedido)
            throw Error('Unable to create Pedido');

        enviaEmail(utente.nome, utente.email, servicoId, pedido.data, detalhes, comprovativo);

        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

async function enviaEmail (utenteNome, utenteEmail, servicoId, data, pedidoDetalhes, comprovativo) {
    const servico = await Servico.findByPk(servicoId);
    
    console.log(pedidoDetalhes);

    var destEmail = '';

    if(servicoId == 1)
        destEmail = 'atendimento.bce@uem.mz';
    else
        destEmail = 'bce.digital@uem.mz';

    emailSend([utenteEmail, destEmail], {servico: servico.designacao, data: data, nome: utenteNome, detalhes: pedidoDetalhes, comprovativo});
    
}

module.exports = router;
