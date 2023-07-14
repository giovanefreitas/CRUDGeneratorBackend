import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/bootstrap-icons.svg";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapIcons from "bootstrap-icons/bootstrap-icons.svg";
import TabelaDados from "./components/TabelaDados.vue";
import ConfirmacaoModalPlugin from "./plugins/ConfirmacaoModalPlugin";

const app = createApp(App);

const emitter = mitt();
app.config.globalProperties.$emitter = emitter;

app.component("TabelaDados", TabelaDados);

app.directive("mask", (el, binding) => {
  el.value = binding.value;
});

app.use(ConfirmacaoModalPlugin);

app.use(router);

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    let [resource, config ] = args;
    //resource.headers.append('Authorization', 'Bearer ' + keycloak.token);
    return originalFetch(resource, config);
};

app.mount("#app");
