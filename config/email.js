'use strict';

const nodemailer = require('nodemailer');
const moment = require('moment');

const path = require('path');

const displayName = 'SGP UEM';

async function sendEmail(destinatario, mensagem) {
    const { nome, detalhes, data, servico, comprovativo} = mensagem;

    try {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: '587',
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        let info = await transporter.sendMail({
            from: `"${displayName}" <${testAccount.user}>`,
            to: destinatario,
            subject: `Pedido: ${servico} - ${nome}`,
            html: messageBuilder(nome, servico, data, detalhes),
            attachments: [
                // {
                //     filename: 'uem.png',
                //     path: path.join(__dirname, '../public/img/logo.png'),
                //     cid: 'sgpuem@localhost.com'
                // },
                {
                    // filename: `Comprovativo - ${nome}.pdf`,
                    href: comprovativo
                }
            ]
        });

        if (!info) {
            throw new Error('Unable to send mail');
        }

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    } catch (error) {
        console.log('Faileded sending mail: ', error);
    }

}

function messageBuilder(nome, servico, data, detalhes) {
    return `
    <h1 style="padding: 10px; text-align: center; text-shadow: 2px 1px 3px black; color: white; background-image: url(http://localhost:4000/fundo.jpg">${servico}</h1> 
    
    <p>Estimado(a) <b>${nome}</b> recebemos o
     seu pedido de <b>${servico}</b> no dia <b>${data}</b>, com a seguinte descricao: </p>

        <p>${detalhes}</p>

    <p>Aguarde a resposta em sua caixa de entrada.</p>
    <hr>
    <h5>DSD UEM</h5>
    `;
}

module.exports = sendEmail;