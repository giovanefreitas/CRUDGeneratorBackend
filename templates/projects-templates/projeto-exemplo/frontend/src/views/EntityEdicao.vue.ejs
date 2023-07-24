<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <div class="row">
        <div class="col-1">
          <button type="button" class="btn btn-link" @click="router.push('/avaliacoes-diagnosticas')">
            <i class="bi bi-arrow-left-circle"></i>
          </button>
        </div>
        <div class="col">
          <h1 class="h2">{{ tituloFormulario }}</h1>
        </div>
      </div>

      <div class="btn-toolbar mb-2 mb-md-0" v-show="avaliacaoDiagnosticaSelecionada.id">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="criarNovo()">
            <i class="bi bi-file-earmark-plus"></i>Novo
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="excluirRegistro()">
            <span v-if="!excluindoRegistro"><i class="bi bi-trash-fill"></i>Excluir</span>
            <span v-if="excluindoRegistro">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Excluindo...
            </span>
          </button>
        </div>
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="recarregar(route.params.id)">
            <i class="bi bi-arrow-clockwise"></i>Atualizar
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="carregandoAvaliacaoDiagnostica"
            @click="exportar()">
            <i class="bi bi-file-earmark-arrow-down-fill"></i>Imprimir
          </button>
        </div>
      </div>
    </div>

    <indicador-carregando v-if="carregandoAvaliacaoDiagnostica" />

    <mensagem-alerta :mensagem-erro="mensagemErro" :mensagem-sucesso="mensagemSucesso"
      @limpar-erros="mensagemErro = null" @limpar-sucessos="mensagemSucesso = null"></mensagem-alerta>

    <form ref="form">
      <div class="container" @change="formularioAlterado()">
        <div class="row">
          <div class="col-12">
            <label>Código: </label>
            <span>{{ avaliacaoDiagnosticaSelecionada.id }}</span>
          </div>
        </div>

        <div class="col-8 mb-3">
          <label for="input-nome" class="form-label">Resumo</label>
          <input id="input-nome" class="form-control" v-model="avaliacaoDiagnosticaSelecionada.resumo" autofocus />
        </div>
        <div class="col-8 mb-3">
          <label for="input-nome" class="form-label">Descrição</label>
          <textarea id="input-nome" class="form-control" rows="4" v-model="avaliacaoDiagnosticaSelecionada.descricao" />
        </div>
      </div>
    </form>

    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <button type="button" class="btn btn-outline-danger" @click="router.push('/avaliacoes-diagnosticas')">
          Cancelar
        </button>
      </div>
      <div class="btn-group me-2">
        <button type="button" class="btn btn-primary" @click="gravar">
          <span v-if="!gravandoAvaliacaoDiagnostica">Gravar</span>
          <span v-if="gravandoAvaliacaoDiagnostica">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Gravando...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { computed, inject, watch } from "@vue/runtime-core";
import { cloneDeep } from "lodash";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import constantes from "../helper/constantes";
import IndicadorCarregando from "../components/IndicadorCarregando.vue";
import MensagemAlerta from "../components/MensagemAlerta.vue";

const router = useRouter();
const route = useRoute();

const $confirmar = inject("$confirmar");

const avaliacaoDiagnosticaEmBranco = () => ({
  resumo: "",
  descricao: "",
});

var modeloAlterado = ref(false);
var mensagemErro = ref(null);
var mensagemSucesso = ref(null);
var carregandoAvaliacaoDiagnostica = ref(false);
var gravandoAvaliacaoDiagnostica = ref(false);
var excluindoRegistro = ref(false);
var avaliacaoDiagnosticaSelecionada = ref(avaliacaoDiagnosticaEmBranco());

carregarAvaliacaoDiagnostica(route.params.id);

onBeforeRouteLeave((to, from, next) => {
  if (modeloAlterado.value) {
    this.$confirm("Tem certeza que seja sair sem salvar?").then((res) => {
      if (res) {
        next();
      }
    });
  } else {
    next();
  }
});

const tituloFormulario = computed(() => {
  return (
    (avaliacaoDiagnosticaSelecionada.value.id ? "Editar" : "Nova") +
    " Avaliação Diagnóstica"
  );
});

watch(
  () => route.params,
  async (newParams) => {
    console.log("newParams", newParams);
    carregarAvaliacaoDiagnostica(newParams.id);
  }
);

function formularioAlterado() {
  modeloAlterado.value = true;
}

function recarregar(id) {
  mensagemErro.value = null;
  mensagemSucesso.value = null;
  if (modeloAlterado.value) {
    $confirmar("Tem certeza que deseja descartar todas as alterações?").then(
      (res) => {
        if (res) {
          carregarAvaliacaoDiagnostica(id);
        }
      }
    );
  } else {
    carregarAvaliacaoDiagnostica(id);
  }
}

function carregarAvaliacaoDiagnostica(id) {
  mensagemErro.value = null;
  mensagemSucesso.value = null;
  if (id && id > 0) {
    const request = new Request(
      `${import.meta.env.VITE_APP_URL_API}/avaliacoes-diagnosticas/${id}`
    );

    carregandoAvaliacaoDiagnostica.value = true;

    fetch(request)
      .then(async (response) => {
        if (response.ok) {
          if (response.status != 204) {
            return response.json();
          } else {
            mensagemErro.value = constantes.ERRO_REGISTRO_NAO_ENCONTRADO;
            return Promise.resolve(avaliacaoDiagnosticaEmBranco());
          }
        } else {
          console.log(response.statusText);
          if (/application\/json/i.test(response.headers.get('Content-Type'))) {
            const dados = await response.json();
            if (dados.mensagem) {
              mensagemErro.value = dados.mensagem;
            } else {
              mensagemErro.value = constantes.ERRO_DESCONHECIDO;
            }
          } else {
            response.text().then((body) => console.log("Erro recebido:", body));
            mensagemErro.value = constantes.ERRO_DESCONHECIDO;
          }
        }
      })
      .then((data) => {
        avaliacaoDiagnosticaSelecionada.value = data;
        carregandoAvaliacaoDiagnostica.value = false;
      })
      .catch((err) => {
        console.log(err);
        carregandoAvaliacaoDiagnostica.value = false;
        mensagemErro.value = constantes.ERRO_DESCONHECIDO;
      });
  } else {
    avaliacaoDiagnosticaSelecionada.value = avaliacaoDiagnosticaEmBranco();
  }
}

function exportar() {
  mensagemErro.value = null;
  mensagemSucesso.value = null;
  console.log("Não implementado.");
}

function gravar() {
  mensagemErro.value = null;
  mensagemSucesso.value = null;

  const parametroId = avaliacaoDiagnosticaSelecionada.value.id
    ? `/${avaliacaoDiagnosticaSelecionada.value.id}`
    : "";
  const metodoHttp = avaliacaoDiagnosticaSelecionada.value.id ? "PUT" : "POST";

  const request = new Request(
    `${import.meta.env.VITE_APP_URL_API}/avaliacoes-diagnosticas` + parametroId,
    {
      method: metodoHttp,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(avaliacaoDiagnosticaSelecionada.value),
    }
  );

  console.log("Gravando item: ", avaliacaoDiagnosticaSelecionada.value);

  gravandoAvaliacaoDiagnostica.value = true;
  fetch(request)
    .then(async (response) => {
      if (response.ok) {
        mensagemSucesso.value = "Avaliação Diagnóstica atualizada com sucesso.";
        return response.json();
      } else {
        console.log(response.statusText);
        if (/application\/json/i.test(response.headers.get('Content-Type'))) {
          const dados = await response.json();
          if (dados.mensagem) {
            mensagemErro.value = dados.mensagem;
          } else {
            mensagemErro.value = constantes.ERRO_DESCONHECIDO;
          }
        } else {
          response.text().then((body) => console.log("Erro recebido:", body));
          mensagemErro.value = constantes.ERRO_DESCONHECIDO;
        }
      }
    })
    .then((data) => {
      avaliacaoDiagnosticaSelecionada.value = Object.assign(
        avaliacaoDiagnosticaSelecionada.value,
        data
      );
      modeloAlterado.value = false;
      gravandoAvaliacaoDiagnostica.value = false;
    })
    .catch((err) => {
      console.log(err);
      gravandoAvaliacaoDiagnostica.value = false;
      mensagemErro.value = constantes.ERRO_DESCONHECIDO;
    });
}

function excluirRegistro() {
  mensagemErro.value = null;
  mensagemSucesso.value = null;
  $confirmar(
    `Você tem certeza que deseja excluir a avaliação diagnóstica "${avaliacaoDiagnosticaSelecionada.value.resumo}"?`
  ).then((ok) => {
    if (ok) {
      const request = new Request(
        `${import.meta.env.VITE_APP_URL_API}/avaliacoes-diagnosticas/${avaliacaoDiagnosticaSelecionada.value.id
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      excluindoRegistro.value = true;
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            mensagemSucesso.value =
              'A avaliação diagnóstica "' +
              avaliacaoDiagnosticaSelecionada.value.resumo +
              '" foi excluída com sucesso. ';
            avaliacaoDiagnosticaSelecionada.value =
              avaliacaoDiagnosticaEmBranco();
            return Promise.resolve();
          } else {
            console.log(response.statusText);
            if (/application\/json/i.test(response.headers.get('Content-Type'))) {
              const dados = await response.json();
              if (dados.mensagem) {
                mensagemErro.value = dados.mensagem;
              } else {
                mensagemErro.value = constantes.ERRO_DESCONHECIDO;
              }
            } else {
              response.text().then((body) => console.log("Erro recebido:", body));
              mensagemErro.value = constantes.ERRO_DESCONHECIDO;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          excluindoRegistro.value = false;
          mensagemErro.value = constantes.ERRO_DESCONHECIDO;
        });
    }
  });
}

function criarNovo() {
  mensagemErro.value = null;
  mensagemSucesso.value = null;
  mensagemErro.value = "";
  mensagemSucesso.value = "";
  avaliacaoDiagnosticaSelecionada.value = avaliacaoDiagnosticaEmBranco();
}
</script>
