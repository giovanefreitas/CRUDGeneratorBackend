<template>
  <v-autocomplete
    :value="value"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    clearable
    open-on-clear
    item-text="nome"
    return-object
    label="Aluno"
    @input="$emit('input', $event)"
    @keydown="buscarAlunos"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          Digite um nome ou CPF/CNPJ para iniciar a pesquisa
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #item="{ item }">
      <v-list-item-avatar
        color="indigo"
        class="headline font-weight-light white--text"
      >
        {{ item.nome.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content data-test="autocomplete-aluno-option">
        <v-list-item-title v-text="item.nome" />
        <v-list-item-subtitle v-text="item.symbol" />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  model: { prop: "value", event: "input" },
  props: {
    value: {
      type: [Object],
      default: null,
    },
  },
  data: () => ({
    timerId: null,
    isLoading: false,
    items: [],
    search: "",
  }),

  watch: {
    value(novo) {
      if (!novo) return;

      if (this.items.indexOf(novo) == -1) {
        this.items.push(novo);
      }
    },
  },

  mounted() {
    if (!this.value) return;

    if (this.items.indexOf(this.value) == -1) {
      this.items.push(this.value);
    }
  },

  methods: {
    buscarAlunos(evt) {
      var texto = (this.search ?? "") + evt.key;
      // cancel pending call
      clearTimeout(this.timerId);

      if (!texto) {
        return;
      }

      // delay new call 500ms
      this.timerId = setTimeout(() => {
        this.isLoading = true;

        axios
          .get(`${import.meta.env.VITE_APP_URL_API}/alunos`, {
            params: {
              pagina: 1,
              textoBusca: texto,
              ordenar: "nome",
            },
          })
          .then((response) => {
            this.items = response.data.resultados;
          })
          .finally(() => (this.isLoading = false));
      }, 500);
    },
  },
};
</script>
