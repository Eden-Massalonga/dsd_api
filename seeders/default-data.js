const sequelize = require('../config/database');

const Vinculo = require('../models/vinculo');
const Servico = require('../models/servico');

sequelize.authenticate()
    .then(async () => {
        console.log('Conected to database');
        console.log('Inserting data ...');
        await Vinculo.bulkCreate([
            {designacao: 'Estudante'},
            {designacao: 'Docente'},
            {designacao: 'Corpo Tecnico Administrativo'},
            {designacao: 'Investigador'},
            {designacao: 'Outro'}
        ]);

        await Servico.bulkCreate([
            {designacao: 'Copia de Documentos'},
            {designacao: 'Acesso Remoto - LibHub UEM'}
        ]);
        console.log('Done!');
    })
    .catch((err) => console.log(err));