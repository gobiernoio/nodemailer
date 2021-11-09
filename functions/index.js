// Importamos las librerias que vamos a usar
const functions = require("firebase-functions");
const express = require("express");
const nodemailer = require("nodemailer");
const { message } = require("statuses");
const { response } = require("express");
const cors = require("cors")({origin: true});

// Creamos el transporter con la configuración de nuestro correo.
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "MAIL",
        pass: "PASSWORD"
    }
});

const app = express();


// ========================================================================
//  Get para la página de inicio
// ========================================================================
app.get("/", function(req, res) {
  res.send("Servidor nodemailer funcionando...");
});

// ========================================================================
//  Get para la página de inicio
// ========================================================================
app.post("/node-mailer", function(req, res) {
    cors(req, res, () => {

        let messageHtml = buildMessage(req.body);
        let mailOptions = buildMailOptions(req, messageHtml);

        transporter.sendMail(mailOptions, function(err, response) {
            if (err) {
                sendErrorResponse(err);
            } else {
                // sendSuccessResponse(req, res, response);

                const respuesta = {
                    req: req, 
                    res: res, 
                    response: response, 
                    body: `Suigue Se envió correctamente a ${req.body.destinatario}`
                }
            
                res.status(200).json(respuesta);
            }
        });  

    })
});


function sendSuccessResponse(req, res, response){
    const respuesta = {
        req: req, 
        res: res, 
        response: response, 
        body: `Suigue Se envió correctamente a ${req.body.destinatario}`
    }

    res.status(200).json(respuesta);
}


function sendErrorResponse(err){
    res.status(500).json(err);
}


function buildMessage(request){
    let messageHtml = "";

    Object.keys(request).forEach(function(key) {
        const nombre = `<b>${key.charAt(0).toUpperCase()}${key.slice(1)}</b>`;
        const valor = request[key];
        messageHtml += `${nombre}: ${valor}<br>`;
    });

    return messageHtml;
};



function buildMailOptions(req, message){
    let options = {
        to: req.body.destinatario,
        subject: req.body.asunto,
        html: message,
    };
    
    return options;
};


exports.gioNodemailer = functions.https.onRequest(app);
