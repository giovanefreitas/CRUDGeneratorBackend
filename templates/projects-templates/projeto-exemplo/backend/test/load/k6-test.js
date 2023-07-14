import { check } from "k6";
import http from "k6/http";
import { sleep } from "k6";
import { gerarPessoa } from "../util/gerador-dados.js";

//Documentação: https://k6.io/

export let options = {
  //vus: 5,
  vus: 100,
  duration: "10s",
  setupTimeout: "240s",
};

export function setup() {
  var alunos = [];
  for (var i = 0; i < 5; i++) {
    alunos.push(gerarPessoa());
  }

  return {
    alunos,
    url: "http://140.238.183.110/api",
    //url: 'http://192.168.100.13:3000',//IP Local
  };
} 

export default function (data) {
  // var url = `${data.url}/login`;
  // var payload = JSON.stringify({
  //   email: "jose@gestao.vip",
  //   senha: "secret",
  // });
  var params = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  };
  // var res = http.post(url, payload, params);
  // check(res, {
  //   "is status 200": (r) => r.status === 200,
  // });
  // //sleep(1);

  // if (res.status == 200) {
  //   params.headers["Authorization"] = "Bearer " + JSON.parse(res.body).token;
  // }

  var url = `${data.url}/alunos?ordenar=nome&inversa=false&pagina=1&textoBusca=`;
  //res = http.options(url);
  //check(res, {
  //    'is status 200': (r) => r.status === 200,
  //});
  var res = http.get(url, params);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  //sleep(1);

  for (var id = 1; id <= 5; id++) {
    params.tags = {
      name: "RecuperaAluno",
    };
    res = http.get(`${data.url}/alunos/${id}`, params);
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
  }

  data.alunos.forEach((aluno) => {
    params.tags = {
      name: "CriarAluno",
    };

    var novoAluno = {
      codigoNacional: aluno.codigo_nacional,
      nome: aluno.nome,
      email: aluno.email,
      telefone: aluno.telefone,
      endereco: aluno.endereco
    }

    delete novoAluno.endereco.data_alteracao;
    delete novoAluno.endereco.data_cadastro;
    novoAluno.endereco.numero = novoAluno.endereco.numero.toString();

    res = http.post(`${data.url}/alunos/`, JSON.stringify(novoAluno), params);
    
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
  });
}

export function teardown(data) {
  // 4. teardown code
}
