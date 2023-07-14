<template>
  <div class="row">
    <div class="col-4">
      <nav aria-label="Paginação">
        <ul class="pagination">
          <li class="page-item">
            <button
              class="btn"
              @click="irPaginaAnterior"
              :disabled="paginaAtual == 1"
            >
              <i class="bi bi-chevron-left"></i>Anteriores
            </button>
          </li>
          <li class="page-item">
            <button
              class="btn"
              @click="irProximaPagina"
              :disabled="paginaAtual == totalPaginas"
            >
              Próximos<i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div class="col-8 text-end pt-2">
      <span>
        Exibindo de
        {{ `${primeiroItem} a ${ultimoItem}` }}
        do total de {{ totalRegistros }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const primeiroItem = computed(() => {
  return props.paginaAtual * props.tamanhoPagina - props.tamanhoPagina + 1;
});

const ultimoItem = computed(() => {
  return (props.paginaAtual - 1) * props.tamanhoPagina + props.tamanhoPagina;
});

const totalPaginas = computed(() => {
  return Math.ceil(props.totalRegistros / props.tamanhoPagina);
});

function irPaginaAnterior() {
  if (props.paginaAtual > 1) {
    emits("exibirPagina", props.paginaAtual - 1);
  }
}

function irProximaPagina() {
  if (
    props.paginaAtual < Math.ceil(props.totalRegistros / props.tamanhoPagina)
  ) {
    emits("exibirPagina", props.paginaAtual + 1);
  }
}

const props = defineProps({
  paginaAtual: { type: Number, required: true, default: 1 },
  totalRegistros: { type: Number, required: true },
  tamanhoPagina: { type: Number, required: true },
});

const emits = defineEmits(["exibirPagina"]);
</script>
