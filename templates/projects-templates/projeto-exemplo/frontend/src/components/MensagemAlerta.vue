<template>
  <div
    v-if="mensagemErro"
    class="alert alert-danger alert-dismissible"
    role="alert"
    top
    data-test="mensagem-erro"
    :width="'95%'"
    :color="'error'"
    :timeout="-1"
  >
    <span v-for="texto in erros" :key="texto">{{ texto }}</span>
    <button
      type="button"
      class="btn-close"
      aria-label="Fechar"
      @click="emits('limparErros')"
    ></button>
  </div>
  <div
    v-if="mensagemSucesso"
    class="alert alert-success alert-dismissible"
    role="alert"
    top
    data-test="mensagem-sucesso"
    :width="'95%'"
    :color="'error'"
    :timeout="-1"
  >
    <span v-for="texto in mensagens" :key="texto">{{ texto }}</span>
    <button
      type="button"
      class="btn-close"
      aria-label="Fechar"
      @click="emits('limparErros')"
    ></button>
  </div>
</template>

<script setup>
import { computed } from "@vue/runtime-core";

const props = defineProps({
  mensagemErro: { type: String, required: false },
  mensagemSucesso: { type: String, required: false },
});

const emits = defineEmits(["limparErros", "limparSucessos"]);

const erros = computed(() => {
  if (props.mensagemErro) {
    if (Array.isArray(props.mensagemErro)) {
      return props.mensagemErro;
    } else {
      return [props.mensagemErro];
    }
  } else {
    return null;
  }
});

const mensagens = computed(() => {
  if (props.mensagemSucesso) {
    if (Array.isArray(props.mensagemSucesso)) {
      return props.mensagemSucesso;
    } else {
      return [props.mensagemSucesso];
    }
  } else {
    return null;
  }
});
</script>
