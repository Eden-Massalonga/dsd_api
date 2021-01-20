const express = require('express');
const exphbs = require ('express-handlebars');
const moment = require('moment');
const sequelize = require('./config/database');

// const Utente = require('./models/utente');
// const Servico = require('./models/servico');

const Pedido = require('./models/pedido');

const vinculosRouter = require('./routers/vinculos');
const servicosRouter = require('./routers/servicos'); 
const pedidosRouter = require('./routers/pedidos'); 
const Utente = require('./models/utente');
const Servico = require('../../../Matiyanga/adem_cc_web/models/servico');
const Vinculo = require('./models/vinculo');


const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use(vinculosRouter);
app.use(servicosRouter);
app.use(pedidosRouter);

var hbs = exphbs.create({
    defaultLayout: 'home',
    helpers: {
        getMes(){
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();

            var mes = '';
            
            switch (month) {
                case 1: mes = 'Janeiro'; break;
                case 2: mes = 'Fevereiro'; break;
                case 3: mes = 'Marco'; break;
                case 4: mes = 'Abril'; break;
                case 5: mes = 'Maio'; break;
                case 6: mes = 'Junho'; break;
                case 7: mes = 'Julho'; break;
                case 8: mes = 'Agosto'; break;
                case 9: mes = 'Setembro'; break;
                case 10: mes = 'Outubro'; break;
                case 11: mes = 'Novembro'; break;
                case 12: mes = 'Dezembro'; break;
                
            
                default:
                    break;
            }

            return mes + ' de ' + year;
        },
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', async function(req, res){

    try {
        const pedidos = await Pedido.findAll({
            include: [
                {
                    model: Servico,
                    attributes: ['designacao']
                }
            ],
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('servico.id')), 'total']
            ],

            group: ['servicoId'],

            raw: true
        });

        const utentes = await Utente.findAll({
            include: [
                {
                    model: Vinculo,
                    attributes: ['designacao']
                }
            ],
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('vinculo.id')), 'total']
            ],

            group: ['vinculoId'],

            raw: true
        });

        // console.log(utentes);

        // console.log(pedidos);

        res.render('inicio', {pedidos, utentes});    
    } catch (error) {
        res.render('inicio');
    }
});

sequelize.sync({
    force: false,
    logging: console.log
}).
    then(() => {
        console.log('Conected to database');
    }).
    catch((err) => {
        console.log('Unable to connect to database', err)
    });

console.log('Starting server ...');
app.listen(4000);
console.log('Listening on port 4000');
app.listen(4000, '192.168.43.23', () => console.log('Server running on 192.168.43.23:4000'));

