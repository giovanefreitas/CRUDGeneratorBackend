"use strict";

const base64 = require("base-64");
//const mail = require('../mail/nodemailer');
const dayjs = require("dayjs");

const COMPANY_EMAIL = "contato@empresa.com";
const COMPANY_NAME = "XPTO";

exports.sendCreateMail = (email, passcode, config) => {
  const token = base64.encode(`${email}:${passcode}`);
  if (email) {
    sendmail(
      {
        fromName: COMPANY_NAME,
        from: COMPANY_EMAIL,
        to: email,
        subject: `Bem vindo(a) ${email} A sua Conta foi criada com sucesso!`,
        body: `<p>Seu administrador de sistema lhe enviou um link de acesso ao sistema, por favor entre e troque sua senha. </p><p><a href=${process.env.APP_URL}/welcome/${token}>${process.env.APP_URL}/welcome/${token}</a></p>`,
        isHtml: true,
      },
      config
    );
  }
};

exports.sendForgotMail = (email, config) => {
  const expirationData = dayjs().add(1, "h").format();
  const token = base64.encode(`${email}#${expirationData}`);
  if (email) {
    sendmail(
      {
        fromName: COMPANY_NAME,
        from: COMPANY_EMAIL,
        to: email,
        subject: "XPTO - Esquecimento de senha!",
        body: `<p>Alguem, esperamos que seja você, requisitou uma nova senha de acesso para o sistema. </p><p><a href=${process.env.APP_URL}/forgot/${token}>${process.env.APP_URL}/forgot/${token}</a></p>`,
        isHtml: true,
      },
      config
    );
  }
};

function sendmail(email, config) {
  console.log(email);
}
