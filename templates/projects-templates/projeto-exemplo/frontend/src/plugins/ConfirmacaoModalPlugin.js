export default {
  install: (app, options) => {
    const emitter = app.config.globalProperties.$emitter;

    const confirmar = async (mensagem) => {
      console.log("Abrindo popup");
      emitter.emit("exibir-confirmacao", { mensagem });

      return new Promise(function (resolve, reject) {
        console.log("retornando promise");
        emitter.on("fechar-confirmacao", (resposta) => {
          console.log("Resolvendo", resposta);
          resolve(resposta);
        });
      });
    };

    app.config.globalProperties.$confirmar = confirmar;
    app.provide("$confirmar", confirmar);
  },
};
