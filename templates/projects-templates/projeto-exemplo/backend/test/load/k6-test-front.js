import { check } from "k6";
import http from "k6/http";

const URL_TESTE = 'http://140.238.183.110/';

//Documentação: https://k6.io/

export let options = {
  vus: 100,
  duration: "10s",
};

export function setup() {
  var res = http.get(URL_TESTE);

  //expressão regular para buscar todos recursos referenciados
  var regexp = /[a-zA-Z0-9\/\.\-_]+\.(?:js|css|ico|png|jpe?g|gif|svg|map)/g;
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  const urls = [...res.body.matchAll(regexp)];

  return {
    urls,
  };
}

export default function (data) {
  var res = http.get(URL_TESTE);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  //sleep(1);

  data.urls.forEach((url) => {
    var res = http.get(`http://35.188.38.48/${url}`);
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
  });
}

export function teardown(data) {
  // 4. teardown code
}
