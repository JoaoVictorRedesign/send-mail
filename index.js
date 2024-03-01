const express = require('express');
const nodemailer = require('nodemailer');

// Função para gerar uma senha OTP com base no e-mail do usuário e no tempo da sessão
function gerarHash(userEmail, sessionStartTime) {
    const stringConcatenada = userEmail + ":" + sessionStartTime;
    let sum = 0;

    for (const char of stringConcatenada) {
        sum += char.charCodeAt(0);
    }

    return String(sum).slice(0, 6).padStart(6, "0");
}

// Função para enviar um e-mail com a senha OTP
async function main(userEmail, sessionStartTime) {
    const transporter = nodemailer.createTransport({
        host: "mail.redesignconsultoria.com.br",
        port: 465,
        secure: true,
        auth: {
            user: "chatbot.oficina@redesignconsultoria.com.br",
            pass: "Mecanicos@2023",
        },
    });

    const senhaOTP = gerarHash(userEmail, sessionStartTime);
    const htmlMessage = `
        <p>Esta é a senha única que você usará para autenticar no chatbot:</p>
        <p><strong>${senhaOTP}</strong></p>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Marina da Oficina" <chatbot.oficina@redesignconsultoria.com.br>',
            to: userEmail,
            subject: 'Senha Única Chatbot',
            text: senhaOTP,
            html: htmlMessage
        });

        console.log('E-mail enviado:', info.response);
        return senhaOTP;
    } catch (err) {
        console.error('Erro ao enviar o e-mail:', err);
        throw err;
    }
}

