<template>
  <div
    id="modal-confirmacao"
    ref="modalConfirmacao"
    class="modal fade"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirme antes de prosseguir</h5>
          <button
            type="button"
            class="btn"
            aria-label="Fechar"
            @click="emitter.emit('fechar-confirmacao', false)"
          >
            <i class="bi bi-x-square"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ mensagemConfirmacao }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            @click="emitter.emit('fechar-confirmacao', true)"
          >
            Sim
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="emitter.emit('fechar-confirmacao', false)"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useEmitter from "../composables/useEmitter";
import { Modal } from "bootstrap";
import { onMounted, ref } from "@vue/runtime-core";

const emitter = useEmitter();

const modalConfirmacao = ref(null);
const mensagemConfirmacao = ref(null);

onMounted(() => {
  console.log(modalConfirmacao.value);
  const modal = new Modal(modalConfirmacao.value);

  emitter.on("exibir-confirmacao", opcoes => {
    mensagemConfirmacao.value = opcoes.mensagem;
    modal.show()
  });
  emitter.on("fechar-confirmacao", resposta => {
    mensagemConfirmacao.value = "";
    modal.hide();
  });
});


</script>