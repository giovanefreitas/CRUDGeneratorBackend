const app = require("../../app");
const request = require("supertest");
const assert = require("assert");

var tokenAcesso = null;

const decodingJWT = (token) => {
  if(token !== null || token !== undefined){
   const base64String = token.split('.')[1];
   const decodedValue = JSON.parse(Buffer.from(base64String,    
                        'base64').toString('ascii'));
   //console.log(decodedValue);
   return decodedValue;
  }
  return null;
}

// before(function (done) {
//   console.log(
//     "=========================\nINICIALIZANDO SERVIDOR E GERANDO TOKEN\n========================="
//   );
//   request(app)
//     .post("/login")
//     .send({ email: "master@gestao.vip", senha: "secret" })
//     .expect(200)
//     .expect("Content-Type", /json/)
//     .then((response) => {
//       tokenAcesso = response.body.token;
//       done();
//     })
//     .catch((err) => {
//       done(err);
//     });
// });

function getTokenAcesso() {
  return tokenAcesso;
}

function getIdPerfil() {
  //return decodingJWT(getTokenAcesso()).data.id_tenant;
  return 1;
}



module.exports = {
  app,
  getTokenAcesso,
  getIdPerfil
};
