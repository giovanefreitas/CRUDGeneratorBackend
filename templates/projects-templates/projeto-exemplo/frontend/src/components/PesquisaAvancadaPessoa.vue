<template>
  <div :id="id" class="modal fade" tabindex="-1" :aria-labelledby="id" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Pesquisa avançada</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row">
              <div class="col-4 mb-3">
                <label for="input-cpf-cnpj" class="form-label">CPF/CNPJ</label>
                <input-cpf-cnpj id="input-cpf-cnpj" class="form-control" v-model="parametros.codigoNacional" 
                  @keydown.enter="pesquisar" />
              </div>

              <div class="col-8 mb-3">
                <label for="input-nome" class="form-label">Nome</label>
                <input id="input-nome" class="form-control" v-model="parametros.nome" autofocus
                  @keydown.enter="pesquisar" />
              </div>
            </div>
            <div class="row">
              <div class="col-4 mb-3">
                <label class="form-label">Data de nascimento</label>
                <input-date class="form-control" v-model="parametros.dataNascimento" 
                  @keydown.enter="pesquisar" />
              </div>

              <div class="col-8 mb-3">
                <label class="form-label">e-mail</label>
                <input class="form-control" v-model="parametros.email" @keydown.enter="pesquisar" />
              </div>
            </div>
            <div class="row">
              <div class="col-4 mb-3">
                <label class="form-label">CEP</label>
                <input-cep class="form-control" v-model="parametros.cep" @keydown.enter="pesquisar" />
              </div>
              <div class="col-8 mb-3">
                <label class="form-label">Endereço</label>
                <input class="form-control" v-model="parametros.logradouro" @keydown.enter="pesquisar" />
              </div>
            </div>

            <div class="row">
              <div class="col-5 mb-3">
                <label class="form-label">Bairro</label>
                <input class="form-control" v-model="parametros.bairro" @keydown.enter="pesquisar" />
              </div>
              <div class="col-5 mb-3">
                <label class="form-label">Município</label>
                <input class="form-control" v-model="parametros.municipio" @keydown.enter="pesquisar" />
              </div>
              <div class="col-2 mb-3">
                <label class="form-label">UF</label>
                <input class="form-control input-uppercase" v-model="parametros.uf" 
                  @keydown.enter="pesquisar" />
              </div>
            </div>

            <div class="row">
              <div class="col-8 mb-3">
                <label class="form-label">Contato</label>
                <input class="form-control" v-model="parametros.nomeContato" @keydown.enter="pesquisar" />
              </div>
              <div class="col-4 mb-3">
                <label class="form-label">Telefone</label>
                <input-telefone class="form-control" v-model="parametros.telefone" @keydown.enter="pesquisar" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="fechar">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary"  data-bs-dismiss="modal" @click="pesquisar">
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputTelefone from "./Telefone.vue";
import InputCpfCnpj from "./CpfCnpj.vue";
import InputDate from "./InputDate.vue";
import InputCep from "./Cep.vue";

import { ref, watch } from "@vue/runtime-core";

const props = defineProps({
  modelValue: String,
  ativo: { type: Boolean, default: false },
  id: { type: String, default: "pesquisa-avancada-pessoa" },
});

const emits = defineEmits(['pesquisar', 'fechar'])

const exibirMensagemValidacao = ref(true);
var parametros = ref({
      nome: "",
      codigoNacional: "",
      dataNascimento: "",
      logradouro: "",
      bairro: "",
      municipio: "",
      uf: "",
      cep: "",
      telefone: "",
      email: "",
      nomeContato: "",
    });

watch(
  () => props.modelValue,
  (newValue) => {parametros.value = Object.assign({}, newValue)}
);


function pesquisar() {
  console.log('enviando pesquisa: ', parametros.value);
  emits("pesquisar", parametros.value);
}

function fechar() {
  emits("fechar", false);
}

</script>

<style>
.input-uppercase input {
  text-transform: uppercase;
}
</style>
